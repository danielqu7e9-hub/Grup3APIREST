import { tasklists } from '../data/tasklists.data';

export async function getAll() {
    return tasklists;
}