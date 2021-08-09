import { RecursionField } from '@formily/react';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import {
    ArrayIndexContextProvider,
    ArrayRecursiveContextProvider,
} from '../components/Context';
import { ColumnSchema } from './columnSchema';
import React from 'react';

function getDataColumns(
    columns: ColumnSchema[],
    recursiveIndex?: string
): (ColumnGroupType<object> | ColumnType<object>)[] {
    const convertColumn = (column: ColumnSchema) => {
        if (
            column.columnProps &&
            column.columnProps.children &&
            column.columnProps.children.length != 0
        ) {
            let single: ColumnGroupType<object> = {
                ...column,
                ...column.columnProps,
                children: column.columnProps.children
                    .filter((column) => {
                        return column.type == 'column';
                    })
                    .map(convertColumn),
            };
            return single;
        } else {
            let single: ColumnType<object> = {
                ...column,
                ...column.columnProps,
                render: (value: any, record: any, index: number) => {
                    return (
                        <ArrayRecursiveContextProvider value={recursiveIndex}>
                            <ArrayIndexContextProvider value={record._index}>
                                <RecursionField
                                    name={record._index}
                                    schema={column.schema}
                                    onlyRenderProperties
                                />
                            </ArrayIndexContextProvider>
                        </ArrayRecursiveContextProvider>
                    );
                },
            };
            return single;
        }
    };
    return columns
        .filter((column) => {
            return column.type == 'column';
        })
        .map(convertColumn);
}

export default getDataColumns;
