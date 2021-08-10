import { useArray, useArrayIndex } from './Context';
import React, { Fragment, MouseEvent } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { getDataInIndex, parseIndex } from '../util';

export type MyRemoveProps = {
    title?: string;
    icon?: React.ReactNode;
};
const MyRemove: React.FC<MyRemoveProps> = (props) => {
    const array = useArray();
    const index = useArrayIndex();
    const onClick = (e: MouseEvent<any>) => {
        e.preventDefault();
        console.log('remove', array.value, index);
        let [prevIndex, currentIndex] = parseIndex(index);
        let current = parseInt(currentIndex);
        const data = getDataInIndex(array.value, prevIndex);

        console.log('remove After2', current, data);
        if (!data || current < 0 || current > data.length - 1) {
            return;
        }
        data.splice(current, 1);
        console.log('remove After', array.value);
    };
    let icon = props.icon ? (
        props.icon
    ) : (
        <DeleteOutlined style={{ fontSize: '16px' }} />
    );
    let title = props.title || '';
    return (
        <a onClick={onClick}>
            {icon} {title}
        </a>
    );
};

export default MyRemove;
