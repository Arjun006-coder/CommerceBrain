
const API_BASE_URL = 'http://localhost:8002';

export async function fetchQuickInsight(productId: string, queryType: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/quick-insight?product_id=${productId}&query_type=${queryType}`);
        if (!response.ok) throw new Error('Failed to fetch insight');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}


export async function fetchHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        return await response.json();
    } catch (error) {
        return { status: 'error' };
    }
}

export async function searchProducts(query: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/products/search?q=${query}`);
        if (!response.ok) throw new Error('Failed to search products');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

export async function fetchDeepAnalysis(productId: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/deep-analysis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId, analysis_type: 'comprehensive' }),
        });
        if (!response.ok) throw new Error('Failed to fetch deep analysis');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

export async function sendChatMessage(message: string, productId?: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, product_id: productId }),
        });
        if (!response.ok) throw new Error('Failed to send message');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { response: "Sorry, I'm having trouble connecting to the server." };
    }
}
