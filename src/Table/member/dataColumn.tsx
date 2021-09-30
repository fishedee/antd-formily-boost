import { observer, RecursionField } from '@formily/react';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import {
    ArrayIndexContextProvider,
    ArrayRecursiveContextProvider,
} from '../components/Context';
import { ColumnSchema, RowRenderType, TableConfig } from './config';
import React from 'react';
import { getDataInIndex } from '../util';
import { DataSourceType } from './virtual';
import { Schema } from '@formily/json-schema';

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

function getSplitIndex(
    index: string,
    splitLevel: number,
): { realIndex: string } {
    let currentFind = 0;
    let i = index.length - 1;
    for (; i >= 0; i--) {
        if (index[i] != '.') {
            continue;
        }
        currentFind++;
        if (currentFind == splitLevel * 2) {
            break;
        }
    }
    let realIndex = index.substring(0, i);
    if (realIndex == '') {
        //容错逻辑，一般情况下不会出现
        return { realIndex: index };
    }
    return { realIndex: realIndex };
}

function getDataColumns(
    data: any[],
    tableConfig: TableConfig,
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
                    let level: number;
                    if (record._isRecursive) {
                        level = 0;
                    } else {
                        level = record._currentLevel;
                    }
                    const rowRender: RowRenderType =
                        column.columnProps!.rowRender[level];
                    const nextChildIndex =
                        tableConfig.dataConvertProps!.list[level];
                    function renderNormal(
                        columnSchema: ColumnSchema,
                        index: string,
                        nextChildIndex: string,
                    ) {
                        //普通渲染方式
                        const labelIndex = columnSchema.columnProps?.labelIndex;
                        if (labelIndex) {
                            //直接返回数据，绕过field，这样做会失去effect，但是效率较高
                            return (
                                <FastLabel
                                    data={data}
                                    index={index + '.' + labelIndex}
                                />
                            );
                        } else {
                            //正常渲染模式
                            return (
                                <ArrayRecursiveContextProvider
                                    value={nextChildIndex}
                                >
                                    <ArrayIndexContextProvider value={index}>
                                        <RecursionField
                                            name={index}
                                            schema={columnSchema.schema}
                                            onlyRenderProperties
                                        />
                                    </ArrayIndexContextProvider>
                                </ArrayRecursiveContextProvider>
                            );
                        }
                    }
                    if (rowRender.type == 'none') {
                        //不渲染
                        return <></>;
                    } else if (rowRender.type == 'normal') {
                        //普通渲染
                        return renderNormal(
                            rowRender.schema,
                            record._index,
                            nextChildIndex,
                        );
                    } else if (rowRender.type == 'splitRow') {
                        //合并行渲染
                        const { realIndex } = getSplitIndex(
                            record._index,
                            rowRender.level,
                        );
                        let rowSpan =
                            record._rowSpan[
                                record._rowSpan.length - rowRender.level
                            ];
                        if (rowSpan == 0) {
                            return {
                                children: <></>,
                                props: {
                                    rowSpan: 0,
                                },
                            };
                        } else {
                            return {
                                children: renderNormal(
                                    rowRender.schema,
                                    realIndex,
                                    nextChildIndex,
                                ),
                                props: {
                                    rowSpan: rowSpan,
                                },
                            };
                        }
                    }
                },
            };
            return single;
        }
    };
    return tableConfig.renderColumn.map(convertColumn);
}

export default getDataColumns;
