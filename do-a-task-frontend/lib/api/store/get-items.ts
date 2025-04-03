// lib/store.api.ts
type GetStoreItemsParams = {
    page: number;
    limit: number;
};

type StoreItem = {
    id: number;
    name: string;
    price: number;
};

type GetStoreItemsResponse = {
    data: StoreItem[];
    metadata: {
        pagination: {
            total: number;
            page: number;
            limit: number;
        };
    };
};

export const getStoreItems = async ({ page, limit }: GetStoreItemsParams): Promise<GetStoreItemsResponse> => {
    try {
        const response = await fetch(`/api/store/items?page=${page}&limit=${limit}`); // Passa page e limit como query params
        if (!response.ok) {
            throw new Error('Erro ao buscar itens da loja');
        }
        const data = await response.json(); // Converte a resposta para JSON
        return data; // Retorna os dados e metadados
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error; // Lança o erro para ser tratado no componente
    }
};