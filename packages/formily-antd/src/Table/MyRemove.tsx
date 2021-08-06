import { useArray, useArrayIndex } from './Context';
import React, { Fragment } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

export type MyRemoveProps = {
    title?: string;
    icon?: React.ReactNode;
};
const MyRemove: React.FC<MyRemoveProps> = (props) => {
    const array = useArray();
    const index = useArrayIndex();
    const onClick = () => {
        array.remove(index);
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
