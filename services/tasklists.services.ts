import { sql } from "bun";
import { hasAccess } from "./share.services";

/**
 * getAll()
 * Sends a async query asking for the tasklists of a user and the ones shared with the user.
 *
 * @author Daniel Qu
 * @since 30/09/2026
 * @param userId Number
 * @returns Promise<Any>
 */
export async function getAll(userId: number) {
  return await sql`SELECT l.* FROM list l WHERE ${hasAccess(userId)}`;
}

/**
 * getById()
 * Sends a async query asking for a specific tasklist of a user or shared with the user.
 *
 * @author Daniel Qu
 * @since 30/09/2026
 * @param id Number
 * @param userId Number
 * @returns Promise<Any>
 */
export async function getById(id: number, userId: number) {
  const [tasklist] = await sql`SELECT l.* FROM list l WHERE l.id = ${id} AND ${hasAccess(userId)}`;
  return tasklist;
}

/**
 * create()
 * Sends a async query creating a new tasklist and returning the created row.
 *
 * @author Yu Zhang
 * @since 02/10/2026
 * @param data Object
 * @returns Promise<Any>
 */
export async function create(data: {
  name: string;
  description?: string | null;
  userId: number;
}) {
  const [tasklist] = await sql`INSERT INTO list (name, description, "userId")
                                    VALUES (${data.name}, ${data.description ?? null}, ${data.userId}) RETURNING *`;
  return tasklist;
}

/**
 * update()
 * Sends a async query updating a specific tasklist of a user and returning the updated row.
 *
 * @author Yu Zhang
 * @since 02/10/2026
 * @param id Number
 * @param userId Number
 * @param data Object
 * @returns Promise<Any>
 */
export async function update(
  id: number,
  userId: number,
  data: { name: string; description?: string | null },
) {
  const [tasklist] = await sql`UPDATE list
                                    SET name = ${data.name},
                                    description = ${data.description ?? null}
                                    WHERE id = ${id} AND "userId" = ${userId} RETURNING *`;
  return tasklist;
}

/**
 * remove()
 * Sends a async query deleting a specific tasklist of a user and returning the deleted row.
 *
 * @author Yu Zhang
 * @since 02/10/2026
 * @param id Number
 * @param userId Number
 * @returns Promise<Any>
 */
export async function remove(id: number, userId: number) {
  const [tasklist] = await sql`DELETE FROM list
                                    WHERE id = ${id} AND "userId" = ${userId} RETURNING *`;
  return tasklist;
}
