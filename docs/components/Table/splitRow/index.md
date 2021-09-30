---
title: 行分裂
order: 9
---

## 区别

行分裂，就像行合并一样的样式，只是传入的格式是类似父子展开的格式，而不是二维数组格式。

## 基础

<code src="./basic.tsx"></code>

在 Table 组件中嵌套一个 SplitRow 就可以了，跟 ChildrenRow 类似，不过不同的是，ChildrenRow 是每一行都复用同一个列。而 SplitRow 是不复用列的，需要现在顶部声明列，然后在 SplitRow 中用 refColumn 来指向列

## 多层嵌套

<code src="./edit.tsx"></code>

支持嵌套多层的 SplitRow，并任意安排列位置

## 父子行，嵌套行分裂

<code src="./children.tsx"></code>

支持行父子展开，嵌套行分裂

## 行递归，嵌套行分裂

<code src="./expandable.tsx"></code>

支持行父子展开，嵌套行分裂

## 不支持

暂时不支持虚拟滚动
