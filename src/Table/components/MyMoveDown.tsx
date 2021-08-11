import { useArray, useArrayIndex } from './Context';
import React, { Fragment, MouseEvent } from 'react';
import { ArrowDownOutlined } from '@ant-design/icons';
import { getDataInIndex, parseIndex } from '../util';
import { batch } from '@formily/reactive';

export type MyMoveDownProps = {
    title?: string;
    icon?: React.ReactNode;
};
const MyMoveDown: React.FC<MyMoveDownProps> = (props) => {
    const array = useArray();
    const index = useArrayIndex();
    const onClick = (e: MouseEvent<any>) => {
        e.preventDefault();
        let [prevIndex, currentIndex] = parseIndex(index);
        let current = parseInt(currentIndex);
        const data = getDataInIndex(array.value, prevIndex);
        if (!data || current >= data.length - 1) {
            return;
        }
        batch(() => {
            let currentData = data[current];
            let nextData = data[current + 1];
            data[current] = nextData;
            data[current + 1] = currentData;
        });
    };
    let icon = props.icon ? (
        props.icon
    ) : (
        <ArrowDownOutlined style={{ fontSize: '16px' }} />
    );
    let title = props.title || '';
    return (
        <a onClick={onClick}>
            {icon} {title}
        </a>
    );
};

export default MyMoveDown;
