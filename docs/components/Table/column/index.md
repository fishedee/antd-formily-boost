---
title: 列控制
order: 2
---

## 列显示

<code src="./columnControl.tsx"></code>

Column 组件有一个 visible 属性，当设置为 false 的时候可以消失该列

## 动态控制列显示

<code src="./columnControl2.tsx"></code>

使用 Formily 的机制，我们可以用 query 来获取该列，然后动态控制是否显示该列

## 联动控制列显示

<code src="./columnReact.tsx"></code>

我们甚至可以将每行的 name 属性，来控制该列的 title 以及是否 visible 的信息，你试试在任意一行输入 disappear 的单词

## 列宽

<code src="./columnWidth.tsx"></code>

我们可以设置 column 的宽度信息来控制每列的宽度

## 列头嵌套

<code src="./columnCombine.tsx"></code>

Column 列是可以嵌套的，嵌套以后就可以实现列头嵌套的功能
