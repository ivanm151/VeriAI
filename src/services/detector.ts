export interface DetectionResult {
    type: 'text' | 'image';
    url?: string;
    text?: string;
    ai_probability: number;
    generation_type: string;
    possible_sources: string[] | null;
}

export interface APIResponse {
    texts: {
        type: string;
        ai_probability: number;
        generation_type: string;
        possible_sources: string[] | null;
    }[];
    images: {
        url: string;
        ai_probability: number;
        generation_type: string;
        possible_sources: string[] | null;
    }[];
}

// Меняем URL на ваш прокси
const PROXY_URL = 'http://localhost:3003/api/detect';

export async function detectAI(data: { texts: string[], images: string[] }): Promise<DetectionResult[]> {
    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const result: APIResponse = await response.json();

        const combined: DetectionResult[] = [
            ...result.texts.map((t, i) => ({
                type: 'text' as const,
                text: data.texts[i],
                ai_probability: t.ai_probability,
                generation_type: t.generation_type,
                possible_sources: t.possible_sources,
            })),
            ...result.images.map(img => ({
                type: 'image' as const,
                url: img.url,
                ai_probability: img.ai_probability,
                generation_type: img.generation_type,
                possible_sources: img.possible_sources,
            })),
        ];

        return combined;
    } catch (error) {
        console.error('Detection failed:', error);
        throw error;
    }
}