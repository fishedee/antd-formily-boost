import { createForm, onFieldReact } from '@formily/core';
import { createSchemaField, FormConsumer, Schema } from '@formily/react';
import { Label, Table, Link, SpaceDivider } from 'formily-antd';
import { Form, FormItem, Input, Select, Space } from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import { useMemo } from 'react';
import { observable } from '@formily/reactive';
//需要手动导入该样式来实现隐藏选择列
import 'formily-antd/esm/style.css';

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
            effects: () => {},
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
                                    //可以设置标题
                                    title="选择"
                                    x-component="Table.RadioColumn"
                                    x-component-props={{
                                        selectedIndex: '_radio',
                                        //点击行的时候就是选择该行
                                        selectRowByClick: true,
                                        //如果Table组件有scroll的，要使用WidthZero的方式隐藏列
                                        hidden: 'DisplayNone',
                                    }}
                                />
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
