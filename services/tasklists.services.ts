import { sql } from "bun";

export async function getAll() {
    return await sql`SELECT * FROM list`;
}

export async function getById(id: number) {
    const [tasklist] = await sql`SELECT * FROM list WHERE id = ${id}`;
    return tasklist;
}