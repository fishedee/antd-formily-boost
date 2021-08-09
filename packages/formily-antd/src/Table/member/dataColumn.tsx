import { RecursionField } from '@formily/react';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import {
    ArrayIndexContextProvider,
    ArrayRecursiveContextProvider,
} from '../components/Context';
import { ColumnSchema } from './columnSchema';
import React from 'react';
import { getDataInIndex } from '../util';

function getDataColumns(
    data: any[],
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
                    if (column.columnProps?.labelIndex) {
                        //直接返回数据，绕过field，这样做会失去effect，但是效率较高
                        return getDataInIndex(
                            data,
                            record._index + '.' + column.columnProps?.labelIndex
                        );
                    } else {
                        return (
                            <ArrayRecursiveContextProvider
                                value={recursiveIndex}
                            >
                                <ArrayIndexContextProvider
                                    value={record._index}
                                >
                                    <RecursionField
                                        name={record._index}
                                        schema={column.schema}
                                        onlyRenderProperties
                                    />
                                </ArrayIndexContextProvider>
                            </ArrayRecursiveContextProvider>
                        );
                    }
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
