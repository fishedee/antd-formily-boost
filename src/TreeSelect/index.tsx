import { Field } from '@formily/core';
import { useField } from '@formily/react';
import { observer } from '@formily/reactive-react';
import { Tree } from 'antd';
import { Key, EventDataNode, DataNode } from 'rc-tree/lib/interface';
import React from 'react';
import { TreeProps } from 'antd/lib/tree';

type TreeSelectProps = {
    directoryStyle?: boolean;
    height?: number;
    blockNode?: boolean;
    showLine?: boolean | { showLeafIcon: boolean };
    multiple?: boolean;
    defaultExpandAll?: boolean;
    defaultExpandParent?: boolean;
    style?: React.CSSProperties;
    className?: string;
    value?: any;
    onChange?: (data: any, nodes: any) => void;
};

type DataSourceType = {
    key: string;
    title: string;
    children: DataSourceType[];
};

function getDataSourceRecursive(
    data: any[],
    recursiveIndex: string,
    sourceMap: Map<any, any>,
): DataSourceType[] {
    let result: DataSourceType[] = [];
    if (data === undefined || data instanceof Array == false) {
        return result;
    }
    for (var i = 0; i != data.length; i++) {
        var single: DataSourceType = {
            key: data[i].value,
            children: [],
            title: data[i].label,
        };
        sourceMap.set(data[i].value, data[i]);
        let children = data[i][recursiveIndex];
        if (children && children instanceof Array && children.length != 0) {
            single.children = getDataSourceRecursive(
                children,
                recursiveIndex,
                sourceMap,
            );
        }
        result.push(single);
    }
    return result;
}

const TreeSelect: React.FC<TreeSelectProps> = observer((props) => {
    const field = useField() as Field;
    const dataSource = field.dataSource;
    const sourceMap = new Map<any, any>();
    const treeData = getDataSourceRecursive(dataSource, 'children', sourceMap);
    const value = props.value;

    let selectKeys: string[] = [];
    let onSelect: (
        selectedKeys: Key[],
        info: {
            event: 'select';
            selected: boolean;
            node: EventDataNode;
            selectedNodes: DataNode[];
            nativeEvent: MouseEvent;
        },
    ) => void = () => {};

    if (props.multiple) {
        if (
            value === undefined ||
            value === null ||
            value instanceof Array == false
        ) {
            selectKeys = [];
        } else {
            selectKeys = value;
        }
        onSelect = (selectedKeys) => {
            const nodes = selectedKeys.map((single) => {
                return sourceMap.get(single);
            });
            props.onChange!(selectedKeys, nodes);
        };
    } else {
        if (value === undefined || value === null) {
            selectKeys = [];
        } else {
            selectKeys = [value];
        }
        onSelect = (selectedKeys) => {
            if (selectedKeys.length == 0) {
                props.onChange!(undefined, undefined);
            } else {
                props.onChange!(
                    selectedKeys[0],
                    sourceMap.get(selectedKeys[0]),
                );
            }
        };
    }
    let MyTree: React.FC<TreeProps>;
    if (props.directoryStyle) {
        MyTree = Tree.DirectoryTree;
    } else {
        MyTree = Tree;
    }
    return (
        <MyTree
            style={props.style}
            className={props.className}
            treeData={treeData}
            height={props.height}
            blockNode={props.blockNode}
            multiple={props.multiple}
            showLine={props.showLine}
            selectedKeys={selectKeys}
            defaultExpandAll={props.defaultExpandAll}
            defaultExpandParent={props.defaultExpandParent}
            onSelect={onSelect}
        />
    );
});
export default TreeSelect;

//这段代码仅仅为为了生成API文档的
const MyTreeSelectFocDoc: React.FC<TreeSelectProps> = () => {
    return <span />;
};

export { MyTreeSelectFocDoc };
