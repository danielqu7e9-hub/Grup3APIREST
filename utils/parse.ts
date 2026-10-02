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
 * parseListCreateBody()
 * This function validates the request body of a tasklist creation, if the body is not valid it returns a null.
 * 
 * @author Yu Zhang
 * @since 02/10/2026
 * @param value Unknown
 * @returns Object or Null
 */
export function parseListCreateBody(value: unknown): { name: string; description: string | null; userId: number } | null {
    if (typeof value !== "object" || value === null) return null;

    const body = value as Record<string, unknown>;
    const { name, description, userId } = body;

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

    const parsedUserId = parsePositiveId(userId);
    if (parsedUserId === null) return null;

    return { name: trimmedName, description: parsedDescription, userId: parsedUserId };
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
export function parseTaskCreateBody(value: unknown): { title: string; description: string | null; isDone: boolean; dueTo: number | null; listId: number } | null {
    if (typeof value !== "object" || value === null) return null;

    const body = value as Record<string, unknown>;
    const { title, description, isDone, dueTo, listId } = body;

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
        if (!Number.isFinite(dueTo) || dueTo < 0) return null;
        parsedDueTo = dueTo;
    } else if (dueTo !== undefined && dueTo !== null) {
        return null;
    }

    const parsedListId = parsePositiveId(listId);
    if (parsedListId === null) return null;

    return { title: trimmedTitle, description: parsedDescription, isDone, dueTo: parsedDueTo, listId: parsedListId };
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
export function parseTaskUpdateBody(value: unknown): { title: string; description: string | null; isDone: boolean; dueTo: number | null } | null {
    if (typeof value !== "object" || value === null) return null;

    const body = value as Record<string, unknown>;
    const { title, description, isDone, dueTo } = body;

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
        if (!Number.isFinite(dueTo) || dueTo < 0) return null;
        parsedDueTo = dueTo;
    } else if (dueTo !== undefined && dueTo !== null) {
        return null;
    }

    return { title: trimmedTitle, description: parsedDescription, isDone, dueTo: parsedDueTo };
}