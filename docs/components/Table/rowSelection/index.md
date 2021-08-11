---
title: 选择行
order: 3
---

## Checkbox 行选择

<code src="./checkbox.tsx"></code>

直接加入一个 CheckboxColumn 就能实现 Checkbox 的行选择，简单直观。获取和设置某行的 checkbox 状态也简单，直接读写原始数据就可以了。

## Radio 行选择

<code src="./radio.tsx"></code>

同样地，将 CheckboxColumn 换成 RadioColumn 就能实现，Radio 行选择，注意有方便的 selectRowByClick 属性。

## 隐藏行选择

<code src="./hidden.tsx"></code>

hidden 属性可以在不显示选择列的情况，进行选择行的操作，记得包含 formily-antd/src/style.css 的文件

<API src="../../../../src/Table/components/RadioColumn.tsx">Table.RadioColumn</API>

<API src="../../../../src/Table/components/CheckboxColumn.tsx">Table.CheckboxColumn</API>
