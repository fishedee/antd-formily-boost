import { RecursionField } from '@formily/react';
import { ExpandableConfig } from 'antd/lib/table/interface';
import { ArrayIndexContextProvider } from '../components/Context';
import { ColumnSchema } from './columnSchema';
import { flatDataInIndex, fillDataInIndex } from '../util';
import React from 'react';

function getExpandableRow(
    data: any[],
    tableColumns: ColumnSchema[]
): ExpandableConfig<any> | undefined {
    const columns = tableColumns.filter(
        (column) => column.type == 'expandableRow'
    );
    if (columns.length == 0) {
        return undefined;
    }
    let expandableRow = columns[0];
    const expandedRowRender = (record: any, index: number) => {
        return (
            <ArrayIndexContextProvider value={record._index}>
                <RecursionField
                    name={record._index}
                    schema={expandableRow.schema}
                    onlyRenderProperties
                />
            </ArrayIndexContextProvider>
        );
    };
    const expandedIndex = expandableRow.expandableRrops?.expandedIndex!;
    const expandedRowKeys = flatDataInIndex(
        data,
        expandedIndex,
        '',
        !!expandableRow.expandableRrops?.defaultExpand
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
        expandedRowRender: expandedRowRender,
        onExpandedRowsChange: onExpandedRowsChange,
        expandedRowKeys: expandedRowKeys,
        ...expandableRow.expandableRrops,
    };
}

export default getExpandableRow;
