import { RecursionField } from '@formily/react';
import { ExpandableConfig } from 'antd/lib/table/interface';
import { ArrayIndexContextProvider } from '../components/Context';
import { TableConfig } from './config';
import { flatDataInIndex, fillDataInIndex } from '../util';
import React from 'react';

function getExpandableRow(
    data: any[],
    tableConfig: TableConfig,
): ExpandableConfig<any> | undefined {
    if (!tableConfig.expandableColumn) {
        return;
    }
    let expandableColumn = tableConfig.expandableColumn;
    const expandedRowRender = (record: any, index: number) => {
        return (
            <ArrayIndexContextProvider value={record._index}>
                <RecursionField
                    name={record._index}
                    schema={expandableColumn.schema}
                    onlyRenderProperties
                />
            </ArrayIndexContextProvider>
        );
    };
    const expandedIndex = expandableColumn.expandableRrops?.expandedIndex!;
    const expandedRowKeys = flatDataInIndex(
        data,
        expandedIndex,
        '',
        0,
        !!expandableColumn.expandableRrops?.defaultExpand,
        tableConfig.dataConvertProps.tree,
    );
    const onExpandedRowsChange = (newExpandedRowKeys: any) => {
        fillDataInIndex(
            data,
            expandedIndex,
            expandedRowKeys,
            newExpandedRowKeys,
        );
    };
    return {
        expandedRowRender: expandedRowRender,
        onExpandedRowsChange: onExpandedRowsChange,
        expandedRowKeys: expandedRowKeys,
        ...expandableColumn.expandableRrops,
    };
}

export default getExpandableRow;
