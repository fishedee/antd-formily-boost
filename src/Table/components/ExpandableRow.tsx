import React, { Fragment } from 'react';
import { KeyProps } from './KeyProps';
type ExpandableRowProps = {
    expandRowByClick?: boolean;
    indentSize?: number;
    fixed?: boolean | 'left' | 'right';
    width?: string;
    expandedIndex?: string;
    defaultExpand?: boolean;
};

class ExpandableRowPropsKey implements KeyProps<ExpandableRowProps> {
    defaultExpand = true;
    expandRowByClick = true;
    indentSize = true;
    fixed = true;
    width = true;
    expandedIndex = true;
}

const ExpandableRow: React.FC<ExpandableRowProps> = (props) => {
    return <Fragment></Fragment>;
};

export default ExpandableRow;

export { ExpandableRowProps, ExpandableRowPropsKey };
