import { createForm } from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import { Label, Tree } from 'antd-formily-boost';
import { Form, FormItem, Input, Select } from '@formily/antd';
import React, { useMemo } from 'react';
import { observable } from '@formily/reactive';
import 'antd/dist/antd.compact.css';

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
        Select,
        Tree,
        Label,
    },
});

let lastState = observable({
    data: [
        {
            title: 'parent 1',
            children: [
                {
                    title: 'parent 1-0',
                    children: [
                        {
                            title: 'leaf',
                        },
                        {
                            title: 'leaf',
                        },
                    ],
                },
                {
                    title: 'parent 1-1',
                    children: [
                        {
                            title: 'sss',
                        },
                    ],
                },
            ],
        },
        {
            title: 'parent 2',
            children: [
                {
                    title: 'parent 2-0',
                    children: [
                        {
                            title: 'kk',
                        },
                    ],
                },
            ],
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
                    x-component="Tree"
                    x-component-props={{
                        blockNode: true,
                        checkbox: {
                            selectedIndex: 'myChecked',
                        },
                        expand: {
                            defaultExpand: true,
                        },
                    }}
                >
                    <SchemaField.Object>
                        <SchemaField.String
                            name="title"
                            x-component={'Label'}
                        />
                    </SchemaField.Object>
                </SchemaField.Array>
            </SchemaField>
            <FormConsumer>
                {() => <div>{JSON.stringify(form.values)}</div>}
            </FormConsumer>
        </Form>
    );
};
