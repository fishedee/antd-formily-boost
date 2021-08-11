import {
    createForm,
    onFieldInputValueChange,
    onFieldReact,
} from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import { Label, Table } from 'formily-antd';
import { Form, FormItem, Input, Select, Space } from '@formily/antd';

const form = createForm({
    initialValues: {
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
    },
});

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
        Select,
        Table,
        Label,
    },
});

export default () => {
    return (
        <Form form={form} feedbackLayout="terse">
            <SchemaField>
                <SchemaField.Array name="data" x-component="Table">
                    <SchemaField.Void>
                        <SchemaField.Void
                            name="firstColumn"
                            title="名字"
                            x-visible={false}
                            x-component="Table.Column"
                            x-component-props={{
                                width: '50%',
                            }}
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
