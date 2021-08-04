import { observable } from '@formily/reactive';
import { observer } from '@formily/reactive-react';
import { Divider } from 'antd';
import React, { Children, Fragment } from 'react';

type SpaceDividerProps = {
    type?: 'vertical' | 'horizontal';
};

const SpaceDivider: React.FC<SpaceDividerProps> = observer((props) => {
    let type = props.type ? props.type : 'vertical';
    let children = props.children as any;
    let innerChildren = [];
    if (
        children &&
        children.props &&
        children.props.children &&
        children.props.children[0]
    ) {
        innerChildren = children.props.children[0];
    }
    let result = [];
    for (var i = 0; i != innerChildren.length; i++) {
        if (i != 0) {
            result.push(<Divider type={type} key={'_divider_' + i} />);
        }
        result.push(innerChildren[i]);
    }
    return <Fragment>{result}</Fragment>;
});

export default SpaceDivider;
