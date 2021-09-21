import { ArrayField, Field, Form } from '@formily/core';
import {
    useField,
    RecursionField,
    useFieldSchema,
    Schema,
    useForm,
} from '@formily/react';
import { observer } from '@formily/reactive-react';
import { Tree } from 'antd';
import { Key } from 'antd/lib/table/interface';
import { DataNode } from 'rc-tree/lib/interface';
import React from 'react';
import { flatDataInIndex, fillDataInIndex } from '../Table/util';
import { TreeProps } from 'antd/lib/tree';

type VirtualScrollProps = {
    itemHeight?: number;
};

type ScrollProps = {
    y: number;
};

type CheckboxProps = {
    selectedIndex?: string;
    checkStrictly?: boolean;
};

type SelectProps = {
    selectedIndex?: string;
    multiple?: boolean;
};

type ExpandProps = {
    defaultExpand?: boolean;
    expandIndex?: string;
    autoExpandParent?: boolean;
};

type PropsType = {
    style?: React.CSSProperties;
    className?: string;
    recursiveIndex?: string;
    directoryStyle?: boolean;
    scroll?: ScrollProps;
    virtualScroll?: VirtualScrollProps;
    blockNode?: boolean;
    disabled?: boolean;
    showLine?: boolean | { showLeafIcon: boolean };
    select?: SelectProps;
    checkbox?: CheckboxProps;
    expand?: ExpandProps;
    labelIndex?: string;
};

type MyTreeType = React.FC<PropsType>;

type DataSourceType = {
    key: string;
    title: string;
    currentLevel: number;
    children: DataSourceType[];
};

function getDataSourceRecursive(
    form: Form,
    basePath: string,
    lableIndex: string,
    preIndex: string,
    currentLevel: number,
    data: any[],
    recursiveIndex: string,
): DataSourceType[] {
    let result: DataSourceType[] = [];
    if (data === undefined || data instanceof Array == false) {
        return result;
    }
    for (var i = 0; i != data.length; i++) {
        var single: DataSourceType = {
            key: preIndex != '' ? preIndex + '.' + i : i + '',
            currentLevel: currentLevel,
            title: lableIndex != '' ? data[i][lableIndex] : '',
            children: [],
        };
        let children = data[i][recursiveIndex];
        if (children && children instanceof Array && children.length != 0) {
            form.createArrayField({
                name: single.key + '.' + recursiveIndex,
                basePath: basePath,
            });
            single.children = getDataSourceRecursive(
                form,
                basePath,
                lableIndex,
                single.key + '.' + recursiveIndex,
                currentLevel + 1,
                children,
                recursiveIndex,
            );
        }
        result.push(single);
    }
    return result;
}

type VirtualConfig = {
    height?: number;
    itemHeight?: number;
    virtual?: boolean;
};

function getVirtualConfig(props: PropsType): VirtualConfig {
    let result: VirtualConfig = {};
    if (props.scroll && props.scroll.y) {
        result.height = props.scroll.y;
    }
    result.virtual = true;
    if (props.virtualScroll?.itemHeight) {
        result.itemHeight = props.virtualScroll?.itemHeight;
    }
    return result;
}

type SelectAndCheckboxAndExpandConfig = {
    checkable?: boolean;
    checkedKeys?: string[];
    onCheck?: (
        checkedKeys: Key[] | { checked: Key[]; halfChecked: Key[] },
    ) => void;
    checkStrictly?: boolean;
    selectable?: boolean;
    multiple?: boolean;
    selectedKeys?: string[];
    onSelect?: (selectedKeys: Key[]) => void;
    autoExpandParent?: boolean;
    expandedKeys?: string[];
    onExpand?: (expandedKeys: Key[]) => void;
};

