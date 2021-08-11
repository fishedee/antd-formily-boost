import { TablePaginationConfig } from 'antd';

export type PaginationType = {
    current: number;
    pageSize: number;
    total?: number;
};

type PaginationPropsType = {
    defaultPageSize?: number;
    showQuickJumper?: boolean;
    showSizeChanger?: boolean;
    showTotal?: boolean;
    pageSizeOptions?: string[];
};

function getPagination(
    totalSize: number,
    paginaction?: PaginationType,
    paginationProps?: PaginationPropsType,
): TablePaginationConfig | false {
    if (!paginaction) {
        return false;
    }
    //重新当前页
    if (paginaction.current < 1) {
        paginaction.current = 1;
    }
    if (paginaction.total !== undefined) {
        totalSize = paginaction.total;
    }
    const maxPage = Math.ceil(totalSize / paginaction.pageSize) + 1;
    if (paginaction.current > maxPage) {
        paginaction.current = maxPage;
    }
    let result: TablePaginationConfig = {
        current: paginaction.current,
        onChange: (current: number) => {
            paginaction.current = current;
        },
        pageSize: paginaction.pageSize,
        onShowSizeChange: (current: number, pageSize: number) => {
            paginaction.current = current;
            paginaction.pageSize = pageSize;
        },
        total: paginaction.total,
        showQuickJumper: paginationProps?.showQuickJumper,
        showSizeChanger: paginationProps?.showSizeChanger,
        pageSizeOptions: paginationProps?.pageSizeOptions,
        showTotal: paginationProps?.showTotal
            ? (total, range) => `共${total}条`
            : undefined,
    };
    return result;
}

export default getPagination;

export { PaginationPropsType };
