import { createForm, onFieldReact } from '@formily/core';
import { createSchemaField, FormConsumer, Schema } from '@formily/react';
import { Label, Table, Link, SpaceDivider } from 'formily-antd';
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

let lastState: any = observable({
    data: [],
});

for (var i = 0; i != 500; i++) {
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
    );
};
