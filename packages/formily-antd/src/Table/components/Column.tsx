import React, { Fragment } from 'react';
import { KeyProps } from './KeyProps';

//编译时类型信息
type ColumnProps = {
    width?: number;
    ellipsis?: boolean;
    fixed?: 'left' | 'right';
};

//运行时类型信息
class ColumnPropsKeys implements KeyProps<ColumnProps> {
    width = true;
    ellipsis = true;
    fixed = true;
}

const Column: React.FC<ColumnProps> = (props) => {
    return <Fragment></Fragment>;
};

export default Column;

export { ColumnProps, ColumnPropsKeys };
