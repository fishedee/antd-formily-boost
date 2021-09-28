import React, { Fragment } from 'react';
import { KeyProps } from './KeyProps';

/*
设计目标：
* 传入双层array对象，能自动转换为行合并的表格，并且支持表格里面的Input对象自动反写到array对象对应的Field
* 支持多层array
* SplitRow的同级不能存在ChildrenRow，ExpandableRow或者RecursiveRow
* 只能由ChildrenRow或者ExpandableRow里面嵌套着SplitRow
* 支持CheckboxColumn与RadioColumn
* 不支持colSpan
为什么不用rowSpan与colSpan由外部传入，而是采用内部计算的方式
* 因为外部模型是双层array对象，需要转换一层才能传递进来
* 而表格的Input在变化以后，还需要反写位置（从单层表格的非合并行，或者合并行变化，捕捉他们的事件，或者捕捉他们的onInputChange，再反写回去原来的双层array不是一件容易的事情)
*/
type SplitRowProps = {
    splitIndex: string;
};

class SplitRowPropsKey implements KeyProps<SplitRowProps> {
    splitIndex = true;
}

const SplitRow: React.FC<SplitRowProps> = (props) => {
    return <Fragment></Fragment>;
};

export default SplitRow;

export { SplitRowProps, SplitRowPropsKey };
