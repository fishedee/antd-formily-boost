import { createForm } from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import { Table } from 'formily-antd';
import { Form, FormItem, Input, Select } from '@formily/antd';
import React, { useMemo } from 'react';
import { observable } from '@formily/reactive';
import 'antd/dist/antd.css';

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
        Select,
        Table,
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
                            x-component-props={{
                                labelIndex: 'age',
                            }}
                        />
                    </SchemaField.Void>
                </SchemaField.Array>
            </SchemaField>
            <FormConsumer>
                {() => <div>{JSON.stringify(form.values)}</div>}
            </FormConsumer>
        </Form>
    );
};
