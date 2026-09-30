export function parseId(value: unknown): number | null {
    if (typeof value !== "string" || !/^\d+$/.test(value)) return null;

    const id = Number.parseInt(value, 10);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}