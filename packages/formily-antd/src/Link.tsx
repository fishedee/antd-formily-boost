import React, { Fragment } from 'React';
import { Link } from 'umi';
import { IVoidFieldProps } from '@formily/core';
import { useField } from '@formily/react';
import { observable } from '@formily/reactive';

type LinkToProps =
    | {
          pathname?: string;
          query?: object;
          state?: object;
      }
    | string;

type LinkProps = {
    to: LinkToProps;
};

const MyLink: React.FC<LinkProps> = observable((props) => {
    const field = useField();
    return <Link to={props.to}>{field.title}</Link>;
});

export default MyLink;
