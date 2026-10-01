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