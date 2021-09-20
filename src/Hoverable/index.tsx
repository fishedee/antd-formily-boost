type HoverablePropsType = {};

type EnterPropsType = {};

type LeavePropsType = {};

type Hoverable = React.FC<HoverablePropsType> & {
    Enter: React.FC<EnterPropsType>;
    Leave: React.FC<LeavePropsType>;
};
