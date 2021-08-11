---
title: 分页
order: 4
---

## 不分页

<code src="./noPage.tsx"></code>

默认情况下，无论多少数据，Table 组件都不会分页的

## 前端分页

<code src="./localPage.tsx"></code>

传递一个 pagniaction 属性到 Table 组件就可以了

## 后端分页

<code src="./remotePage.tsx"></code>

pagniaction 多一个 total 属性，就是后端分页，就这么简单。注意一下 paginationProps 的属性，可以自定义一些分页的功能

## 前端分页+checkbox 行选择

<code src="./checkbox.tsx"></code>

前端分页下，checkbox 依然可用。注意一下，选择过的行，在下一页以后再返回来的时候依然存在

## 前端分页+radio 行选择

<code src="./radio.tsx"></code>

前端分页下的 radio 行选择，与 checkbox 类似
