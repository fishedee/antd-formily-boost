import { useArrayIndex } from './Context';
import React, { Fragment } from 'react';

export type MyIndexProps = {};
const MyIndex: React.FC<MyIndexProps> = () => {
    const index = useArrayIndex();
    return <Fragment>{index + 1}</Fragment>;
};

export default MyIndex;
