import React from 'react';
import { observer, useField } from '@formily/react';

type LinkProps = {
    to: string;
    onClick?: () => void;
};

const MyLink: React.FC<LinkProps> = observer((props) => {
    const field = useField();
    let onClick = props.onClick
        ? props.onClick
        : () => {
              window.location.href = props.to;
          };
    return <a onClick={onClick}>{field.title}</a>;
});

export default MyLink;
