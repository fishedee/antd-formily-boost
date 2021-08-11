---
title: 行递归展开
order: 7
---

## 基础

<code src="./basic.tsx"></code>

在 Table 组件里面嵌套一个 Table.RecursiveRow 就能实现递归行展开了。这个功能通常用来实现树形数据的展示与编辑，注意要填写好 recursiveIndex 字段。

## 递归行的行选择

<code src="./selection.tsx"></code>

递归行中打开选择操作，依然和普通的一样，直接加入一个 CheckboxColumn 就可以了。注意，默认情况下，checkStrictly 为 false 的，子树的选中会影响父亲的选中状态。当 checkStrictly 为 true 的时候，子树的选中不影响父亲的选中状态。

## 递归行的编辑

<code src="./edit.tsx"></code>

递归行的编辑操作，也是直接加入 Table.MoveUp,Table.MoveDown 和 Table.Remove 这些操作就可以了，这些组件会自动控制行在同一层的树级别上下移动，不会跨级别上下移动的。同时，有一个额外的 Table.SubtreeAddition，专门用来处理添加下一子级数据的

<API src="../../../../src/Table/components/RecursiveRow.tsx">ExpandableRow</API>
