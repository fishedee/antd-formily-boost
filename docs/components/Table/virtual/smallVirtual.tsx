import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Label, Table, Link, SpaceDivider } from 'antd-formily-boost';
import { Form, FormItem, Input, Select } from '@formily/antd';
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

for (var i = 0; i != 100000; i++) {
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
                        size: 'small',
                        virtualScroll: {
                            //你可以直接传送每行的高度，也可以告诉Table组件当前使用的哪种主题，compact模式，size是大还是小
                            itemHeight: {
                                compact: true,
                                size: 'small',
                            },
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
                                //使用label优化，绕过Field，这样会失去Field，Input，effect等支持，仅仅用来展示数据
                                labelIndex: 'id',
                            }}
                        />
                        <SchemaField.Void
                            title="名字2"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 300,
                                labelIndex: 'name',
                            }}
                        />
                        <SchemaField.Void
                            title="名字3"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 300,
                                labelIndex: 'name',
                            }}
                        />
                        <SchemaField.Void
                            title="名字4"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 300,
                                labelIndex: 'name',
                            }}
                        />

                        <SchemaField.Void
                            title="年龄"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 300,
                                labelIndex: 'age',
                            }}
                        />
                    </SchemaField.Void>
                </SchemaField.Array>
            </SchemaField>
        </Form>
    );
};
