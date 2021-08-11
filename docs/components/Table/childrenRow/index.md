---
title: 行父子展开
order: 8
---

## 区别

行父子展开，与行递归展开是相似，但是不同的。

-   行递归结构，每层都是相同的。行父子的数据结构，每层都是不同的。
-   行递归结构，层与层之间的渲染用的组件都是一样的。行父子结构，层与层之间的渲染用的组件是可以不同的。

行父子的数据结构，更像是行展开结构中的表格嵌套表格。但是，与表格嵌套表格不同的是，行父子结构的都是共同一个列，不会在嵌套表格重新定义列的。另外，站在性能角度上，表格嵌套表格的结构是难以被虚拟化列表优化的，但是行父子结构则可以被虚拟化列表优化。

## 基础

<code src="./basic.tsx"></code>

在 Table 组件里面嵌套一个 Table.ChildrenRow 就能实现父子行展开了。这个功能需要配置有：

-   ChildrenIndex，嵌套层的数据索引是什么。
-   refColumnName，指向表格的是哪个顶层列。顶层列首先需要用 name 属性来命名自身，然后在 ChildrenRow 的 Column 来指向它。如果存在某个顶层列，ChildrenRow 中没有一个指向它的，那么 Table 组件在 ChildrenRow 渲染的时候忽略这个列。就如 ChildrenRow 中没有一个指向 salesOrderId 列的，那么 ChildrenRow 就会在渲染的时候忽略它。

<API src="../../../../src/Table/components/ChildrenRow.tsx">ChildrenRow</API>
