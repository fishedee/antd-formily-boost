import {
    createForm,
    Field,
    onFieldInputValueChange,
    onFieldReact,
} from '@formily/core';
import { createSchemaField, FormConsumer, observer } from '@formily/react';
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

let lastState = {
    data: [
        {
            salesOrderId: 10001,
            name: 'fish',
            address: 'fish_address',
            productors: [
                {
                    productorName: 'company_1',
                    count: 30,
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
                    productorName: 'company_2',
                    count: 70,
                    items: [
                        {
                            productId: 20001,
                            productName: 'product_3',
                            count: 30,
                        },
                        {
                            productId: 20002,
                            productName: 'product_4',
                            count: 40,
                        },
                    ],
                },
            ],
        },
        {
            salesOrderId: 10002,
            name: 'cat',
            address: 'cat_address',
            productors: [
                {
                    productorName: 'company_3',
                    count: 110,
                    items: [
                        {
                            productId: 20001,
                            productName: 'product_5',
                            count: 50,
                        },
                        {
                            productId: 20002,
                            productName: 'product_6',
                            count: 60,
                        },
                    ],
                },
                {
                    productorName: 'company_4',
                    count: 150,
                    items: [
                        {
                            productId: 20001,
                            productName: 'product_7',
                            count: 70,
                        },
                        {
                            productId: 20002,
                            productName: 'product_8',
                            count: 80,
                        },
                    ],
                },
            ],
        },
    ],
};

const itemsChildrenRow = (
    <SchemaField.Void
        x-component="Table.SplitRow"
        x-component-props={{
            //递归的字段名
            splitIndex: 'items',
        }}
    >
        <SchemaField.Void
            x-component="Table.Column"
            x-component-props={{
                //指向productName列
                refColumnName: 'productName',
                labelIndex: 'productName',
            }}
        />
        <SchemaField.Void
            x-component="Table.Column"
            x-component-props={{
                //指向name列
                refColumnName: 'amount',
            }}
        >
            <SchemaField.String
                title={'数量'}
                name="count"
                required={true}
                format={'number'}
                x-component="Input"
                x-decorator={'FormItem'}
            />
        </SchemaField.Void>
    </SchemaField.Void>
);

const productsChildrenRow = (
    <SchemaField.Void
        x-component="Table.SplitRow"
        x-component-props={{
            //递归的字段名
            splitIndex: 'productors',
        }}
    >
        <SchemaField.Void
            x-component="Table.Column"
            x-component-props={{
                //指向productorName列
                refColumnName: 'productorName',
                labelIndex: 'productorName',
            }}
        />
        <SchemaField.Void
            x-component="Table.Column"
            x-component-props={{
                //指向total列
                refColumnName: 'total',
            }}
        >
            <SchemaField.String name="count" x-component="Label" />
        </SchemaField.Void>
        {itemsChildrenRow}
    </SchemaField.Void>
);
export default observer(() => {
    const form = useMemo(() => {
        return createForm({
            values: lastState,
            effects: () => {
                onFieldInputValueChange(
                    'data.*.productors.*.items.*.count',
                    (f) => {
                        const field = f as Field;
                        const topField = f.query('...').value();

                        let totalCount = 0;
                        for (let i = 0; i != topField.items.length; i++) {
                            let single = topField.items[i];
                            totalCount += parseInt(single.count) || 0;
                        }
                        topField.count = totalCount;
                    },
                );
            },
        });
    }, []);
    return (
        <Form form={form} feedbackLayout="terse">
            <SchemaField>
                <SchemaField.Array
                    name="data"
                    x-component="Table"
                    x-component-props={{
                        bordered: true,
                        scroll: {
                            x: 1200,
                        },
                    }}
                >
                    <SchemaField.Void>
                        <SchemaField.Void
                            x-component="Table.CheckboxColumn"
                            x-component-props={{
                                fixed: true,
                                selectedIndex: '_checkbox',
                                width: '50px',
                            }}
                        />
                        <SchemaField.Void
                            name="id"
                            title="序号"
                            x-component="Table.Column"
                            x-component-props={{
                                fixed: 'left',
                                width: 50,
                            }}
                        >
                            <SchemaField.Void x-component={'Table.Index'} />
                        </SchemaField.Void>
                        <SchemaField.Void
                            name="salesOrderId"
                            title="销售ID"
                            x-component="Table.Column"
                            x-component-props={{
                                fixed: 'left',
                                width: 150,
                            }}
                        >
                            <SchemaField.Number
                                name="salesOrderId"
                                required={true}
                                x-component="Input"
                                x-decorator={'FormItem'}
                            />
                        </SchemaField.Void>
                        <SchemaField.Void
                            name="name"
                            title="名称"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 150,
                            }}
                        >
                            <SchemaField.Number
                                name="name"
                                required={true}
                                x-component="Input"
                                x-decorator={'FormItem'}
                            />
                        </SchemaField.Void>
                        <SchemaField.Void
                            name="address"
                            title="地址"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 150,
                            }}
                        >
                            <SchemaField.Number
                                name="address"
                                x-component="Input"
                                x-decorator={'FormItem'}
                            />
                        </SchemaField.Void>
                        <SchemaField.Void
                            name="productorName"
                            title="生产商"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 150,
                            }}
                        />
                        <SchemaField.Void
                            name="productName"
                            title="商品名称"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 150,
                            }}
                        />
                        <SchemaField.Void
                            name="amount"
                            title="数量"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 150,
                            }}
                        />
                        <SchemaField.Void
                            name="total"
                            title="合计"
                            x-component="Table.Column"
                            x-component-props={{
                                fixed: 'right',
                                width: 150,
                            }}
                        />
                        {productsChildrenRow}
                    </SchemaField.Void>
                    <SchemaField.Void x-component={'Table.Addition'} />
                </SchemaField.Array>
            </SchemaField>

            <FormConsumer>
                {() => <div>{JSON.stringify(form.values)}</div>}
            </FormConsumer>
        </Form>
    );
});
