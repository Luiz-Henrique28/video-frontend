import { http } from './http';

export interface SearchResult {
    id: number | string;
    label: string;
    type: 'user' | 'tag' | 'post' | 'search';
    image?: string | null;
}

export async function searchContent(query: string): Promise<SearchResult[]> {
    const response = await http.get('/search', { params: { q: query } });
    return (response.data as any)?.data ?? response.data;
}
