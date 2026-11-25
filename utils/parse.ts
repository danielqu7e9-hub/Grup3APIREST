import type { Permissions } from "../services/share.services";

/**
 * parseId()
 * This function validates if the value is an positive Integer, if its not it returns a null.
 * 
 * @author Daniel Qu
 * @since 30/09/2026
 * @param value Unknown
 * @returns Number or Null
 */
export function parseId(value: unknown): number | null {
    if (typeof value !== "string" || !/^\d+$/.test(value)) return null;

    const id = Number.parseInt(value, 10);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/**
 * parsePositiveId()
 * This function validates if the value is a positive Integer, it accepts either
 * a numeric string or a number, otherwise it returns a null.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param value Unknown
 * @returns Number or Null
 */
function parsePositiveId(value: unknown): number | null {
    let candidate: number | null = null;

    if (typeof value === "number") {
        candidate = value;
    } else if (typeof value === "string" && /^\d+$/.test(value)) {
        candidate = Number.parseInt(value, 10);
    } else {
        return null;
    }

    return Number.isSafeInteger(candidate) && candidate > 0 ? candidate : null;
}

/**
 * parsePriority()
 * This function validates if the value is an Integer between 1 and 5, otherwise it returns a null.
 *
 * @param value Unknown
 * @returns Number or Null
 */
function parsePriority(value: unknown): number | null {
    return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5 ? value : null;
}

/**
 * parseListCreateBody()
 * This function validates the request body of a tasklist creation, if the body is not valid it returns a null.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param value Unknown
 * @returns Object or Null
 */
export function parseListCreateBody(value: unknown): { name: string; description: string | null } | null {
    if (typeof value !== "object" || value === null) return null;

    const body = value as Record<string, unknown>;
    const { name, description } = body;

    if (typeof name !== "string") return null;

    const trimmedName = name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 255) return null;

    let parsedDescription: string | null = null;
    if (typeof description === "string") {
        const trimmedDescription = description.trim();
        parsedDescription = trimmedDescription.length > 0 ? trimmedDescription : null;
    } else if (description !== undefined && description !== null) {
        return null;
    }

    return { name: trimmedName, description: parsedDescription };
}

/**
 * parseTaskCreateBody()
 * This function validates the request body of a task creation, if the body is not valid it returns a null.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param value Unknown
 * @returns Object or Null
 */
export function parseTaskCreateBody(value: unknown): { title: string; description: string | null; isDone: boolean; dueTo: number | null; listId: number; priority: number } | null {
    if (typeof value !== "object" || value === null) return null;

    const body = value as Record<string, unknown>;
    const { title, description, isDone, dueTo, listId, priority } = body;

    if (typeof title !== "string") return null;

    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0 || trimmedTitle.length > 255) return null;

    let parsedDescription: string | null = null;
    if (typeof description === "string") {
        const trimmedDescription = description.trim();
        parsedDescription = trimmedDescription.length > 0 ? trimmedDescription : null;
    } else if (description !== undefined && description !== null) {
        return null;
    }

    // Validate isDone (boolean)
    if (typeof isDone !== "boolean") return null;

    // Validate dueTo (optional timestamp / non negative finite number)
    let parsedDueTo: number | null = null;
    if (typeof dueTo === "number") {
        if (!Number.isSafeInteger(dueTo) || dueTo < 0) return null;
        parsedDueTo = dueTo;
    } else if (dueTo !== undefined && dueTo !== null) {
        return null;
    }

    const parsedListId = parsePositiveId(listId);
    if (parsedListId === null) return null;

    let parsedPriority = 1;
    if (priority !== undefined && priority !== null) {
        const p = parsePriority(priority);
        if (p === null) return null;
        parsedPriority = p;
    }

    return { title: trimmedTitle, description: parsedDescription, isDone, dueTo: parsedDueTo, listId: parsedListId, priority: parsedPriority };
}

/**
 * parseListUpdateBody()
 * This function validates the request body of a tasklist update, if the body is not valid it returns a null.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param value Unknown
 * @returns Object or Null
 */
