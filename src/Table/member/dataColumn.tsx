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
                render: (value: any, record: DataSourceType, index: number) => {
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
                    if (rowRender.type == 'none') {
                        //不渲染
                        return <></>;
                    } else if (rowRender.type == 'normal') {
                        //普通渲染方式
                        const labelIndex =
                            rowRender.schema.columnProps?.labelIndex;
                        if (labelIndex) {
                            //直接返回数据，绕过field，这样做会失去effect，但是效率较高
                            return (
                                <FastLabel
                                    data={data}
                                    index={record._index + '.' + labelIndex}
                                />
                            );
                        } else {
                            //正常渲染模式
                            return (
                                <ArrayRecursiveContextProvider
                                    value={nextChildIndex}
                                >
                                    <ArrayIndexContextProvider
                                        value={record._index}
                                    >
                                        <RecursionField
                                            name={record._index}
                                            schema={rowRender.schema.schema}
                                            onlyRenderProperties
                                        />
                                    </ArrayIndexContextProvider>
                                </ArrayRecursiveContextProvider>
                            );
                        }
                    } else if (rowRender.type == 'splitRow') {
                        //FIXME，未完成
                        throw new Error('Oh my god');
                    }
                },
            };
            return single;
        }
    };
    return tableConfig.renderColumn.map(convertColumn);
}

export default getDataColumns;
