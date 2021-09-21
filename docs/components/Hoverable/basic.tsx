import { createForm, onFieldMount, onFieldReact } from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import { Label, Tree, Link, Hoverable } from 'antd-formily-boost';
import { Form, FormItem, Input, Select, Space } from '@formily/antd';
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
        Space,
        Link,
        Hoverable,
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
            effects: () => {
                onFieldReact('data.*', (field) => {
                    const path = field.path.segments;
                    if (path.length != 0 && path[path.length - 1] == 'del') {
                        field.componentProps.onClick = () => {
                            alert('点我了 ' + field.address);
                        };
                    }
                });
            },
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
                        //默认展示叶子节点的图标
                        //showLine: true,
                        //可以配置不展示叶子节点的图标
                        showLine: { showLeafIcon: false },
                        style: {
                            width: '200px',
                        },
                    }}
                >
                    <SchemaField.Object
                        x-decorator={'Hoverable'}
                        x-decorator-props={{
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                            },
                        }}
                    >
                        <SchemaField.String
                            name="title"
                            x-component={'Label'}
                        />
                        <SchemaField.Void
                            name="del"
                            title="删除"
                            x-decorator={'Hoverable.Enter'}
                            x-component={'Link'}
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
