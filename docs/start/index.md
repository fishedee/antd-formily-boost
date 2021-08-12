---
title: 快速开始
order: 0
nav:
    title: 快速开始
    order: 1
---

## 安装

```bash
mkdir my-app&cd my-app
npm create @umijs/umi-app
npm install
npm install @formily/antd --save
npm install antd-formily-boost --save
```

安装 umi，formily，以及 antd-formily-boost 依赖

```
npm start
```

启动开发服务器

## Hello World

```
.
├── README.md
├── mock
├── package-lock.json
├── package.json
├── src
│   └── pages
│       ├── index.less
│       └── index.tsx
├── tsconfig.json
└── typings.d.ts

3 directories, 7 files
```

这是目录结构，我们打开 src/pages/index.tsx 文件

```tsx | pure
import { createForm, onFieldReact } from '@formily/core';
import { createSchemaField, FormConsumer, Schema } from '@formily/react';
import { Label, Table, Link, SpaceDivider } from 'antd-formily-boost';
import { Form, FormItem, Input, Select, Space } from '@formily/antd';
import React, { useMemo } from 'react';
import { observable } from '@formily/reactive';
import { PaginationType } from 'antd-formily-boost/Table';
import 'antd/dist/antd.compact.css';

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
let lastState: { data: DataType[]; pagniaction: PaginationType } = observable({
    data: [],
    pagniaction: {
        current: 0,
        pageSize: 10,
    },
});

for (var i = 0; i != 100; i++) {
    lastState.data.push({
        name: 'fish_' + i,
        age: i,
    });
}

export default () => {
    const form = useMemo(() => {
        return createForm({
            values: lastState,
        });
    }, []);
    return (
        <Space
            direction="vertical"
            style={{ padding: '50px', background: 'grep', display: 'flex' }}
        >
            <Form form={form} feedbackLayout="terse">
                <SchemaField>
                    <SchemaField.Array
                        name="data"
                        x-component="Table"
                        x-component-props={{
                            bordered: true,
                            paginaction: lastState.pagniaction,
                            paginationProps: {
                                defaultPageSize: 10,
                                showQuickJumper: true,
                                showTotal: true,
                            },
                        }}
                    >
                        <SchemaField.Void>
                            <SchemaField.Void
                                x-component="Table.RadioColumn"
                                x-component-props={{
                                    dataIndex: '_checked',
                                    selectRowByClick: true,
                                }}
                            />
                            <SchemaField.Void
                                title="名字"
                                x-component="Table.Column"
                                x-component-props={{
                                    width: '30%',
                                }}
                            >
                                <SchemaField.String
                                    name="name"
                                    x-component={'Label'}
                                />
                            </SchemaField.Void>

                            <SchemaField.Void
                                title="年龄"
                                x-component="Table.Column"
                                x-component-props={{
                                    width: '70%',
                                }}
                            >
                                <SchemaField.String
                                    name="age"
                                    x-component={'Label'}
                                />
                            </SchemaField.Void>
                        </SchemaField.Void>
                    </SchemaField.Array>
                </SchemaField>
                <FormConsumer>
                    {(form) => {
                        return <span>{JSON.stringify(form.values)}</span>;
                    }}
                </FormConsumer>
            </Form>
        </Space>
    );
};
```

填写以上代码即可

![](./2021-08-12-14-40-29.png)

毫无以外的话，我们能看到第一个表格了

## 文档

在使用过程中，我们可能会遇到关于 Formily 的问题，我们建议可以看这里

-   [Formily 官网](https://v2.formilyjs.org/zh-CN/guide)
-   [Formily 经验汇总](https://blog.fishedee.com/2021/07/13/Formily%E7%9A%84Reactive%E7%9A%84%E7%BB%8F%E9%AA%8C%E6%B1%87%E6%80%BB/)
