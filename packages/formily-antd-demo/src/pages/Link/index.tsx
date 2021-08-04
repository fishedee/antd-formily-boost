import {
    createForm,
    Field,
    IFormState,
    onFieldChange,
    onFieldInputValueChange,
    onFieldReact,
    onFieldValueChange,
    onFormMount,
    onFormUnmount,
} from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import { Label, Table, Link } from 'formily-antd';
import { Form, FormItem, Input, Select, Space } from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import { useMemo } from 'react';

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
        Select,
        Table,
        Label,
        Link,
    },
});

let lastState: any = undefined;

export default () => {
    const form = useMemo(() => {
        return createForm({
            effects: () => {
                onFieldReact('data.*.edit', (field) => {
                    field.componentProps.to = {
                        pathname: '/Link/edit',
                        query: {
                            name: field.query('.name').value(),
                        },
                    };
                });
                onFormMount(() => {
                    if (lastState) {
                        form.setValues(lastState);
                    } else {
                        form.setInitialValues({
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
                    }
                });
                onFormUnmount(() => {
                    lastState = form.values;
                });
            },
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
                                        name="edit"
                                        title="编辑"
                                        x-component={'Link'}
                                    />
                                </SchemaField.Void>
                            </SchemaField.Void>
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
