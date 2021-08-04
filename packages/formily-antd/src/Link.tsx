import React, { Fragment } from 'React';
import { IVoidFieldProps } from '@formily/core';
import { useField } from '@formily/react';
import { observable } from '@formily/reactive';
import { useHistory } from 'umi';

type LinkToProps =
    | {
          pathname?: string;
          query?: object;
          state?: object;
      }
    | string;

type LinkProps = {
    to: LinkToProps;
    onClick?: () => void;
};

const MyLink: React.FC<LinkProps> = observable((props) => {
    const history = useHistory();
    const field = useField();
    let onClick = props.onClick
        ? props.onClick
        : () => {
              history.push(props.to);
          };
    return <a onClick={onClick}>{field.title}</a>;
});

export default MyLink;
