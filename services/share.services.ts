import { sql } from "bun";

export type Permissions = { edit: boolean; create: boolean; delete: boolean };

/**
 * hasAccess()
 * SQL condition that is true if the user is the owner of the list or the list is shared with the user.
 * With a permission, the shared user also needs to have that permission.
 * The query that uses it needs to name the list table as "l".
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param userId Number
 * @param permission String
 * @returns SQL fragment
 */
export function hasAccess(userId: number, permission?: keyof Permissions) {
  if (permission === undefined) {
    return sql`(l."userId" = ${userId}
                OR l."sharedUsers" @> jsonb_build_array(jsonb_build_object('id', ${userId}::bigint)))`;
  }

  return sql`(l."userId" = ${userId}
              OR l."sharedUsers" @> jsonb_build_array(jsonb_build_object(
                  'id', ${userId}::bigint,
                  'permissions', jsonb_build_object(${permission}::text, true))))`;
}

/**
 * buildPermissions()
 * SQL expression that builds the permissions JSON.
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param permissions Object
 * @returns SQL fragment
 */
function buildPermissions(permissions: Permissions) {
  return sql`jsonb_build_object('edit', ${permissions.edit}::boolean,
                                'create', ${permissions.create}::boolean,
                                'delete', ${permissions.delete}::boolean)`;
}

/**
 * getAll()
 * Sends a async query asking for the users a list is shared with and their permissions.
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param listId Number
 * @returns Promise<Any>
 */
export async function getAll(listId: number) {
  return await sql`SELECT u.id, u.username, s->'permissions' AS permissions
                        FROM list l
                        CROSS JOIN LATERAL jsonb_array_elements(l."sharedUsers") AS s
                        JOIN users u ON u.id = (s->>'id')::bigint
                        WHERE l.id = ${listId}
                        ORDER BY u.username`;
}

/**
 * update()
 * Sends a async query replacing the permissions of a user in a list of the owner.
 * Returns undefined if the list is not shared with that user.
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param listId Number
 * @param ownerId Number
 * @param userId Number
 * @param permissions Object
 * @returns Promise<Any>
 */
export async function update(listId: number, ownerId: number, userId: number, permissions: Permissions) {
  const [share] = await sql`UPDATE list l
                                SET "sharedUsers" = (
                                    SELECT jsonb_agg(
                                        CASE WHEN (s->>'id')::bigint = ${userId}
                                        THEN jsonb_set(s, '{permissions}', ${buildPermissions(permissions)})
                                        ELSE s END ORDER BY pos)
                                    FROM jsonb_array_elements(l."sharedUsers") WITH ORDINALITY AS e(s, pos))
                                FROM users u
                                WHERE l.id = ${listId} AND l."userId" = ${ownerId} AND u.id = ${userId}
                                AND l."sharedUsers" @> jsonb_build_array(jsonb_build_object('id', ${userId}::bigint))
                                RETURNING u.id, u.username`;
  return share && { ...share, permissions };
}

/**
 * remove()
 * Sends a async query that stops sharing a list of the owner with a user.
 * Returns undefined if the list is not shared with that user.
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param listId Number
 * @param ownerId Number
 * @param userId Number
 * @returns Promise<Any>
 */
export async function remove(listId: number, ownerId: number, userId: number) {
  const [share] = await sql`UPDATE list l
                                SET "sharedUsers" = (
                                    SELECT COALESCE(jsonb_agg(s ORDER BY pos), '[]'::jsonb)
                                    FROM jsonb_array_elements(l."sharedUsers") WITH ORDINALITY AS e(s, pos)
                                    WHERE (s->>'id')::bigint <> ${userId})
                                FROM users u
                                WHERE l.id = ${listId} AND l."userId" = ${ownerId} AND u.id = ${userId}
                                AND l."sharedUsers" @> jsonb_build_array(jsonb_build_object('id', ${userId}::bigint))
                                RETURNING u.id, u.username`;
  return share;
}

// Without 0, O, 1 and I because they look the same. 32 characters, so a random byte % 32 is not biased.
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;
const CODE_DURATION = 24 * 60 * 60 * 1000;

/**
 * createCode()
 * Creates a one time code to join a list of the owner with these permissions, it expires after 24 hours.
 * It also deletes the expired codes of the list.
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param listId Number
 * @param ownerId Number
 * @param permissions Object
 * @returns Promise<Any>
 */
export async function createCode(listId: number, ownerId: number, permissions: Permissions) {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  const code = Array.from(bytes, (byte) => CODE_CHARS[byte % CODE_CHARS.length]).join("");
  const now = Date.now();

  await sql`DELETE FROM list_code WHERE "listId" = ${listId} AND "expiresAt" <= ${now}`;

  const [created] = await sql`INSERT INTO list_code (code, "listId", permissions, "expiresAt")
                                SELECT ${code}::text, l.id, ${buildPermissions(permissions)}, ${now + CODE_DURATION}::bigint
                                FROM list l
                                WHERE l.id = ${listId} AND l."userId" = ${ownerId}
                                RETURNING code, permissions, "expiresAt"`;
  return created;
}

/**
 * join()
 * Sends a async query that uses a code: deletes it and shares its list with the user, returning the list.
 * Returns undefined without using the code if it is not valid or the user already has access to the list.
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param code String
 * @param userId Number
 * @returns Promise<Any>
 */
export async function join(code: string, userId: number) {
  const [list] = await sql`WITH used AS (
                                    DELETE FROM list_code c
                                    USING list l
                                    WHERE c.code = ${code} AND c."expiresAt" > ${Date.now()}
                                    AND l.id = c."listId" AND NOT ${hasAccess(userId)}
                                    RETURNING c."listId", c.permissions)
                                UPDATE list l
                                SET "sharedUsers" = l."sharedUsers" || jsonb_build_array(jsonb_build_object(
                                    'id', ${userId}::bigint,
                                    'permissions', used.permissions))
                                FROM used
                                WHERE l.id = used."listId" AND NOT ${hasAccess(userId)}
                                RETURNING l.*`;
  return list;
}

/**
 * isCodeValid()
 * Sends a async query looking if a code exists and is not expired.
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param code String
 * @returns Promise<Boolean>
 */
export async function isCodeValid(code: string) {
  const [found] = await sql`SELECT code FROM list_code WHERE code = ${code} AND "expiresAt" > ${Date.now()}`;
  return found !== undefined;
}
