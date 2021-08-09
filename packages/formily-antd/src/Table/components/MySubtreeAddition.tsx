import { useArray, useArrayIndex, useArrayRecursive } from './Context';
import React, { Fragment, MouseEvent } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { getDataInIndex, parseIndex } from '../util';

export type MySubtreeAdditionProps = {
    onClick?: () => {};
    title?: string;
    icon?: React.ReactNode;
};
const MySubtreeAddition: React.FC<MySubtreeAdditionProps> = (props) => {
    const array = useArray();
    const index = useArrayIndex();
    const recurIndex = useArrayRecursive();

    const onClick = props.onClick
        ? props.onClick
        : (e: MouseEvent<any>) => {
              e.preventDefault();
              if (!recurIndex) {
                  return;
              }
              const data = getDataInIndex(array.value, index);
              if (!data) {
                  return;
              }
              if (!data.hasOwnProperty(recurIndex)) {
                  data[recurIndex] = [];
              }
              data[recurIndex].push({});
          };
    let icon = props.icon ? (
        props.icon
    ) : (
        <PlusCircleOutlined style={{ fontSize: '16px' }} />
    );
    let title = props.title;
    return (
        <a onClick={onClick}>
            {icon} {title}
        </a>
    );
};

export default MySubtreeAddition;
