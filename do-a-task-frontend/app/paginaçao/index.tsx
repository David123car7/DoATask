import Link from "next/link";
import { usePagination } from "./usePagination";

type PaginationProps = { page: number; limit: number; total: number };

const Pagination = ({page, limit, total} : PaginationProps) => {
const {pages} = usePagination({page, limit, total});

    return (
        <div>
            <ul>
                {pages.map((page) => {


                    const className = [].join('');

                    return ( 
                    <li key={page}>
                        <Link href="#">{page}
                            {page}
                        </Link>
                    </li>
                    );
                })}
            </ul>
        </div>
    )
};

export default Pagination; 