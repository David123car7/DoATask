type UsePaginationProps = { page: number; limit: number; total: number };
export const ELLIPSIS_LEFT = -10;
export const ELLIPSIS_RIGHT = -20;


const generatePages = (page: number, totalPages: number) => {
    const current = Math.min(page, totalPages);//a pagina atual é a menor entre a pagina e o total de paginas 
    const total = Math.max(1, totalPages);//o total de paginas é o maior entre 1 e o total de paginas

    if(total <= 7) {
        return Array.from({length: total}).map((_, i) => i + 1);
    }

    if(current < 3) {
        return [1,2,3, ELLIPSIS_LEFT, total-1, total];
    }

    if(current === 3) {
        return [1,2,3,4, ELLIPSIS_LEFT, total-1, total];
    }

    if(current > total - 2) {
        return [1,2,ELLIPSIS_RIGHT,total-2,total-1, total];
    }

    if(current === total - 2) {
        return [1,2, ELLIPSIS_RIGHT,total-3,,total-2,total-1, total];
    }

    return [1, ELLIPSIS_LEFT, current - 1, current, current + 1,ELLIPSIS_RIGHT, total];

};

export const usePagination = ({ page, limit, total }: UsePaginationProps) => {
    const totalPages = Math.ceil(total / limit);//Arredonda para cima
    const pages = generatePages(page, totalPages);

    const isCurrentPage = (n:number) => n === page;

    return {pages, isCurrentPage};

};