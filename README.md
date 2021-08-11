# formily-antd

## 特点

在 Ant Design Table 组件的基础，包装为一个高性能，易组合，超低开发成本的表格组件，让 CURD 操作变得简单

## 问题

在使用 Ant Design Table 组件的过程中，我发现以下问题：

-   表格嵌套表格，行选择，自定义 render 组件，分页等操作缺少直观的代码。排错麻烦，容易产生 bug。
-   难以支持复杂的表格编辑操作，表格添加行，上移，下移，删除等操作。要实现的代码很多，而且代码重复。
-   性能不高，即使修改单行数据，也会触发整个表格的重新 render。

而且，Antd Design Table 缺少开箱即用的虚拟滚动实现，并且限制还有：

-   不支持 column 的 render，fixed，仅支持 column 的 width
-   不支持 rowSelection
-   不支持 edit
-   不支持 tree 数据
-   不透明开关，打开虚拟列表和，不打开虚拟列表，代码差异很大，会波及其他代码都要改

## 解决

```tsx
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
        <Form form={form} feedbackLayout="terse">
            <SchemaField>
                <SchemaField.Array
                    name="data"
                    x-component="Table"
                    x-component-props={{
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
                                fixed: 'left',
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
        </Form>
    );
};
```

Formily-Antd 从[Formily](https://v2.formilyjs.org/)的先进的 Reactive 与 Schema 设计出发，大幅简化对 Table 组件的实现。它的特点是：

-   Schema 与 Data 分离，我们能看到代码中仅仅在 Form 的顶头处传送了一次 data 以外，其他地方就没有写过关于 data 的代码。Formily 会通过 Schema 结构自动抽取正确的 Data 位置，并对这些位置的数据进行读写操作。
-   可读性好，以上的代码同时实现了行选择，与分页功能。开发者需要的心智更少，只需要关注 Schema 的结构是如何在 XML 中表达就可以了，
-   性能更好，Formily 机制尽可能少地触发整个 Table 的 render 操作
-   动态性更好，基于 Formily 的实现，我们可以轻松实现任意列的动态控制显示与隐藏，同一行中不同列数据的联动，甚至直接从后端或者可视化编辑器中生成以上代码都可以。

最后 Formily-Antd 的目前版本中，有开箱即用的虚拟滚动实现，让开发者无痛使用一键使用表格虚拟滚动的功能，包括有：

-   支持 column 的 width，fixed，以及自定义嵌套组件
-   支持 rowSelection，checkbox 在树形数据下依然有点问题，在其他情况下运行正常
-   支持 edit
-   支持 RecursiveRow 或 ChildrenRow 这种树形数据，但依然不支持 ExpandableRow 的任意 expand 的树形数据
-   透明开关，打开虚拟列表和，不打开虚拟列表，仅仅是一个属性设置而已，其他代码不用改

## 文档

DEMO 与 API 文档在[这里](https://fishedee.github.io/formily-antd/)

## 使用

```bash
$ npm install formily-antd --save
```

直接包含以上包即可

## 编译

```bash
$ npm i
```

安装依赖

```bash
$ npm start
```

启动服务器

```bash
$ npm run docs:build
```

生成文档

```bash
$ npm run build
```

编译代码
