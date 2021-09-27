import { observer, RecursionField } from '@formily/react';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import {
    ArrayIndexContextProvider,
    ArrayRecursiveContextProvider,
} from '../components/Context';
import { ColumnSchema } from './columnSchema';
import React from 'react';
import { getDataInIndex } from '../util';
import { RecursiveIndex } from './recursiveRow';
import { ColumnPropsKeys } from '../components/Column';

type FastLabelProps = {
    data: any[];
    index: string;
};

const FastLabel: React.FC<FastLabelProps> = observer((props) => {
    let result = getDataInIndex(props.data, props.index);
    if (result === undefined) {
        return <></>;
    } else {
        return result;
    }
});

function getDataColumns(
    data: any[],
    columns: ColumnSchema[],
    recursiveIndex?: RecursiveIndex,
): (ColumnGroupType<object> | ColumnType<object>)[] {
    const convertColumn = (column: ColumnSchema) => {
        const rowSpan = column.columnProps?.rowSpan;
        const colSpan = column.columnProps?.colSpan;
        const resetColumnProps: any = {};
        for (let key in new ColumnPropsKeys()) {
            if (key == 'rowSpan' || key == 'colSpan') {
                continue;
            }
            resetColumnProps[key] = (column.columnProps as any)[key];
        }
        if (
            column.columnProps &&
            column.columnProps.children &&
            column.columnProps.children.length != 0
        ) {
            let single: ColumnGroupType<object> = {
                ...column,
                ...resetColumnProps,
                children: column.columnProps.children
                    .filter((column) => {
                        return column.type == 'column';
                    })
                    .map(convertColumn),
            };
            return single;
        } else {
            let childRowRender = (value: any, record: any, index: number) => {
                const level = record['_currentLevel'];
                const childrenRowRenders =
                    column.columnProps?.childrenRowRender;

                if (
                    !childrenRowRenders ||
                    level < 0 ||
                    level - 1 >= childrenRowRenders.length
                ) {
                    return <></>;
                }
                const childRowRenderColumn = childrenRowRenders[level - 1];
                const childrenIndex = recursiveIndex?.childrenIndex[level];
                //默认没有填充，返回空数据
                if (!childRowRenderColumn) {
                    return <></>;
                } else {
                    if (childRowRenderColumn.columnProps?.labelIndex) {
                        //直接返回数据，绕过field，这样做会失去effect，但是效率较高
                        return (
                            <FastLabel
                                data={data}
                                index={
                                    record._index +
                                    '.' +
                                    childRowRenderColumn.columnProps?.labelIndex
                                }
                            />
                        );
                    } else {
                        return (
                            <ArrayRecursiveContextProvider
                                value={childrenIndex}
                            >
                                <ArrayIndexContextProvider
                                    value={record._index}
                                >
                                    <RecursionField
                                        name={record._index}
                                        schema={childRowRenderColumn.schema}
                                        onlyRenderProperties
                                    />
                                </ArrayIndexContextProvider>
                            </ArrayRecursiveContextProvider>
                        );
                    }
                }
            };
            let normalRowRender = (
                value: any,
                record: any,
                index: number,
                recursiveIndex?: string,
            ) => {
                if (column.columnProps?.labelIndex) {
                    //直接返回数据，绕过field，这样做会失去effect，但是效率较高
                    return (
                        <FastLabel
                            data={data}
                            index={
                                record._index +
                                '.' +
                                column.columnProps?.labelIndex
                            }
                        />
                    );
                } else {
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
                }
            };
            let single: ColumnType<object> = {
                ...column,
                ...resetColumnProps,
                render: (value: any, record: any, index: number) => {
                    if (
                        record.hasOwnProperty('_currentLevel') == false ||
                        record['_currentLevel'] == 0
                    ) {
                        //没有_currentLevel，或者_currentLevel处于第1层
                        let recursiveIndexName: string | undefined;
                        if (recursiveIndex?.type == 'recursive') {
                            recursiveIndexName = recursiveIndex.recursiveIndex;
                        } else if (recursiveIndex?.type == 'children') {
                            recursiveIndexName =
                                recursiveIndex.childrenIndex[0];
                        }
                        return normalRowRender(
                            value,
                            record,
                            index,
                            recursiveIndexName,
                        );
                    } else {
                        //有_currentLevel，且_currentLevel处于非首层
                        return childRowRender(value, record, index);
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
