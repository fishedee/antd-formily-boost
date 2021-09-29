import { createForm, onFieldReact } from '@formily/core';
import { createSchemaField, FormConsumer, Schema } from '@formily/react';
import { Label, Table, Link, SpaceDivider } from 'antd-formily-boost';
import { Form, FormItem, Input, Select, Space } from '@formily/antd';
import { useMemo } from 'react';
import { observable } from '@formily/reactive';
import React from 'react';

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
            salesOrderId: 10001,
            name: 'fish',
            address: 'fish_address',
            items: [
                {
                    productId: 20001,
                    productName: 'product_1',
                    count: 10,
                },
                {
                    productId: 20002,
                    productName: 'product_2',
                    count: 20,
                },
            ],
        },
        {
            salesOrderId: 10002,
            name: 'cat',
            address: 'cat_address',
            items: [
                {
                    productId: 20003,
                    productName: 'product_3',
                    count: 30,
                },
                {
                    productId: 20004,
                    productName: 'product_4',
                    count: 40,
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
                <SchemaField.Array name="data" x-component="Table">
                    <SchemaField.Void>
                        <SchemaField.Void
                            name="salesOrderId"
                            title="销售ID"
                            x-component="Table.Column"
                            x-component-props={{
                                labelIndex: 'salesOrderId',
                            }}
                        />

                        <SchemaField.Void
                            name="name"
                            title="客户"
                            x-component="Table.Column"
                            x-component-props={{
                                labelIndex: 'name',
                            }}
                        />
                        <SchemaField.Void
                            name="address"
                            title="地址"
                            x-component="Table.Column"
                            x-component-props={{
                                labelIndex: 'address',
                            }}
                        />
                        <SchemaField.Void
                            x-component="Table.ChildrenRow"
                            x-component-props={{
                                //递归的字段名
                                childrenIndex: 'items',
                                //点击行的时候展开
                                expandRowByClick: true,
                                defaultExpand: true,
                            }}
                        >
                            <SchemaField.Void
                                x-component="Table.Column"
                                x-component-props={{
                                    //指向name列
                                    refColumnName: 'name',
                                    labelIndex: 'productName',
                                }}
                            />
                            <SchemaField.Void
                                x-component="Table.Column"
                                x-component-props={{
                                    //指向到address的列
                                    refColumnName: 'address',
                                }}
                            >
                                <SchemaField.String
                                    name="count"
                                    required={true}
                                    x-component={'Input'}
                                    x-decorator={'FormItem'}
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
