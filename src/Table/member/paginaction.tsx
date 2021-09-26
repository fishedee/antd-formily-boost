import { useField } from '@formily/react';
import { TablePaginationConfig } from 'antd';
import { useForm } from '@formily/react';
import React, { useEffect } from 'react';

export type PaginationType = string;

export type PaginationTypeInner = {
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

function getFieldParentAddress(address: string) {
    let lastDotIndex = address.lastIndexOf('.');
    if (lastDotIndex > 0) {
        return address.substring(0, lastDotIndex);
    } else {
        return '';
    }
}

function getPagination(
    totalSize: number,
    paginaction?: PaginationType,
    paginationProps?: PaginationPropsType,
): TablePaginationConfig | false {
    if (!paginaction) {
        return false;
    }
    const form = useForm();
    const field = useField();
    const fieldParentAddress = getFieldParentAddress(field.address.toString());
    const paginactionWrapper = {
        setCurrent: (current: number) => {
            const field = form.createField({
                name: fieldParentAddress + paginaction + '.current',
            });
            if (field) {
                field.onInput(current);
            }
        },
        setPageSize: (pageSize: number) => {
            const field = form.createField({
                name: fieldParentAddress + paginaction + '.pageSize',
            });
            if (field) {
                field.onInput(pageSize);
            }
        },
        getCurrent: (): number => {
            const field = form.createField({
                name: fieldParentAddress + paginaction + '.current',
            });
            if (field.value) {
                return field.value;
            } else {
                return 1;
            }
        },
        getPageSize: (): number => {
            const field = form.createField({
                name: fieldParentAddress + paginaction + '.pageSize',
            });
            if (field.value) {
                return field.value;
            } else {
                return paginationProps?.defaultPageSize || 10;
            }
        },
        getTotal: (): number | undefined => {
            const field = form.createField({
                name: fieldParentAddress + paginaction + '.total',
            });
            return field?.value;
        },
    };
    //重新当前页
    const paginactionResult: PaginationTypeInner = {
        current: paginactionWrapper.getCurrent(),
        pageSize: paginactionWrapper.getPageSize(),
        total: paginactionWrapper.getTotal(),
    };
    if (paginactionResult.current < 1) {
        paginactionResult.current = 1;
    }
    if (paginactionResult.total == undefined) {
        paginactionResult.total = totalSize;
    }
    let maxPage = Math.ceil(
        paginactionResult.total / paginactionResult.pageSize,
    );
    if (maxPage < 1) {
        maxPage = 1;
    }

    useEffect(() => {
        if (paginactionResult.current > maxPage) {
            paginactionWrapper.setCurrent(maxPage);
        }
    }, [paginactionResult.current, maxPage]);

    let result: TablePaginationConfig = {
        current: paginactionResult.current,
        onChange: (current: number) => {
            paginactionWrapper.setCurrent(current);
        },
        pageSize: paginactionResult.pageSize,
        onShowSizeChange: (current: number, pageSize: number) => {
            paginactionWrapper.setCurrent(current);
            paginactionWrapper.setPageSize(pageSize);
        },
        total: paginactionResult.total,
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

const PaginationPropsTypeForDoc: React.FC<PaginationPropsType> = (props) => {
    return <span />;
};

const PaginationTypeForDoc: React.FC<PaginationType> = (props) => {
    return <span />;
};

export { PaginationPropsType, PaginationTypeForDoc, PaginationPropsTypeForDoc };
