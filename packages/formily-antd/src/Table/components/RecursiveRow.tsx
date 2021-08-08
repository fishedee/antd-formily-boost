import React, { Fragment } from 'react';
import { KeyProps } from './KeyProps';
type RecursiveRowProps = {
    dataIndex: string;
};

class RecursiveRowPropsKey implements KeyProps<RecursiveRowProps> {
    dataIndex = true;
}

const RecursiveRow: React.FC<RecursiveRowProps> = (props) => {
    return <Fragment></Fragment>;
};

export default RecursiveRow;

export { RecursiveRowProps, RecursiveRowPropsKey };
