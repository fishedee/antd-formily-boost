import { RecursionField } from '@formily/react';
import { ExpandableConfig } from 'antd/lib/table/interface';
import { ArrayIndexContextProvider } from '../components/Context';
import { ColumnSchema } from './columnSchema';
import React from 'react';

function getExpandableRow(
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
    return {
        expandedRowRender: expandedRowRender,
        ...expandableRow.expandableRrops,
    };
}

export default getExpandableRow;
