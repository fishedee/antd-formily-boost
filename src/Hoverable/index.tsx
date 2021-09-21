import React, { createContext, useContext, useState } from 'react';

const HoverableContext = createContext(false);

type HoverablePropsType = {
    style?: React.CSSProperties;
    className?: string;
};

type EnterPropsType = {
    style?: React.CSSProperties;
    className?: string;
};

type LeavePropsType = {
    style?: React.CSSProperties;
    className?: string;
};

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

    return (
        <HoverableContext.Provider value={isEnter}>
            <div
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={props.style}
                className={props.className}
            >
                {props.children}
            </div>
        </HoverableContext.Provider>
    );
};

Hoverable.Enter = (props) => {
    const hoverableContext = useContext(HoverableContext);
    let myStyle: React.CSSProperties = {};
    if (!hoverableContext) {
        myStyle.display = 'none';
    }
    return (
        <div style={{ ...props.style, ...myStyle }} className={props.className}>
            {props.children}
        </div>
    );
};

Hoverable.Leave = (props) => {
    const hoverableContext = useContext(HoverableContext);
    let myStyle: React.CSSProperties = {};
    if (hoverableContext) {
        myStyle.display = 'none';
    }
    return (
        <div style={{ ...props.style, ...myStyle }} className={props.className}>
            {props.children}
        </div>
    );
};

export default Hoverable;
