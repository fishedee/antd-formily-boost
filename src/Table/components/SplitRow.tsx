import React, { Fragment } from 'react';
import { KeyProps } from './KeyProps';
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
