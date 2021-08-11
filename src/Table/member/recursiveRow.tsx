import { ExpandableConfig } from 'antd/lib/table/interface';
import { RecursiveRowProps } from '../components/RecursiveRow';
import { flatDataInIndex, fillDataInIndex } from '../util';
import { ColumnSchema } from './columnSchema';

//Recursive同时承担着RecursvieRow，与ChildrenRow的渲染
type RecursiveIndex = {
    type: 'recursive' | 'children';
    recursiveIndex: string;
    childrenIndex: string[];
};

type RecursiveIndexInfo = RecursiveIndex & {
    expandedProps: ExpandableConfig<any>;
    expandedIndex: string;
    defaultExpand: boolean;
};

function getRecursiveRowColumnInfo(
    tableColumns: ColumnSchema[],
): RecursiveIndexInfo | undefined {
    let columns = tableColumns.filter(
        (column) => column.type == 'recursiveRow',
    );
    if (columns.length == 0) {
        return undefined;
    }
    let column = columns[0];
    if (!column.recursiveProps) {
        return undefined;
    }
    if (!column.recursiveProps.recursiveIndex) {
        return undefined;
    }
    const recursiveIndex = column.recursiveProps.recursiveIndex;
    return {
        type: 'recursive',
        recursiveIndex: recursiveIndex,
        childrenIndex: [],
        expandedIndex: column.recursiveProps.expandedIndex!,
        defaultExpand: !!column.recursiveProps.defaultExpand,
        expandedProps: column.recursiveProps,
    };
}

function getChildrenRowColumnInfo(
    tableColumns: ColumnSchema[],
): RecursiveIndexInfo | undefined {
    let columns = tableColumns.filter((column) => column.type == 'childrenRow');
    if (columns.length == 0) {
        return undefined;
    }
    let column = columns[0];
    if (!column.childrenProps) {
        return undefined;
    }
    if (!column.childrenProps.allChildrenIndex) {
        return undefined;
    }
    const allChildrenIndex = column.childrenProps.allChildrenIndex;
    return {
        type: 'children',
        recursiveIndex: '',
        childrenIndex: allChildrenIndex,
        expandedIndex: column.childrenProps.expandedIndex!,
        defaultExpand: !!column.childrenProps.defaultExpand,
        expandedProps: column.childrenProps,
    };
}

function getRecursiveRow(
    data: any[],
    tableColumns: ColumnSchema[],
):
    | {
          recursiveIndex: RecursiveIndex;
          expandedIndex: string;
          expandedProps: ExpandableConfig<any>;
      }
    | undefined {
    let recursiveIndexInfo = getRecursiveRowColumnInfo(tableColumns);
    if (!recursiveIndexInfo) {
        recursiveIndexInfo = getChildrenRowColumnInfo(tableColumns);
    }
    if (!recursiveIndexInfo) {
        return undefined;
    }
    const expandedRowKeys = flatDataInIndex(
        data,
        recursiveIndexInfo.expandedIndex,
        '',
        0,
        !!recursiveIndexInfo.defaultExpand,
        recursiveIndexInfo,
        true, //如果该层处于收缩的状态，提前停止往下查找expand状态的行
    );
    const onExpandedRowsChange = (newExpandedRowKeys: any) => {
        fillDataInIndex(
            data,
            recursiveIndexInfo?.expandedIndex!,
            expandedRowKeys,
            newExpandedRowKeys,
        );
    };
    return {
        recursiveIndex: recursiveIndexInfo,
        expandedIndex: recursiveIndexInfo.expandedIndex,
        expandedProps: {
            ...recursiveIndexInfo.expandedProps,
            expandedRowKeys: expandedRowKeys,
            onExpandedRowsChange: onExpandedRowsChange,
        },
    };
}

export default getRecursiveRow;

export { RecursiveIndex };
