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

let lastState = observable({
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
                    count: 130,
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
});

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
                //指向name列
                refColumnName: 'item',
                labelIndex: 'productName',
            }}
        />
        <SchemaField.Void
            x-component="Table.Column"
            x-component-props={{
                //指向name列
                refColumnName: 'count',
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
        x-component="Table.ExpandableRow"
        x-component-props={{
            //展开的字段名
            defaultExpand: true,
        }}
    >
        <SchemaField.Array
            name={'productors'}
            x-component="Table"
            x-component-props={{
                bordered: true,
            }}
        >
            <SchemaField.Void>
                <SchemaField.Void
                    title={'生厂商'}
                    name={'productorName'}
                    x-component="Table.Column"
                    x-component-props={{
                        //指向id列
                        labelIndex: 'productorName',
                    }}
                />
                <SchemaField.Void
                    title={'产品'}
                    name={'item'}
                    x-component="Table.Column"
                />
                <SchemaField.Void
                    title={'数量'}
                    name={'count'}
                    x-component="Table.Column"
                />
                <SchemaField.Void
                    title={'总数'}
                    name={'total'}
                    x-component="Table.Column"
                >
                    <SchemaField.Number
                        //这个列不能用labelIndex，因为有effects
                        default={0}
                        required={true}
                        name="count"
                        x-component="Label"
                        x-decorator="FormItem"
                    />
                </SchemaField.Void>
                {itemsChildrenRow}
            </SchemaField.Void>
        </SchemaField.Array>
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
                    }}
                >
                    <SchemaField.Void>
                        <SchemaField.Void
                            x-component="Table.CheckboxColumn"
                            x-component-props={{
                                selectedIndex: '_checkbox',
                            }}
                        />
                        <SchemaField.Void
                            name="id"
                            title="序号"
                            x-component="Table.Column"
                        >
                            <SchemaField.Void x-component={'Table.Index'} />
                        </SchemaField.Void>
                        <SchemaField.Void
                            name="salesOrderId"
                            title="销售ID"
                            x-component="Table.Column"
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
                            title="客户"
                            x-component="Table.Column"
                        >
                            <SchemaField.String
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
                        >
                            <SchemaField.String
                                name="address"
                                required={true}
                                x-component="Input"
                                x-decorator={'FormItem'}
                            />
                        </SchemaField.Void>
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
