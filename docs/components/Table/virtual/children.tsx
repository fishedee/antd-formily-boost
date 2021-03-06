import { createForm, onFieldReact } from '@formily/core';
import { createSchemaField, FormConsumer, Schema } from '@formily/react';
import { Label, Table, Link, SpaceDivider } from 'antd-formily-boost';
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

function getItems(prefix: string): any {
    let result = [];
    for (let i = 0; i != 100; i++) {
        result.push({
            salesOrderId: prefix + '_' + i,
            productName: 'productName_' + prefix + '_' + i,
            count: 10,
        });
    }
    return result;
}

function getProductors(prefix: string): any {
    let result = [];
    for (let i = 0; i != 100; i++) {
        result.push({
            salesOrderId: prefix + '_' + i,
            productorName: 'productorName_' + prefix + '_' + i,
            count: 1000,
            items: getItems(prefix + '_' + i),
        });
    }
    return result;
}
function getOrders(prefix: string): any {
    let result = [];
    for (let i = 0; i != 10; i++) {
        result.push({
            salesOrderId: i,
            name: 'fish_' + i,
            address: 'address_' + i,
            productors: getProductors(i + ''),
        });
    }
    return result;
}
lastState.data = getOrders();

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
                        scroll: {
                            x: 1000,
                            y: 300,
                        },
                        virtualScroll: {
                            //??????????????????????????????????????????????????????Table????????????????????????????????????compact?????????size???????????????
                            itemHeight: {
                                compact: true,
                                size: 'small',
                            },
                        },
                    }}
                >
                    <SchemaField.Void>
                        <SchemaField.Void
                            name="salesOrderId"
                            title="??????ID"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 200,
                                labelIndex: 'salesOrderId',
                                fixed: 'left',
                            }}
                        />

                        <SchemaField.Void
                            name="name"
                            title="??????"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 300,
                                labelIndex: 'name',
                            }}
                        />
                        <SchemaField.Void
                            name="name2"
                            title="??????2"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 300,
                                labelIndex: 'name',
                            }}
                        />
                        <SchemaField.Void
                            name="name3"
                            title="??????3"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 300,
                                labelIndex: 'name',
                            }}
                        />
                        <SchemaField.Void
                            name="address"
                            title="??????"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 300,
                                labelIndex: 'address',
                            }}
                        />
                        <SchemaField.Void
                            x-component="Table.ChildrenRow"
                            x-component-props={{
                                //??????????????????
                                childrenIndex: 'productors',
                            }}
                        >
                            <SchemaField.Void
                                x-component="Table.Column"
                                x-component-props={{
                                    refColumnName: 'salesOrderId',
                                    labelIndex: 'salesOrderId',
                                }}
                            />
                            <SchemaField.Void
                                x-component="Table.Column"
                                x-component-props={{
                                    //??????name???
                                    refColumnName: 'name',
                                    labelIndex: 'productorName',
                                }}
                            />
                            <SchemaField.Void
                                x-component="Table.ChildrenRow"
                                x-component-props={{
                                    //??????????????????
                                    childrenIndex: 'items',
                                }}
                            >
                                <SchemaField.Void
                                    x-component="Table.Column"
                                    x-component-props={{
                                        refColumnName: 'salesOrderId',
                                        labelIndex: 'salesOrderId',
                                    }}
                                />
                                <SchemaField.Void
                                    x-component="Table.Column"
                                    x-component-props={{
                                        //??????name???
                                        refColumnName: 'name',
                                        labelIndex: 'productName',
                                    }}
                                />
                                <SchemaField.Void
                                    x-component="Table.Column"
                                    x-component-props={{
                                        //??????name???
                                        refColumnName: 'address',
                                        labelIndex: 'count',
                                    }}
                                />
                            </SchemaField.Void>
                        </SchemaField.Void>
                    </SchemaField.Void>
                </SchemaField.Array>
            </SchemaField>
        </Form>
    );
};
