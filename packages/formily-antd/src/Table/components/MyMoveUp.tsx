import { useArray, useArrayIndex } from './Context';
import React, { Fragment } from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';
import { getDataInIndex, parseIndex } from '../util';
import { batch } from '@formily/reactive';

export type MyMoveUpProps = {
    title?: string;
    icon?: React.ReactNode;
};
const MyMoveUp: React.FC<MyMoveUpProps> = (props) => {
    const array = useArray();
    const index = useArrayIndex();
    const onClick = () => {
        let [prevIndex, currentIndex] = parseIndex(index);
        let current = parseInt(currentIndex);
        const data = getDataInIndex(array.value, prevIndex);
        if (!data || current == 0) {
            return;
        }
        batch(() => {
            let currentData = data[current];
            let prevData = data[current - 1];
            data[current] = prevData;
            data[current - 1] = currentData;
        });
    };
    let icon = props.icon ? (
        props.icon
    ) : (
        <ArrowUpOutlined style={{ fontSize: '16px' }} />
    );
    let title = props.title || '';
    return (
        <a onClick={onClick}>
            {icon} {title}
        </a>
    );
};

export default MyMoveUp;
