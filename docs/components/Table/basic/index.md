---
title: 基础
order: 0
nav:
    title: 组件
    order: 1
group:
    title: Table组件
    order: 0
---

## 基础使用

<code src="./basic.tsx"></code>

用 observable 创建一个数据，然后传递给 createForm 创建表单。最终，用表单，写一连串的 xml 代码就可以了。注意 Table 组件下面嵌套了一个 Void 的组件，不能省略的这个。

## 使用 labelIndex

<code src="./labelIndex.tsx"></code>

因为 Table 组件经常就是直接展示数据，我们可以在 Column 里面直接指定 labelIndex，就会展示对应索引下的数据了，不需要再嵌套一个 Label 组件，这样的性能要好一点，但是没有了 Formily 的 effect 功能

## 组合自己的 UI 组件

<code src="./userInput.tsx"></code>

我们可以组合使用自己的 UI 组件，定义一个 MyInput 组件，然后替换掉 createSchemaField 的 Input 就可以了。注意，虽然是用自己的 Input 组件，但是当清空了输入数据以后，依然会有错误显示的 FeedBack，这是 FormItem 带来的效果

<API src="../../../../src/Table/index.tsx" exports='["MyTableTypeForDoc"]'>Table</API>