function getSelectAndCheckboxAndExpandConfig(
    props: PropsType,
    value: any[],
    recursiveIndex: string,
): SelectAndCheckboxAndExpandConfig {
    let result: SelectAndCheckboxAndExpandConfig = {};

    //提取checkbox属性
    if (props.checkbox) {
        result.checkable = true;
        result.checkStrictly = props.checkbox.checkStrictly;

        let checkboxIndex: string = props.checkbox.selectedIndex || '_checkbox';

        result.checkedKeys = flatDataInIndex(
            value,
            checkboxIndex,
            '',
            0,
            false,
            {
                type: 'recursive',
                recursiveIndex: recursiveIndex,
                childrenIndex: [],
            },
            false,
        );
        result.onCheck = (
            checkedKeys: Key[] | { checked: Key[]; halfChecked: Key[] },
        ) => {
            let newSelectedKeys: string[] = [];
            if (checkedKeys instanceof Array) {
                newSelectedKeys = checkedKeys as string[];
            } else {
                newSelectedKeys = checkedKeys.checked as string[];
            }
            fillDataInIndex(
                value,
                checkboxIndex,
                result.checkedKeys as string[],
                newSelectedKeys,
            );
        };
    }

    //提取selected属性
    if (props.select) {
        result.selectable = true;
        result.multiple = props.select.multiple;
        let selectedIndex: string = props.select.selectedIndex || '_selected';

        result.selectedKeys = flatDataInIndex(
            value,
            selectedIndex,
            '',
            0,
            false,
            {
                type: 'recursive',
                recursiveIndex: recursiveIndex,
                childrenIndex: [],
            },
            false,
        );
        result.onSelect = (selectedKeys: Key[]) => {
            let newSelectedKeys: string[] = selectedKeys as string[];
            fillDataInIndex(
                value,
                selectedIndex,
                result.selectedKeys as string[],
                newSelectedKeys,
            );
        };
    }

    //为什么要将expand属性放在字段上，而不是使用默认的设置
    //因为这样的defaultExpand较为严格，antd的defaultExpandAll仅仅在第一次挂起组件的时候生效，后续刷新数据，或者添加数据以后，defaultExpandAll不起作用
    //提取expand属性
    result.autoExpandParent = props.expand?.autoExpandParent || false;
    let defaultExpand: boolean = !!props.expand?.defaultExpand;
    let expandIndex: string = props.expand?.expandIndex || '_expanded';

    result.expandedKeys = flatDataInIndex(
        value,
        expandIndex,
        '',
        0,
        defaultExpand,
        {
            type: 'recursive',
            recursiveIndex: recursiveIndex,
            childrenIndex: [],
        },
        true,
    );

    result.onExpand = (expandedKeys: Key[]) => {
        let newExpandedKeys: string[] = expandedKeys as string[];

        fillDataInIndex(
            value,
            expandIndex,
            result.expandedKeys as string[],
            newExpandedKeys,
        );
    };

    return result;
}

function getSchema() {
    //获取schema
    const schema = useFieldSchema();
    const itemsSchema: Schema['items'] = schema.items;
    let itemSchema: Schema;
    if (!itemsSchema) {
        throw new Error('schema items is undefined ' + schema);
    }
    if (Array.isArray(itemsSchema)) {
        if (itemsSchema.length == 0) {
            throw new Error('schema items is empty ' + itemsSchema);
        }
        itemSchema = itemsSchema[0];
    } else {
        itemSchema = itemsSchema;
    }
    return itemSchema;
}

const MyTree: MyTreeType = observer((props: PropsType) => {
    const field = useField<ArrayField>();
    const form = useForm();
    const basePath = field.address.toString();

    //获取递归的字段名
    let recursiveIndex = props.recursiveIndex;
    if (!recursiveIndex || recursiveIndex == '') {
        recursiveIndex = 'children';
    }

    //拉取数据
    const labelIndex = props.labelIndex || '';
    let dataSource: DataSourceType[] = getDataSourceRecursive(
        form,
        basePath,
        labelIndex,
        '',
        0,
        field.value,
        recursiveIndex,
    );

    //渲染方式
    let titleRender: ((node: DataNode) => React.ReactNode) | undefined;
    if (labelIndex == '') {
        const itemSchema = getSchema();
        titleRender = (node: DataNode) => {
            const index = node.key as string;
            return <RecursionField schema={itemSchema} name={index} />;
        };
    } else {
        titleRender = undefined;
    }

    //获取虚拟滚动方式
    const virutalConfig = getVirtualConfig(props);

    //获取选择方式
    const selectAndCheckboxAndExpandConfig =
        getSelectAndCheckboxAndExpandConfig(props, field.value, recursiveIndex);

    let MyTree: React.FC<TreeProps>;
    if (props.directoryStyle) {
        MyTree = Tree.DirectoryTree;
    } else {
        MyTree = Tree;
    }

    return (
        <MyTree
            treeData={dataSource}
            titleRender={titleRender}
            style={props.style}
            className={props.className}
            disabled={props.disabled}
            blockNode={props.blockNode}
            showLine={props.showLine}
            //虚拟滚动的配置
            {...virutalConfig}
            //选择等的配置
            {...selectAndCheckboxAndExpandConfig}
        />
    );
});

export default MyTree;

//这段代码仅仅为为了生成API文档的
const MyTreeTypeFocDoc: React.FC<PropsType> = () => {
    return <span />;
};

export { MyTreeTypeFocDoc };
