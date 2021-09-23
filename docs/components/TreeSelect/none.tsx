import React from 'react';
import { TreeSelect, Label } from 'antd-formily-boost';
import { FormItem, FormButtonGroup, Submit } from '@formily/antd';
import {
    createForm,
    Field,
    onFieldInputValueChange,
    onFieldReact,
} from '@formily/core';
import { FormProvider, createSchemaField, FormConsumer } from '@formily/react';

const SchemaField = createSchemaField({
    components: {
        TreeSelect,
        FormItem,
        Label,
    },
});

const form = createForm({});

export default () => (
    <FormProvider form={form}>
        <SchemaField>
            <SchemaField.Number
                name="select"
                title="选择框"
                x-decorator="FormItem"
                x-component="TreeSelect"
                enum={undefined}
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
