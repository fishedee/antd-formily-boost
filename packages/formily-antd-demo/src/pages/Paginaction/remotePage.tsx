import { createForm } from '@formily/core';
import { createSchemaField, FormConsumer, observer } from '@formily/react';
import { Label, Table, Link, SpaceDivider } from 'formily-antd';
import { PaginationType } from 'formily-antd/Table';
import { Form, FormItem, Input, Select, Space } from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import { useMemo } from 'react';
import { batch, observable } from '@formily/reactive';
import { useEffect } from 'react';

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

type DataType = {
    name: string;
    age: number;
};
const sleep = (timeout: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, timeout);
    });
};
let globalState: { data: DataType[]; paginaction: PaginationType } = observable(
    {
        data: [],
        paginaction: {
            current: 1,
            pageSize: 10,
        },
    },
);

const fetch = async () => {
    await sleep(100);
    const total = 1000;
    const begin =
        (globalState.paginaction.current - 1) *
        globalState.paginaction.pageSize;
    const end =
        begin + globalState.paginaction.pageSize < total
            ? begin + globalState.paginaction.pageSize
            : total;
    let result: any[] = [];
    for (var i = begin; i < end; i++) {
        result.push({
            name: 'fish_' + i,
            time: new Date().toLocaleString(),
        });
    }
    batch(() => {
        //设置了paginaction的total值的都是后端分页模式
        globalState.paginaction.total = total;
        globalState.data = result;
    });
};

export default observer(() => {
    const form = useMemo(() => {
        return createForm({
            values: globalState,
        });
    }, []);

    useEffect(() => {
        fetch();
    }, [globalState.paginaction.current, globalState.paginaction.pageSize]);
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
                        <SchemaField.Array
                            name="data"
                            x-component="Table"
                            x-component-props={{
                                paginaction: globalState.paginaction,
                                paginationProps: {
                                    defaultPageSize: 10,
                                    showQuickJumper: true,
                                    showTotal: true,
                                },
                            }}
                        >
                            <SchemaField.Void>
                                <SchemaField.Void
                                    title="名字"
                                    x-component="Table.Column"
                                    x-component-props={{}}
                                >
                                    <SchemaField.String
                                        name="name"
                                        x-component={'Input'}
                                        x-decorator={'FormItem'}
                                    />
                                </SchemaField.Void>

                                <SchemaField.Void
                                    title="时间"
                                    x-component="Table.Column"
                                    x-component-props={{}}
                                >
                                    <SchemaField.String
                                        name="time"
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
});
