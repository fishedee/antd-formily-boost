import React, { Fragment } from 'react';

import { KeyProps } from './KeyProps';

type RadioColumnProps = {
    dataIndex: string;
    fixed?: boolean;
    width?: string;
    selectRowByClick?: boolean;
    hidden?: boolean;
};

class RadioColumnPropsKey implements KeyProps<RadioColumnProps> {
    dataIndex = true;
    fixed = true;
    width = true;
    selectRowByClick = true;
    hidden = true;
}

const RadioColumn: React.FC<RadioColumnProps> = (props) => {
    return <Fragment></Fragment>;
};

export default RadioColumn;

export { RadioColumnProps, RadioColumnPropsKey };
