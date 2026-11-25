import { sql } from "bun";
import { hasAccess } from "./share.services";

/**
 * getAll()
 * Sends a async query asking for all task of a list that the user owns or is shared with the user.
 *
 * @author Yu Zhang
 * @since 02/10/2026
 * @param listId Number
 * @param userId Number
 * @returns Promise<Any>
 */
export async function getAll(listId: number, userId: number) {
  return await sql`SELECT t.* FROM task t
                        JOIN list l ON l.id = t."listId"
                        WHERE t."listId" = ${listId} AND ${hasAccess(userId)}`;
}

/**
 * getById()
 * Sends a async query asking for a specific task of a list that the user can see (return detailed data).
 *
 * @author Yu Zhang
 * @since 02/10/2026
 * @param id Number
 * @param userId Number
 * @returns Promise<Any>
 */
export async function getById(id: number, userId: number) {
  const [task] = await sql`SELECT t.* FROM task t
                                JOIN list l ON l.id = t."listId"
                                WHERE t.id = ${id} AND ${hasAccess(userId)}`;
  return task;
}

/**
 * create()
 * Sends a async query creating a new task only if the user owns the list or has the create permission, and returning the created row.
 *
 * @author Yu Zhang
 * @since 02/10/2026
 * @param userId Number
 * @param data Object
 * @returns Promise<Any>
 */
export async function create(
  userId: number,
  data: {
    title: string;
    description?: string | null;
    isDone: boolean;
    dueTo: number | null;
    listId: number;
    priority: number;
  },
) {
  const [task] =
    await sql`INSERT INTO task (title, description, "isDone", "dueTo", "listId", "priority")
                                SELECT ${data.title},
                                ${data.description ?? null},
                                ${data.isDone},
                                ${data.dueTo ?? null},
                                l.id,
                                ${data.priority}
                                FROM list l
                                WHERE l.id = ${data.listId} AND ${hasAccess(userId, "create")}
                                RETURNING *`;
  return task;
}

/**
 * update()
 * Sends a async query updating a specific task only if the user owns the list or has the edit permission, and returning the updated row.
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
  data: {
    title: string;
    description: string | null;
    isDone: boolean;
    dueTo: number | null;
    priority: number;
  },
) {
  const [task] = await sql`UPDATE task
                                SET title = ${data.title},
                                description = ${data.description ?? null},
                                "isDone" = ${data.isDone},
                                "dueTo" = ${data.dueTo ?? null},
                                "priority" = ${data.priority}
                                WHERE id = ${id}
                                AND "listId" IN (SELECT l.id FROM list l WHERE ${hasAccess(userId, "edit")})
                                RETURNING *`;
  return task;
}

/**
 * remove()
 * Sends a async query deleting a specific task only if the user owns the list or has the delete permission, and returning the deleted row.
 *
 * @author Yu Zhang
 * @since 02/10/2026
 * @param id Number
 * @param userId Number
 * @returns Promise<Any>
 */
export async function remove(id: number, userId: number) {
  const [task] = await sql`DELETE FROM task
                                WHERE id = ${id}
                                AND "listId" IN (SELECT l.id FROM list l WHERE ${hasAccess(userId, "delete")})
                                RETURNING *`;
  return task;
}
