import React from 'React';
import { observer, useField } from '@formily/react';
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

const MyLink: React.FC<LinkProps> = observer((props) => {
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
