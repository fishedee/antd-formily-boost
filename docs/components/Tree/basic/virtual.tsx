import { createForm } from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import { Label, Tree } from 'antd-formily-boost';
import { Form, FormItem, Input, Select } from '@formily/antd';
import React, { useMemo } from 'react';
import { observable } from '@formily/reactive';
import 'antd/dist/antd.compact.css';

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
        Select,
        Tree,
        Label,
    },
});

function dig(path = '0', level = 3) {
    const list = [];
    for (let i = 0; i < 10; i += 1) {
        const key = `${path}-${i}`;
        const treeNode: any = {
            title: key,
        };

        if (level > 0) {
            treeNode.children = dig(key, level - 1);
        }

        list.push(treeNode);
    }
    return list;
}

let lastState = observable({
    data: dig(),
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
                <SchemaField.Array
                    name="data"
                    x-component="Tree"
                    x-component-props={{
                        scroll: {
                            y: 100,
                        },
                        virtualScroll: {},
                    }}
                >
                    <SchemaField.Object>
                        <SchemaField.String
                            name="title"
                            x-component={'Label'}
                        />
                    </SchemaField.Object>
                </SchemaField.Array>
            </SchemaField>
        </Form>
    );
};
