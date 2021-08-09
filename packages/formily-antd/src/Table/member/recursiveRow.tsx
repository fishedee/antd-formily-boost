import { ExpandableConfig } from 'antd/lib/table/interface';
import { RecursiveRowProps } from '../components/RecursiveRow';
import { flatDataInIndex, fillDataInIndex } from '../util';
import { ColumnSchema } from './columnSchema';

function getExpand() {}
function getRecursiveRow(
    data: any[],
    tableColumns: ColumnSchema[]
):
    | {
          recursiveIndex: string;
          expandedIndex: string;
          expandedProps: ExpandableConfig<any>;
      }
    | undefined {
    let columns = tableColumns.filter(
        (column) => column.type == 'recursiveRow'
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
    const expandedIndex = column.recursiveProps.expandedIndex!;
    const expandedRowKeys = flatDataInIndex(
        data,
        expandedIndex,
        '',
        !!column.recursiveProps.defaultExpand,
        recursiveIndex,
        true
    );
    const onExpandedRowsChange = (newExpandedRowKeys: any) => {
        fillDataInIndex(
            data,
            expandedIndex,
            expandedRowKeys,
            newExpandedRowKeys
        );
    };
    return {
        recursiveIndex: column.recursiveProps.recursiveIndex,
        expandedIndex: expandedIndex,
        expandedProps: {
            ...column.recursiveProps,
            expandedRowKeys: expandedRowKeys,
            onExpandedRowsChange: onExpandedRowsChange,
        },
    };
}

export default getRecursiveRow;
