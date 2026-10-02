import { sql } from "bun";

/**
 * getAll()
 * Sends a async query asking for all task of a list.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param listId Number
 * @returns Promise<Any>
 */
export async function getAll(listId: number) {
    return await sql`SELECT * FROM todo WHERE "listId" = ${listId}`;
}

/**
 * getById()
 * Sends a async query asking for a specific task (return detailed data).
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param id Number
 * @returns Promise<Any>
 */
export async function getById(id: number) {
    const [task] = await sql`SELECT * FROM todo WHERE id = ${id}`;
    return task;
}

/**
 * create()
 * Sends a async query creating a new task and returning the created row.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param data Object
 * @returns Promise<Any>
 */
export async function create(data: { title: string; description?: string | null; isDone: boolean; dueTo: number | null; listId: number }) {
    const [task] = await sql`INSERT INTO todo (title, description, "isDone", "dueTo", "listId") VALUES (${data.title}, ${data.description ?? null}, ${data.isDone}, ${data.dueTo !== null ? new Date(data.dueTo) : null}, ${data.listId}) RETURNING *`;
    return task;
}

/**
 * update()
 * Sends a async query updating a specific task and returning the updated row.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param id Number
 * @param data Object
 * @returns Promise<Any>
 */
export async function update(id: number, data: { title: string; description: string | null; isDone: boolean; dueTo: number | null }) {
    const [task] = await sql`UPDATE todo SET title = ${data.title}, description = ${data.description ?? null}, "isDone" = ${data.isDone}, "dueTo" = ${data.dueTo !== null ? new Date(data.dueTo) : null} WHERE id = ${id} RETURNING *`;
    return task;
}

/**
 * remove()
 * Sends a async query deleting a specific task and returning the deleted row.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param id Number
 * @returns Promise<Any>
 */
export async function remove(id: number) {
    const [task] = await sql`DELETE FROM todo WHERE id = ${id} RETURNING *`;
    return task;
}