import React, { Fragment } from 'react';
import { KeyProps } from './KeyProps';
type ExpandableRowProps = {
    expandRowByClick?: boolean;
};

class ExpandableRowPropsKey implements KeyProps<ExpandableRowProps> {
    expandRowByClick = true;
}

const ExpandableRow: React.FC<ExpandableRowProps> = (props) => {
    return <Fragment></Fragment>;
};

export default ExpandableRow;

export { ExpandableRowProps, ExpandableRowPropsKey };
