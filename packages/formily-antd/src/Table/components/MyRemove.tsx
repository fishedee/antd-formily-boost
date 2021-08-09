import { useArray, useArrayIndex } from './Context';
import React, { Fragment } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { getDataInIndex, parseIndex } from '../util';

export type MyRemoveProps = {
    title?: string;
    icon?: React.ReactNode;
};
const MyRemove: React.FC<MyRemoveProps> = (props) => {
    const array = useArray();
    const index = useArrayIndex();
    const onClick = () => {
        let [prevIndex, currentIndex] = parseIndex(index);
        let current = parseInt(currentIndex);
        const data = getDataInIndex(array.value, prevIndex);
        if (!data || current < 0 || current > data.length - 1) {
            return;
        }
        data.splice(current, 1);
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
