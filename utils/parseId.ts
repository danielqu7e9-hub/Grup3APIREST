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