import React, { createContext, useContext, useState } from 'react';

const HoverableContext = createContext(false);

type HoverablePropsType = {
    style: object;
    className: string;
};

type EnterPropsType = {};

type LeavePropsType = {};

type HoverableType = React.FC<HoverablePropsType> & {
    Enter: React.FC<EnterPropsType>;
    Leave: React.FC<LeavePropsType>;
};

const Hoverable: HoverableType = (props) => {
    const [isEnter, setIsEnter] = useState(false);

    const onMouseEnter = () => {
        setIsEnter(true);
    };

    const onMouseLeave = () => {
        setIsEnter(false);
    };

    const { children, ...resetProps } = props;
    return (
        <HoverableContext.Provider value={isEnter}>
            <div
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                {...resetProps}
            >
                {children}
            </div>
        </HoverableContext.Provider>
    );
};

Hoverable.Enter = (props) => {
    const hoverableContext = useContext(HoverableContext);
    if (hoverableContext) {
        return <>{props.children}</>;
    } else {
        return <></>;
    }
};

Hoverable.Leave = (props) => {
    const hoverableContext = useContext(HoverableContext);
    if (!hoverableContext) {
        return <>{props.children}</>;
    } else {
        return <></>;
    }
};

export default Hoverable;
