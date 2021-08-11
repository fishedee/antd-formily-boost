import { createForm, onFieldReact } from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import { Label, Table, Link, SpaceDivider } from 'formily-antd';
import { Form, FormItem, Input, Select } from '@formily/antd';
import React, { useMemo } from 'react';
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
        },
        {
            name: 'cat',
            age: 456,
        },
        {
            name: 'dog',
            age: 789,
        },
    ],
});

export default () => {
    const form = useMemo(() => {
        return createForm({
            values: lastState,
            effects: () => {
                onFieldReact('data.*.operation.edit', (field) => {
                    field.componentProps.to = {
                        pathname: '/Link/edit',
                        query: {
                            name: field.query('..name').value(),
                        },
                    };
                });
                onFieldReact('data.*.operation.delete', (field) => {
                    field.componentProps.onClick = () => {
                        alert(field.query('..name').value());
                    };
                });
            },
        });
    }, []);
    return (
        <Form form={form} feedbackLayout="terse">
            <SchemaField>
                <SchemaField.Array
                    name="data"
                    x-component="Table"
                    x-component-props={{
                        //加上边框
                        bordered: true,
                    }}
                >
                    <SchemaField.Void>
                        <SchemaField.Void
                            title="名字"
                            x-component="Table.Column"
                            x-component-props={{}}
                        >
                            <SchemaField.String
                                name="name"
                                required={true}
                                x-component={'Input'}
                                x-decorator="FormItem"
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
                    </SchemaField.Void>
                </SchemaField.Array>
            </SchemaField>
            <FormConsumer>
                {() => <div>{JSON.stringify(form.values)}</div>}
            </FormConsumer>
        </Form>
    );
};
