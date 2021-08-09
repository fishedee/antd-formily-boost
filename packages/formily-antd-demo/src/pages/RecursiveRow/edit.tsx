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

let lastState = observable({
    data: [
        {
            name: 'John Brown sr.',
            age: 60,
            address: 'New York No. 1 Lake Park',
            items: [
                {
                    name: 'John Brown',
                    age: 42,
                    address: 'New York No. 2 Lake Park',
                },
                {
                    name: 'John Brown jr.',
                    age: 30,
                    address: 'New York No. 3 Lake Park',
                    items: [
                        {
                            name: 'Jimmy Brown',
                            age: 16,
                            address: 'New York No. 3 Lake Park',
                        },
                    ],
                },
                {
                    name: 'Jim Green sr.',
                    age: 72,
                    address: 'London No. 1 Lake Park',
                    items: [
                        {
                            name: 'Jim Green',
                            age: 42,
                            address: 'London No. 2 Lake Park',
                            items: [
                                {
                                    name: 'Jim Green jr.',
                                    age: 25,
                                    address: 'London No. 3 Lake Park',
                                },
                                {
                                    name: 'Jimmy Green sr.',
                                    age: 18,
                                    address: 'London No. 4 Lake Park',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ],
});

export default () => {
    const form = useMemo(() => {
        return createForm({
            values: lastState,
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
                        <SchemaField.Array name="data" x-component="Table">
                            <SchemaField.Void>
                                <SchemaField.Void
                                    title="序号"
                                    x-component="Table.Column"
                                    x-component-props={{}}
                                >
                                    <SchemaField.Void x-component="Table.Index" />
                                </SchemaField.Void>
                                <SchemaField.Void
                                    title="名字"
                                    x-component="Table.Column"
                                    x-component-props={{}}
                                >
                                    <SchemaField.String
                                        name="name"
                                        x-component={'Input'}
                                    />
                                </SchemaField.Void>

                                <SchemaField.Void
                                    title="年龄"
                                    x-component="Table.Column"
                                    x-component-props={{}}
                                >
                                    <SchemaField.String
                                        name="age"
                                        x-component={'Input'}
                                    />
                                </SchemaField.Void>
                                <SchemaField.Void
                                    title="地址"
                                    x-component="Table.Column"
                                    x-component-props={{}}
                                >
                                    <SchemaField.String
                                        name="address"
                                        x-component={'Input'}
                                    />
                                </SchemaField.Void>
                                <SchemaField.Void
                                    x-component="Table.RecursiveRow"
                                    x-component-props={{
                                        //递归的字段名
                                        dataIndex: 'items',
                                    }}
                                />
                                <SchemaField.Void
                                    title="操作"
                                    x-component="Table.Column"
                                    x-component-props={{}}
                                >
                                    <SchemaField.Void
                                        name="operation"
                                        x-component={'SpaceDivider'}
                                    >
                                        <SchemaField.Void
                                            x-component={
                                                'Table.SubtreeAddition'
                                            }
                                            x-component-props={{
                                                icon: <span />,
                                                title: '添加子项',
                                            }}
                                        />

                                        <SchemaField.Void
                                            x-component={'Table.MoveUp'}
                                        />
                                        <SchemaField.Void
                                            x-component={'Table.MoveDown'}
                                        />
                                        <SchemaField.Void
                                            x-component={'Table.Remove'}
                                        />
                                    </SchemaField.Void>
                                </SchemaField.Void>
                            </SchemaField.Void>
                            <SchemaField.Void x-component="Table.Addition" />
                        </SchemaField.Array>
                    </SchemaField>
                </Form>
            </ProCard>

            <ProCard title="数据">
                <Form form={form} feedbackLayout="terse">
                    <FormConsumer>
                        {() => <div>{JSON.stringify(form.values)}</div>}
                    </FormConsumer>
                </Form>
            </ProCard>
        </Space>
    );
};
