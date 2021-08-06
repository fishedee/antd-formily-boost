import { useArray, useArrayIndex } from './Context';
import React, { Fragment } from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';

export type MyMoveUpProps = {
    title?: string;
    icon?: React.ReactNode;
};
const MyMoveUp: React.FC<MyMoveUpProps> = (props) => {
    const array = useArray();
    const index = useArrayIndex();
    const onClick = () => {
        if (index == 0) {
            return;
        }
        array.moveUp(index);
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
