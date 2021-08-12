import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Label, Table, Link, SpaceDivider } from 'antd-formily-boost';
import { Form, FormItem, Input, Select } from '@formily/antd';
import { useMemo } from 'react';
import { observable } from '@formily/reactive';

type MyInputType = {
    value: string;
    onChange: (data: any) => void;
};

const MyInput = (props: MyInputType) => {
    return (
        <input
            style={{
                color: 'red',
                background: 'none',
                outline: 'none',
                width: '100%',
                border: '1px solid grey',
            }}
            value={props.value}
            onChange={props.onChange}
        />
    );
};

const SchemaField = createSchemaField({
    components: {
        FormItem,
        MyInput,
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
                        scroll: {
                            x: 2000,
                            y: 300,
                        },
                        virtualScroll: {
                            //你可以直接传送每行的高度，也可以告诉Table组件当前使用的哪种主题，compact模式，size是大还是小
                            itemHeight: {
                                compact: true,
                                size: 'default',
                            },
                        },
                    }}
                >
                    <SchemaField.Void>
                        <SchemaField.Void
                            title="序号"
                            x-component="Table.Column"
                            x-component-props={{
                                //依然打开fixed
                                fixed: 'left',
                                width: 100,
                                labelIndex: 'id',
                            }}
                        />
                        <SchemaField.Void
                            title="名字2"
                            x-component="Table.Column"
                            x-component-props={{
                                width: 300,
                            }}
                        >
                            <SchemaField.String
                                name="name"
                                required={true}
                                x-component="MyInput"
                                x-decorator="FormItem"
                            />
                        </SchemaField.Void>
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