export function parseListUpdateBody(value: unknown): { name: string; description: string | null } | null {
    if (typeof value !== "object" || value === null) return null;

    const body = value as Record<string, unknown>;
    const { name, description } = body;

    if (typeof name !== "string") return null;

    const trimmedName = name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 255) return null;

    let parsedDescription: string | null = null;
    if (typeof description === "string") {
        const trimmedDescription = description.trim();
        parsedDescription = trimmedDescription.length > 0 ? trimmedDescription : null;
    } else if (description !== undefined && description !== null) {
        return null;
    }

    return { name: trimmedName, description: parsedDescription };
}


/**
 * parseTaskUpdateBody()
 * This function validates the request body of a task update, if the body is not valid it returns a null.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param value Unknown
 * @returns Object or Null
 */
export function parseTaskUpdateBody(value: unknown): { title: string; description: string | null; isDone: boolean; dueTo: number | null; priority: number } | null {
    if (typeof value !== "object" || value === null) return null;

    const body = value as Record<string, unknown>;
    const { title, description, isDone, dueTo, priority } = body;

    if (typeof title !== "string") return null;

    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0 || trimmedTitle.length > 255) return null;

    let parsedDescription: string | null = null;
    if (typeof description === "string") {
        const trimmedDescription = description.trim();
        parsedDescription = trimmedDescription.length > 0 ? trimmedDescription : null;
    } else if (description !== undefined && description !== null) {
        return null;
    }

    // Validate isDone (boolean)
    if (typeof isDone !== "boolean") return null;

    // Validate dueTo (optional timestamp / positive finite number)
    let parsedDueTo: number | null = null;
    if (typeof dueTo === "number") {
        if (!Number.isSafeInteger(dueTo) || dueTo < 0) return null;
        parsedDueTo = dueTo;
    } else if (dueTo !== undefined && dueTo !== null) {
        return null;
    }

    // Validate priority (required, 1-5)
    const parsedPriority = parsePriority(priority);
    if (parsedPriority === null) return null;

    return { title: trimmedTitle, description: parsedDescription, isDone, dueTo: parsedDueTo, priority: parsedPriority };
}

/**
 * parseAuthBody()
 * This function validates the request body of a register or login, if the body is not valid it returns a null.
 *
 * @author Daniel Qu
 * @since 17/11/2026
 * @param value Unknown
 * @returns Object or Null
 */
export function parseAuthBody(value: unknown): { username: string; password: string } | null {
    if (typeof value !== "object" || value === null) return null;

    const body = value as Record<string, unknown>;
    const { username, password } = body;

    if (typeof username !== "string" || typeof password !== "string") return null;

    const trimmedUsername = username.trim();
    if (trimmedUsername.length === 0 || trimmedUsername.length > 255) return null;
    if (password.length === 0 || password.length > 255) return null;

    return { username: trimmedUsername, password };
}

/**
 * parsePermissions()
 * This function validates the permissions of a shared user, if they are not valid it returns a null.
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param value Unknown
 * @returns Object or Null
 */
function parsePermissions(value: unknown): Permissions | null {
    if (typeof value !== "object" || value === null) return null;

    const { edit, create, delete: remove } = value as Record<string, unknown>;

    if (typeof edit !== "boolean" || typeof create !== "boolean" || typeof remove !== "boolean") return null;

    return { edit, create, delete: remove };
}

/**
 * parseShareBody()
 * This function validates the request body with the permissions to share a tasklist, if the body is not valid it returns a null.
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param value Unknown
 * @returns Object or Null
 */
export function parseShareBody(value: unknown): { permissions: Permissions } | null {
    if (typeof value !== "object" || value === null) return null;

    const parsedPermissions = parsePermissions((value as Record<string, unknown>).permissions);
    if (parsedPermissions === null) return null;

    return { permissions: parsedPermissions };
}

/**
 * parseJoinBody()
 * This function validates the request body to join a tasklist with a code, if the body is not valid it returns a null.
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param value Unknown
 * @returns Object or Null
 */
export function parseJoinBody(value: unknown): { code: string } | null {
    if (typeof value !== "object" || value === null) return null;

    const { code } = value as Record<string, unknown>;
    if (typeof code !== "string") return null;

    const parsedCode = code.trim().toUpperCase();
    return /^[A-Z2-9]{8}$/.test(parsedCode) ? { code: parsedCode } : null;
}
