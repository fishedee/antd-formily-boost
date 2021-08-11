---
title: 行展开
order: 6
---

## 基础

<code src="./basic.tsx"></code>

在 Table 组件里面嵌套一个 Table.ExpandableRow 就能实现行展开了，相当方便。在 ExpandableRow 可以任意嵌套我们需要展示的数据

## 表格

<code src="./table.tsx"></code>

我们甚至可以在 Table.ExpandableRow 嵌套另外一个表格，这样就能实现嵌套表格展开。同样地，我们在 ExpandableRow 中实现了 expandRowByClick 与 defaultExpand 的属性

<API src="../../../../src/Table/components/ExpandableRow.tsx">ExpandableRow</API>
