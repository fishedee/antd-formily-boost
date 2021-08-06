import { useArray, useArrayIndex } from './Context';
import React, { Fragment } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export type MyAdditionProps = {
    onClick?: () => {};
    title?: string;
    icon?: React.ReactNode;
};
const MyAddition: React.FC<MyAdditionProps> = (props) => {
    const array = useArray();
    const onClick = props.onClick
        ? props.onClick
        : () => {
              array.push({});
          };
    let icon = props.icon ? (
        props.icon
    ) : (
        <PlusOutlined style={{ fontSize: '12px' }} />
    );
    let title = props.title || '添加';
    return (
        <Button
            onClick={onClick}
            type="dashed"
            icon={icon}
            shape="round"
            style={{ display: 'block', width: '100%', marginTop: '10px' }}
        >
            {title}
        </Button>
    );
};

export default MyAddition;
