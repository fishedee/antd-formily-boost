import React, { Fragment } from 'react';
import { RadioColumnProps } from './RadioColumn';
type CheckboxColumnProps = RadioColumnProps & {
    checkStrictly?: boolean;
};

const CheckboxColumn: React.FC<CheckboxColumnProps> = (props) => {
    return <Fragment></Fragment>;
};

export default CheckboxColumn;

export { CheckboxColumnProps };
