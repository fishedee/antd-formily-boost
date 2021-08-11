import { createForm } from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import { Label, Table } from 'formily-antd';
import { Form, FormItem, Select } from '@formily/antd';
import React, { useMemo } from 'react';
import { observable } from '@formily/reactive';

type MyInputType = {
    value: string;
    onChange: (data: value) => void;
};

const MyInput = (props: MyInputType) => {
    return (
        <input
            style={{
                color: 'red',
                background: 'none',
                outline: 'none',
                width: '100%',
                border: '1px solid grey',
            }}
            value={props.value}
            onChange={props.onChange}
        />
    );
};

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input: MyInput,
        Select,
        Table,
        Label,
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
                            x-component-props={{}}
                        >
                            <SchemaField.String
                                name="age"
                                x-component={'Label'}
                            />
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
