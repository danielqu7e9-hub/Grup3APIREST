import { sql } from "bun";

/**
 * getAll()
 * Sends a async query asking for the list of tasklists.
 * 
 * @author Daniel Qu
 * @since 30/09/2026
 * @returns Promise<Any>
 */
export async function getAll() {
    return await sql`SELECT * FROM list`;
}

/**
 * getById()
 * Sends a async query asking for a specific tasklist.
 * 
 * @author Daniel Qu
 * @since 30/09/2026
 * @param id Number
 * @returns Promise<Any>
 */
export async function getById(id: Number) {
    const [tasklist] = await sql`SELECT * FROM list WHERE id = ${id}`;
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
export async function create(data: { name: string; description?: string | null; userId: number }) {
    const [tasklist] = await sql`INSERT INTO list (name, description, "userId") VALUES (${data.name}, ${data.description ?? null}, ${data.userId}) RETURNING *`;
    return tasklist;
}

/**
 * update()
 * Sends a async query updating a specific tasklist and returning the updated row.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param id Number
 * @param data Object
 * @returns Promise<Any>
 */
export async function update(id: number, data: { name: string; description?: string | null }) {
    const [tasklist] = await sql`UPDATE list SET name = ${data.name}, description = ${data.description ?? null} WHERE id = ${id} RETURNING *`;
    return tasklist;
}

/**
 * remove()
 * Sends a async query deleting a specific tasklist and returning the deleted row.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param id Number
 * @returns Promise<Any>
 */
export async function remove(id: number) {
    const [tasklist] = await sql`DELETE FROM list WHERE id = ${id} RETURNING *`;
    return tasklist;
}