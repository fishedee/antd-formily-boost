import { createForm, onFieldReact } from '@formily/core';
import { createSchemaField, FormConsumer, Schema } from '@formily/react';
import { Label, Table, Link, SpaceDivider } from 'formily-antd';
import { Form, FormItem, Input, Select, Space } from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import { useMemo } from 'react';
import { observable } from '@formily/reactive';

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
        Select,
        Table,
        Label,
        Link,
        SpaceDivider,
    },
});

let lastState: any = observable({
    data: [],
});

function getRecursive(depth: number, prevIndex: string): any {
    let result = [];
    if (depth == 0) {
        return;
    }
    for (var i = 0; i != 10; i++) {
        const index = prevIndex != '' ? prevIndex + '-' + i : i + '';
        result.push({
            id: index,
            name: 'fish_' + index,
            age: i,
            items: getRecursive(depth - 1, index),
        });
    }
    return result;
}

lastState.data = getRecursive(5, '');

export default () => {
    const form = useMemo(() => {
        return createForm({
            values: lastState,
            effects: () => {},
        });
    }, []);
    return (
        <Space
            style={{
                background: 'rgb(240, 242, 245)',
                padding: '20px',
                display: 'flex',
            }}
            direction="vertical"
            size={10}
        >
            <ProCard title="基础">
                <Form form={form} feedbackLayout="terse">
                    <SchemaField>
                        <SchemaField.Array
                            name="data"
                            x-component="Table"
                            x-component-props={{
                                //默认不打开virtualScroll
                                scroll: {
                                    x: 2000,
                                    y: 300,
                                },
                                virtualScroll: {
                                    //你可以直接传送每行的高度，也可以告诉Table组件当前使用的哪种主题，compact模式，size是大还是小
                                    itemHeight: {
                                        compact: true,
                                        size: 'default',
                                    },
                                },
                            }}
                        >
                            <SchemaField.Void>
                                <SchemaField.Void
                                    title="序号"
                                    x-component="Table.Column"
                                    x-component-props={{
                                        fixed: 'left',
                                        width: 200,
                                        //使用label优化，绕过Field，这样会失去Field，Input，effect等支持，仅仅用来展示数据
                                        labelIndex: 'id',
                                    }}
                                />
                                <SchemaField.Void
                                    title="名字2"
                                    x-component="Table.Column"
                                    x-component-props={{
                                        width: 300,
                                        labelIndex: 'name',
                                    }}
                                />
                                <SchemaField.Void
                                    title="名字3"
                                    x-component="Table.Column"
                                    x-component-props={{
                                        width: 300,
                                        labelIndex: 'name',
                                    }}
                                />
                                <SchemaField.Void
                                    title="名字4"
                                    x-component="Table.Column"
                                    x-component-props={{
                                        width: 300,
                                        labelIndex: 'name',
                                    }}
                                />

                                <SchemaField.Void
                                    title="年龄"
                                    x-component="Table.Column"
                                    x-component-props={{
                                        width: 300,
                                        labelIndex: 'age',
                                    }}
                                />
                                <SchemaField.Void
                                    x-component="Table.RecursiveRow"
                                    x-component-props={{
                                        //递归的字段名
                                        recursiveIndex: 'items',
                                        //点击行的时候展开
                                        expandRowByClick: true,
                                    }}
                                />
                            </SchemaField.Void>
                        </SchemaField.Array>
                    </SchemaField>
                </Form>
            </ProCard>
        </Space>
    );
};
