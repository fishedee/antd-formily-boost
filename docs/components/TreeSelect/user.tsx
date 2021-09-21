import React from 'react';
import { FormConsumer } from '@formily/react';
import { Field } from '@formily/core';
import { TreeSelect, Label } from 'antd-formily-boost';
import { FormItem } from '@formily/antd';
import { createForm, onFieldReact } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';

//自定义扩展组件
const MyDoubleTreeSelect: React.FC<any> = (props) => {
    const onChange = (value: any, options: any) => {
        props.onChange([options && options.value, options && options.path]);
    };
    const value = props.value ? props.value[0] : undefined;
    return <TreeSelect {...props} onChange={onChange} value={value} />;
};

const SchemaField = createSchemaField({
    components: {
        TreeSelect: MyDoubleTreeSelect,
        FormItem,
        Label,
    },
});

const form = createForm({});

export default () => (
    <FormProvider form={form}>
        <SchemaField>
            <SchemaField.Number
                name="[selectValue,selectPath]"
                title="选择框"
                x-decorator="FormItem"
                x-component="TreeSelect"
                enum={[
                    {
                        label: '选项1',
                        value: '0-0',
                        path: 'path-0-0',
                        children: [
                            {
                                label: 'Child Node1',
                                value: '0-0-0',
                                path: 'path-0-0-0',
                            },
                            {
                                label: 'Child Node2',
                                value: '0-0-1',
                                path: 'path-0-0-1',
                            },
                            {
                                label: 'Child Node3',
                                value: '0-0-2',
                                path: 'path-0-0-2',
                            },
                        ],
                    },
                    {
                        label: '选项2',
                        value: '0-1',
                        path: 'path-0-1',
                        children: [
                            {
                                label: 'Child Node3',
                                value: '0-1-0',
                                path: 'path-0-1-0',
                            },
                            {
                                label: 'Child Node4',
                                value: '0-1-1',
                                path: 'path-0-1-0',
                            },
                            {
                                label: 'Child Node5',
                                value: '0-1-2',
                                path: 'path-0-1-2',
                            },
                        ],
                    },
                ]}
                x-component-props={{
                    style: {
                        width: 200,
                    },
                    defaultExpandAll: true,
                }}
            />
        </SchemaField>
        <FormConsumer>
            {() => <div>{JSON.stringify(form.values)}</div>}
        </FormConsumer>
    </FormProvider>
);
