import { ArrayField, Field } from '@formily/core';
import {
    RecursionField,
    Schema,
    useField,
    useFieldSchema,
    useForm,
} from '@formily/react';
import { observer } from '@formily/reactive-react';
import React, { Fragment } from 'react';
import { Table } from 'antd';
import { ReactElement } from 'react';
import { isColumnType } from './IsType';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import { ArrayIndexContextProvider } from './Context';

type ColumnProps = {
    width?: number;
    ellipsis?: boolean;
    fixed?: 'left' | 'right';
};

type TextProps = {
    value: string;
};

type Column = {
    title: string;
    dataIndex: string;
    key: string;
    schema: Schema;
    width?: number;
    ellipsis?: boolean;
    fixed?: 'left' | 'right';
};

function getColumn(schema: Schema): Column[] {
    //在当前实现中，Column层看成是Field
    let itemsSchema: Schema['items'] = schema.items;
    const items = Array.isArray(itemsSchema) ? itemsSchema : [itemsSchema];
    //获取当前array的field
    let form = useForm();
    let field = useField();
    const parseSource = (schema: Schema): Column[] => {
        //在渲染的时候，手动拿出每个Column的Field，并且将Schema作为保底逻辑
        //这里的写法，其实是先取field数据，再去createField
        //当第一次render的时候，Field不存在时，返回值为undefined
        let columnField = form.query(field.address + '.' + schema.name).take();
        let component = schema['x-component'];
        let isVisible = columnField?.visible || schema['x-visible'];
        if (isVisible == false) {
            return [];
        }
        if (isColumnType(component)) {
            //获取该列的信息
            const style: ColumnProps = {};
            style.width =
                columnField?.componentProps?.width ||
                schema['x-component-props']?.width;
            style.ellipsis =
                columnField?.componentProps?.ellipsis ||
                schema['x-component-props']?.ellipsis;
            style.fixed =
                columnField?.componentProps?.fixed ||
                schema['x-component-props']?.fixed;
            return [
                {
                    key: schema.name + '',
                    dataIndex: schema.name + '',
                    title:
                        columnField?.componentProps?.title ||
                        schema['x-component-props']?.title,
                    schema: schema,
                    ...style,
                },
            ];
        }
        return [];
    };
    const reduceProperties = (schema: Schema): Column[] => {
        //对于items里面的每个schema，每个Schema为Void字段，遍历它的Properties
        if (schema.properties) {
            return schema.reduceProperties((current, schema) => {
                return current.concat(parseSource(schema));
            }, [] as Column[]);
        } else {
            return [];
        }
    };
    return items.reduce((current, schema) => {
        //遍历每个items里面的schema
        if (schema) {
            return current.concat(reduceProperties(schema));
        }
        return current;
    }, [] as Column[]);
}

function getDataSource(data: any[], columns: Column[]): any[] {
    let result = [];
    for (var i in data) {
        var single = {
            _index: i,
        };
        result.push(single);
    }
    return result;
}

function getDataColumns(columns: Column[]): ColumnType<unknown>[] {
    return columns.map((column) => {
        let single: ColumnType<unknown> = {
            ...column,
            render: (value: any, record: any, index: number) => {
                return (
                    <ArrayIndexContextProvider value={record._index}>
                        <RecursionField
                            name={record._index}
                            schema={column.schema}
                            onlyRenderProperties
                        />
                    </ArrayIndexContextProvider>
                );
            },
        };
        return single;
    });
}

type PropsType = Field & {
    children: (index: number) => ReactElement;
};

type MyTableType = React.FC<PropsType> & {
    Column?: React.FC<ColumnProps>;
};

const MyTable: MyTableType = observer((props: PropsType) => {
    const field = useField<ArrayField>();
    const fieldSchema = useFieldSchema();
    const tableColumns = getColumn(fieldSchema);
    const dataSource = getDataSource(field.value, tableColumns);
    const dataColumns: ColumnsType<any> = getDataColumns(tableColumns);
    return (
        <Fragment>
            <Table
                rowKey="_index"
                bordered={true}
                columns={dataColumns}
                dataSource={dataSource}
            />
            {tableColumns.map((column) => {
                //这里实际渲染每个Column，以保证Column能接收到Reaction
                //注意要使用onlyRenderSelf
                return (
                    <RecursionField
                        key={column.key}
                        name={column.key}
                        schema={column.schema}
                        onlyRenderSelf
                    />
                );
            })}
        </Fragment>
    );
});

MyTable.Column = (props) => {
    return <Fragment></Fragment>;
};

export default MyTable;