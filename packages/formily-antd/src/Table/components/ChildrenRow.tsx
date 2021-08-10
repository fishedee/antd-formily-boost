import React, { Fragment } from 'react';
import { ExpandableRowProps, ExpandableRowPropsKey } from './ExpandableRow';
import { KeyProps } from './KeyProps';
type ChildrenRowProps = ExpandableRowProps & {
    childrenIndex: string;
};

class ChildrenRowPropsKey
    extends ExpandableRowPropsKey
    implements KeyProps<ChildrenRowProps>
{
    childrenIndex = true;
}

const ChildrenRow: React.FC<ChildrenRowProps> = (props) => {
    return <Fragment></Fragment>;
};

export default ChildrenRow;

export { ChildrenRowProps, ChildrenRowPropsKey };
