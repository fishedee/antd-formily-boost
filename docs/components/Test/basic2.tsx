import {
    createForm,
    Field,
    onFieldChange,
    onFieldInputValueChange,
} from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import { Form, FormItem, Input, Select } from '@formily/antd';
import React, { useMemo } from 'react';
import { observable } from '@formily/reactive';
import 'antd/dist/antd.compact.css';

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
        Select,
    },
});
export default () => {
    const form = useMemo(() => {
        return createForm({
            values: {},
            effects: () => {
                onFieldInputValueChange('title', (field) => {
                    const field2 = field as Field;
                    console.log('title change to ', field2.value);
                    //这里故意写错，抛出了异常，但是控制台没有输出
                    field.doSomeErrorThing();
                    console.log('title change2', field2.value);
                });
            },
        });
    }, []);
    return (
        <Form form={form} feedbackLayout="terse">
            <SchemaField>
                <SchemaField.String name="title" x-component={'Input'} />
            </SchemaField>
            <FormConsumer>
                {() => <div>{JSON.stringify(form.values)}</div>}
            </FormConsumer>
        </Form>
    );
};
