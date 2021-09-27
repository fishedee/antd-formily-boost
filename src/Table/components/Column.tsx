import React, { Fragment } from 'react';
import { KeyProps } from './KeyProps';

//编译时类型信息
type ColumnProps = {
    width?: number;
    ellipsis?: boolean;
    fixed?: 'left' | 'right';
    labelIndex?: string;
    refColumnName?: string;
    rowSpan?: (row: any) => number;
    colSpan?: (row: any) => number;
};

//运行时类型信息
class ColumnPropsKeys implements KeyProps<ColumnProps> {
    rowSpan = true;
    colSpan = true;
    refColumnName = true;
    width = true;
    ellipsis = true;
    fixed = true;
    labelIndex = true;
}

const Column: React.FC<ColumnProps> = (props) => {
    return <Fragment></Fragment>;
};

export default Column;

export { ColumnProps, ColumnPropsKeys };
