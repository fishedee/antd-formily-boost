import { createForm } from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import {
    Label,
    Table,
    getDataInIndex,
    setDataInIndex,
} from 'antd-formily-boost';
import { Form, FormItem, Select, Input } from '@formily/antd';
import React, { useMemo } from 'react';
import { observable } from '@formily/reactive';
const SchemaField = createSchemaField({
    components: {
        FormItem,
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

    const myInput = (rowData: any, index: string) => {
        const value = rowData ? rowData['name'] : undefined;
        const onChange = (e) => {
            const newValue = e.target.value;
            if (rowData) {
                rowData['name'] = newValue;
            }
        };
        return <Input value={value} onChange={onChange} />;
    };
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
                            x-component-props={{
                                render: myInput,
                            }}
                        />

                        <SchemaField.Void
                            title="年龄"
                            x-component="Table.Column"
                            x-component-props={{
                                labelIndex: 'name',
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
