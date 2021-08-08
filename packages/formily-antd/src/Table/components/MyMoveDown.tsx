import { useArray, useArrayIndex } from './Context';
import React, { Fragment } from 'react';
import { ArrowDownOutlined } from '@ant-design/icons';

export type MyMoveDownProps = {
    title?: string;
    icon?: React.ReactNode;
};
const MyMoveDown: React.FC<MyMoveDownProps> = (props) => {
    const array = useArray();
    const index = useArrayIndex();
    const onClick = () => {
        if (index >= array.value?.length - 1) {
            return;
        }
        array.moveDown(index);
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
