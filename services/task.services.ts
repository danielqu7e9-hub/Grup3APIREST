import { sql } from "bun";

/**
 * getAll()
 * Sends a async query asking for all task of a list that belongs to the user.
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
                        WHERE t."listId" = ${listId} AND l."userId" = ${userId}`;
}

/**
 * getById()
 * Sends a async query asking for a specific task of the user (return detailed data).
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
                                WHERE t.id = ${id} AND l."userId" = ${userId}`;
  return task;
}

/**
 * create()
 * Sends a async query creating a new task only if the list belongs to the user and returning the created row.
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
                                WHERE l.id = ${data.listId} AND l."userId" = ${userId}
                                RETURNING *`;
  return task;
}

/**
 * update()
 * Sends a async query updating a specific task of the user and returning the updated row.
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
                                AND "listId" IN (SELECT id FROM list WHERE "userId" = ${userId})
                                RETURNING *`;
  return task;
}

/**
 * remove()
 * Sends a async query deleting a specific task of the user and returning the deleted row.
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
                                AND "listId" IN (SELECT id FROM list WHERE "userId" = ${userId})
                                RETURNING *`;
  return task;
}
