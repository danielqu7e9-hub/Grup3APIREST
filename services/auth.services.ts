import { sql } from "bun";

/**
 * getByUsername()
 * Sends a async query asking for a specific user by its username.
 *
 * @author Daniel Qu
 * @since 17/11/2026
 * @param username String
 * @returns Promise<Any>
 */
export async function getByUsername(username: string) {
  const [user] = await sql`SELECT * FROM users WHERE username = ${username}`;
  return user;
}

/**
 * getByToken()
 * Sends a async query asking for a specific user by its token.
 *
 * @author Daniel Qu
 * @since 17/11/2026
 * @param token String
 * @returns Promise<Any>
 */
export async function getByToken(token: string) {
  const [user] = await sql`SELECT id, username FROM users WHERE token = ${token}`;
  return user;
}

/**
 * create()
 * Hashes the password, creates a new user with a random token and returns the created row.
 *
 * @author Daniel Qu
 * @since 17/11/2026
 * @param data Object
 * @returns Promise<Any>
 */
export async function create(data: { username: string; password: string }) {
  const hash = await Bun.password.hash(data.password);
  const token = crypto.randomUUID();

  const [user] = await sql`INSERT INTO users (username, password, token)
                                VALUES (${data.username}, ${hash}, ${token})
                                RETURNING id, username, token`;
  return user;
}

/**
 * login()
 * Checks the password against the stored hash, creates the token if the user doesn't have one yet
 * and returns the user, or undefined if the credentials are wrong.
 *
 * @author Daniel Qu
 * @since 17/11/2026
 * @param data Object
 * @returns Promise<Any>
 */
export async function login(data: { username: string; password: string }) {
  const user = await getByUsername(data.username);
  if (!user) return undefined;

  const valid = await Bun.password.verify(data.password, user.password);
  if (!valid) return undefined;

  if (user.token) {
    return { id: user.id, username: user.username, token: user.token };
  }

  const [updated] = await sql`UPDATE users
                                SET token = ${crypto.randomUUID()}
                                WHERE id = ${user.id}
                                RETURNING id, username, token`;
  return updated;
}
