import React, { Fragment } from 'react';
import { ExpandableRowProps, ExpandableRowPropsKey } from './ExpandableRow';
import { KeyProps } from './KeyProps';
type RecursiveRowProps = ExpandableRowProps & {
    recursiveIndex: string;
};

class RecursiveRowPropsKey
    extends ExpandableRowPropsKey
    implements KeyProps<RecursiveRowProps>
{
    recursiveIndex = true;
}

const RecursiveRow: React.FC<RecursiveRowProps> = (props) => {
    return <Fragment></Fragment>;
};

export default RecursiveRow;

export { RecursiveRowProps, RecursiveRowPropsKey };
