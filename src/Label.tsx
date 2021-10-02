import { useField } from '@formily/react';
import { observer } from '@formily/reactive-react';
import React, { Fragment } from 'react';
type LabelProps = {
    value: string;
    prefix?: string;
    suffix?: string;
};

const Label: React.FC<LabelProps> = observer((props) => {
    let result = '';
    if (props.prefix) {
        result += props.prefix;
    }
    let value = props.value;
    if (value == undefined) {
        value = '';
    }
    result += value;
    if (props.suffix) {
        result += props.suffix;
    }
    return <Fragment>{result}</Fragment>;
});

export default Label;
