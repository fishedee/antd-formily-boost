import React, { Fragment } from 'react';
import { KeyProps } from './KeyProps';
import { RadioColumnProps, RadioColumnPropsKey } from './RadioColumn';
type CheckboxColumnProps = RadioColumnProps & {
    checkStrictly?: boolean;
};

class CheckboxColumnPropsKey
    extends RadioColumnPropsKey
    implements KeyProps<CheckboxColumnProps>
{
    checkStrictly = true;
}

const CheckboxColumn: React.FC<CheckboxColumnProps> = (props) => {
    return <Fragment></Fragment>;
};

export default CheckboxColumn;

export { CheckboxColumnProps, CheckboxColumnPropsKey };
