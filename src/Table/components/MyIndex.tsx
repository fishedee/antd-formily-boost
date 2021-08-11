import { useArrayIndex } from './Context';
import React, { Fragment } from 'react';

export type MyIndexProps = {};
const MyIndex: React.FC<MyIndexProps> = () => {
    const indexStr = useArrayIndex();
    const indexArray = indexStr.split('.');
    let result = '';
    for (let i = 0; i != indexArray.length; i++) {
        if (i % 2 != 0) {
            continue;
        }
        const index = parseInt(indexArray[i]);
        if (result != '') {
            result += '-';
        }
        result += index + 1;
    }
    return <Fragment>{result}</Fragment>;
};

export default MyIndex;
