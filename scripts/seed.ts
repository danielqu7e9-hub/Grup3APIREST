import { sql } from "bun";

/**
 * Test data seeder.
 *
 * Only INSERTs. All seed data hangs from users whose username starts with "seed_",
 * so existing users / lists / tasks are never modified.
 *
 *   bun run seed          -> inserts the test data (skips if it already exists)
 *   bun run seed:clean    -> deletes ONLY the seed users (lists and tasks go with them via ON DELETE CASCADE)
 */

const SEED_PREFIX = "seed_";
const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

type SeedTask = { title: string; description?: string; isDone?: boolean; dueInDays?: number; priority?: number };
type SeedList = { name: string; description?: string; tasks: SeedTask[] };
type SeedUser = { username: string; password: string; lists: SeedList[] };

const data: SeedUser[] = [
    {
        username: "seed_ana",
        password: "seed1234",
        lists: [
            {
                name: "Compra",
                description: "Cosas para el súper",
                tasks: [
                    { title: "Leche", priority: 2 },
                    { title: "Pan", isDone: true, priority: 1 },
                    { title: "Fruta", description: "Manzanas y plátanos", dueInDays: 1, priority: 3 },
                ],
            },
            {
                name: "Trabajo",
                description: "Pendientes de la oficina",
                tasks: [
                    { title: "Preparar reunión", dueInDays: 2, priority: 5 },
                    { title: "Revisar PR del API", description: "Endpoints de task", priority: 4 },
                    { title: "Enviar informe", isDone: true, dueInDays: -1, priority: 3 },
                ],
            },
        ],
    },
    {
        username: "seed_marc",
        password: "seed1234",
        lists: [
            {
                name: "Estudios",
                tasks: [
                    { title: "Práctica APIREST", description: "Añadir priority", dueInDays: 7, priority: 5 },
                    { title: "Examen de BBDD", dueInDays: 14, priority: 4 },
                    { title: "Leer apuntes de Express" },
                ],
            },
            {
                name: "Lista vacía",
                description: "Para probar listas sin tareas",
                tasks: [],
            },
        ],
    },
];

async function seed() {
    const [existing] = await sql`SELECT count(*)::int AS n FROM users WHERE username LIKE ${SEED_PREFIX + "%"}`;
    if (existing.n > 0) {
        console.log(`Ya hay ${existing.n} usuarios seed. Ejecuta "bun run seed:clean" primero si quieres regenerarlos.`);
        return;
    }

    await sql.begin(async (tx) => {
        for (const u of data) {
            const [user] = await tx`INSERT INTO users (username, password)
                                    VALUES (${u.username}, ${u.password}) RETURNING id`;

            for (const l of u.lists) {
                const [list] = await tx`INSERT INTO list (name, description, "userId")
                                        VALUES (${l.name}, ${l.description ?? null}, ${user.id}) RETURNING id`;

                for (const t of l.tasks) {
                    await tx`INSERT INTO task (title, description, "isDone", "dueTo", "listId", priority)
                             VALUES (${t.title}, ${t.description ?? null}, ${t.isDone ?? false},
                                     ${t.dueInDays !== undefined ? now + t.dueInDays * DAY : null},
                                     ${list.id}, ${t.priority ?? 1})`;
                }
            }
        }
    });

    const lists = await sql`SELECT l.id, l.name, u.username, count(t.id)::int AS tasks
                            FROM list l JOIN users u ON u.id = l."userId" LEFT JOIN task t ON t."listId" = l.id
                            WHERE u.username LIKE ${SEED_PREFIX + "%"}
                            GROUP BY l.id, u.username ORDER BY l.id`;
    console.log("Datos de prueba creados:");
    console.table(lists);
}

async function clean() {
    const deleted = await sql`DELETE FROM users WHERE username LIKE ${SEED_PREFIX + "%"} RETURNING username`;
    console.log(`Borrados ${deleted.length} usuarios seed (y sus listas y tareas).`);
}

try {
    if (process.argv.includes("--clean")) await clean();
    else await seed();
} catch (err) {
    console.error("Error en el seed:", err);
    process.exitCode = 1;
} finally {
    await sql.close();
}
