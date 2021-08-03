import React, { Fragment } from 'react';
type LabelProps = {
    value: string;
    prefix?: string;
    suffix?: string;
};

const Label: React.FC<LabelProps> = (props) => {
    let result = '';
    if (props.prefix) {
        result += props.prefix;
    }
    result += props.value;
    if (props.suffix) {
        result += props.suffix;
    }
    return <Fragment>{result}</Fragment>;
};

export default Label;
