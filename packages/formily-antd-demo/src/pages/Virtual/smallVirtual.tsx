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

for (var i = 0; i != 100000; i++) {
    lastState.data.push({
        id: i + 1,
        name: 'fish_' + i,
        age: i,
    });
}

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
                                size: 'small',
                                virtualScroll: {
                                    //你可以直接传送每行的高度，也可以告诉Table组件当前使用的哪种主题，compact模式，size是大还是小
                                    itemHeight: {
                                        compact: true,
                                        size: 'small',
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
                                        width: 100,
                                    }}
                                >
                                    <SchemaField.String
                                        name="id"
                                        x-component={'Label'}
                                    />
                                </SchemaField.Void>
                                <SchemaField.Void
                                    title="名字2"
                                    x-component="Table.Column"
                                    x-component-props={{
                                        width: 300,
                                    }}
                                >
                                    <SchemaField.String
                                        name="name"
                                        x-component={'Label'}
                                    />
                                </SchemaField.Void>
                                <SchemaField.Void
                                    title="名字3"
                                    x-component="Table.Column"
                                    x-component-props={{
                                        width: 300,
                                    }}
                                >
                                    <SchemaField.String
                                        name="name"
                                        x-component={'Label'}
                                    />
                                </SchemaField.Void>
                                <SchemaField.Void
                                    title="名字4"
                                    x-component="Table.Column"
                                    x-component-props={{
                                        width: 300,
                                    }}
                                >
                                    <SchemaField.String
                                        name="name"
                                        required={true}
                                        x-component={'Label'}
                                    />
                                </SchemaField.Void>

                                <SchemaField.Void
                                    title="年龄"
                                    x-component="Table.Column"
                                    x-component-props={{
                                        width: 300,
                                    }}
                                >
                                    <SchemaField.String
                                        name="age"
                                        x-component={'Label'}
                                    />
                                </SchemaField.Void>
                            </SchemaField.Void>
                        </SchemaField.Array>
                    </SchemaField>
                </Form>
            </ProCard>
        </Space>
    );
};
