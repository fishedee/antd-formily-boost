---
title: 虚拟列表
order: 9
---

## 特性

虚拟列表是原来的 Ant Design 4 没有原生支持的特性，它仅仅提供了一个由[react-window](https://react-window.vercel.app/#/examples/list/fixed-size)支持实现的 Ant Design Table 组件的 Demo，但是该 Demo 的受限很多，包括有：

-   不支持 column 的 render，fixed，仅支持 column 的 width
-   不支持 rowSelection
-   不支持 edit
-   不支持 tree 数据
-   不透明开关，打开虚拟列表和，不打开虚拟列表，代码差异很大，会波及其他代码都要改

在目前实现的 antd-formily-boost 版本中，它的特点为：

-   支持 column 的 width，fixed，以及自定义嵌套组件
-   支持 rowSelection，checkbox 在树形数据下依然有点问题，在其他情况下运行正常
-   支持 edit
-   支持 RecursiveRow 或 ChildrenRow 这种树形数据，但依然不支持 ExpandableRow 的任意 expand 的树形数据
-   透明开关，打开虚拟列表和，不打开虚拟列表，仅仅是一个属性设置而已，其他代码不用改

为此，antd-formily-boost 的实现代价为，体验会稍差，滚动过程中有少许白屏，但至少流畅滚动，在 10 万数据下依然可用。代码仍有优化的余地，详情看一下 Table/member 下的 Virtual.tsx 文件，欢迎提出更多的优化建议

## 没有虚拟滚动

<code src="./noVirtual.tsx"></code>

默认情况下不打开虚拟滚动，滚动列表只需要设置 scroll 属性就可以了。在 500 条数据的情况下，左右滑动滚动条已经出现掉帧的现象了

## 打开虚拟滚动

<code src="./virtual.tsx"></code>

传入 virtualScroll 属性就可以了，itemHeight 属性可以是个数字，也可以是指名哪种形式的表格。以上这个例子，数据量是 10 万行，少许白屏，同时上下滑动，左右滑动依然流畅。column 的 fixed 特性依然保留。

## 小表格的虚拟滚动

<code src="./smallVirtual.tsx"></code>

在 Table 组件中指定 size 为 small，同时 virtualScroll 的 itemHeight 也设置为 small，那么就能完整设置一个小型号表格的虚拟滚动了。数据量依然是 10 万行

## 递归行的虚拟滚动

<code src="./recursive.tsx"></code>

递归行的虚拟滚动，也是设置一样的属性，毫无区别。数据量依然是 10 万行，5 层深度，每层为 100 行数据。注意不同的行展开的时候，滚动条的变化。

## 父子行的虚拟滚动

<code src="./children.tsx"></code>

父子行的虚拟滚动，也是设置一样的属性，毫无区别。数据量依然是 10 万行，3 层深度，首层 10 行数据，其它层 100 行数据。

## 虚拟滚动的行选择

<code src="./selection.tsx"></code>

虚拟滚动的行选择能力，目前仅支持到 1 万行数据，数据更大的话，会在 RowSelection 这个处理上出现瓶颈。

## 虚拟滚动的自定义嵌套组件

<code src="./userInput.tsx"></code>

虚拟滚动下依然能使用自定义嵌套的组件，10 万数据量下依然不卡
