import { Field } from '@formily/core';
import { useField } from '@formily/react';
import { observer } from '@formily/reactive-react';
import { Tree } from 'antd';
import { Key } from 'antd/lib/table/interface';
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
    style?: object;
    value?: any;
    onChange?: (data: any) => void;
};

type DataSourceType = {
    key: string;
    title: string;
    children: DataSourceType[];
};

function getDataSourceRecursive(
    data: any[],
    recursiveIndex: string,
): DataSourceType[] {
    let result: DataSourceType[] = [];
    for (var i = 0; i != data.length; i++) {
        var single: DataSourceType = {
            key: data[i].value,
            children: [],
            title: data[i].label,
        };
        let children = data[i][recursiveIndex];
        if (children && children.length != 0) {
            single.children = getDataSourceRecursive(children, recursiveIndex);
        }
        result.push(single);
    }
    return result;
}

const TreeSelect: React.FC<TreeSelectProps> = observer((props) => {
    const field = useField() as Field;
    const dataSource = field.dataSource;
    const treeData = getDataSourceRecursive(dataSource, 'children');
    const value = props.value;

    let selectKeys: string[] = [];
    let onSelect: (selectedKeys: Key[]) => void = () => {};

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
            props.onChange!(selectedKeys);
        };
    } else {
        if (value === undefined || value === null) {
            selectKeys = [];
        } else {
            selectKeys = [value];
        }
        onSelect = (selectedKeys) => {
            if (selectedKeys.length == 0) {
                props.onChange!(undefined);
            } else {
                props.onChange!(selectedKeys[0]);
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
