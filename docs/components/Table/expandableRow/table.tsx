import { createForm, onFieldReact } from '@formily/core';
import { createSchemaField, FormConsumer, Schema } from '@formily/react';
import { Label, Table, Link, SpaceDivider } from 'antd-formily-boost';
import { Form, FormItem, Input, Select, Space } from '@formily/antd';
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
            name: 'fish',
            age: 123,
            contacts: [
                { phone: 'phone-1', address: 'address-1' },
                { phone: 'phone-2', address: 'address-2' },
                { phone: 'phone-3', address: 'address-3' },
            ],
        },
        {
            name: 'cat',
            age: 456,
            contacts: [
                { phone: 'phone-4', address: 'address-4' },
                { phone: 'phone-5', address: 'address-5' },
                { phone: 'phone-6', address: 'address-6' },
            ],
        },
        {
            name: 'dog',
            age: 789,
            contacts: [
                { phone: 'phone-7', address: 'address-7' },
                { phone: 'phone-8', address: 'address-8' },
                { phone: 'phone-9', address: 'address-9' },
            ],
        },
    ],
});

//可以嵌套一个子表格
const expandRowTable = (
    <SchemaField.Array name="contacts" x-component="Table">
        <SchemaField.Void>
            <SchemaField.Void
                title="住址"
                x-component="Table.Column"
                x-component-props={{}}
            >
                <SchemaField.String name="address" x-component={'Label'} />
            </SchemaField.Void>
            <SchemaField.Void
                title="电话"
                x-component="Table.Column"
                x-component-props={{}}
            >
                <SchemaField.String
                    name="phone"
                    required={true}
                    x-component={'Input'}
                    x-decorator="FormItem"
                />
            </SchemaField.Void>
        </SchemaField.Void>
    </SchemaField.Array>
);
export default () => {
    const form = useMemo(() => {
        return createForm({
            values: lastState,
        });
    }, []);
    return (
        <Form form={form} feedbackLayout="terse">
            <SchemaField>
                <SchemaField.Array name="data" x-component="Table">
                    <SchemaField.Void>
                        <SchemaField.Void
                            title="名字"
                            x-component="Table.Column"
                            x-component-props={{}}
                        >
                            <SchemaField.String
                                name="name"
                                x-component={'Label'}
                            />
                        </SchemaField.Void>

                        <SchemaField.Void
                            title="年龄"
                            x-component="Table.Column"
                            x-component-props={{}}
                        >
                            <SchemaField.String
                                name="age"
                                x-component={'Label'}
                            />
                        </SchemaField.Void>
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
                                    name="edit"
                                    title="编辑"
                                    x-component={'Link'}
                                />
                                <SchemaField.Void
                                    name="delete"
                                    title="删除"
                                    x-component={'Link'}
                                />
                            </SchemaField.Void>
                        </SchemaField.Void>
                        <SchemaField.Void
                            x-component="Table.ExpandableRow"
                            x-component-props={{
                                //可以设置点击行的时候展开
                                expandRowByClick: true,
                                //默认展开全部
                                defaultExpand: true,
                            }}
                        >
                            {expandRowTable}
                        </SchemaField.Void>
                    </SchemaField.Void>
                </SchemaField.Array>
            </SchemaField>

            <FormConsumer>
                {() => <div>{JSON.stringify(form.values)}</div>}
            </FormConsumer>
        </Form>
    );
};
