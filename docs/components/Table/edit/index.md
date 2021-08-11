---
title: 编辑
order: 5
---

## 编辑

<code src="./edit.tsx"></code>

表格的编辑功能，在行里面嵌套有 Table.MoveUp，Table.MoveDown，Table.Remove 组件就能实现行的上移，下移，和删除功能。注意一下，添加行的操作用的是 Table.Addition 组件，放在 Table 组件第一个内层，在 Void 组件的旁边，注意位置。Table.Index 能自动显示行号。试试在年龄字段，输入非数字，也会报错的

## 自定义样式

<code src="./userDefine.tsx"></code>

Table.MoveUp，Table.MoveDown，Table.Remove，Table.Addition 这些组件都是允许自定义样式的

<API src="../../../../src/Table/components/MyIndex.tsx">Table.Index</API>

<API src="../../../../src/Table/components/MyMoveUp.tsx">Table.MoveUp</API>

<API src="../../../../src/Table/components/MyMoveDown.tsx">Table.MoveDown</API>

<API src="../../../../src/Table/components/MyRemove.tsx">Table.Remove</API>
