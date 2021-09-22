import { Form } from '@formily/core';
import { TableProps as RcTableProps } from 'rc-table/lib/Table';
import { useEffect, useMemo, useRef, useState } from 'react';
import { any, throttle } from 'underscore';
import { RecursiveIndex } from './recursiveRow';

type VirtualScrollSizeProps = {
    size: 'default' | 'middle' | 'small';
    compact: boolean;
};
type VirtualScrollProps = {
    itemHeight?: number | VirtualScrollSizeProps;
};

type VirtualConfig = {
    className: string[];
    totalHeight: number;
    scrollTop: number;
    itemHeight: number;
};

type DataSourceType = {
    _index: string;
    _style?: any;
    _children?: DataSourceType[];
    _currentLevel?: number;

    //以下属性仅仅是运算时使用，render时没用
    _begin?: number;
    _end?: number;
    _visible?: boolean;
};

function getDataSourceRecursive(
    preIndex: string,
    currentLevel: number,
    data: any[],
    recursiveIndex?: RecursiveIndex,
): DataSourceType[] {
    let result: DataSourceType[] = [];
    for (var i = 0; i != data.length; i++) {
        var single: DataSourceType = {
            _index: preIndex != '' ? preIndex + '.' + i : i + '',
        };
        if (recursiveIndex) {
            let recursiveIndexName: string;
            if (recursiveIndex.type == 'recursive') {
                recursiveIndexName = recursiveIndex.recursiveIndex;
            } else {
                recursiveIndexName = recursiveIndex.childrenIndex[currentLevel];
            }
            let children = data[i][recursiveIndexName];
            if (children && children.length != 0) {
                single._children = getDataSourceRecursive(
                    single._index + '.' + recursiveIndexName,
                    currentLevel + 1,
                    children,
                    recursiveIndex,
                );
            }
            if (recursiveIndex.type == 'children') {
                single._currentLevel = currentLevel;
            }
        }
        result.push(single);
    }
    return result;
}

function getNoVirtual(
    data: any[],
    recursiveIndex?: RecursiveIndex,
): { dataSource: DataSourceType[]; onRow: any } {
    let dataSource = getDataSourceRecursive('', 0, data, recursiveIndex);
    return {
        dataSource: dataSource,
        onRow: undefined,
    };
}

function getNormalVirtual(
    data: any[],
    config: VirtualConfig,
): { dataSource: DataSourceType[]; onRow: any } {
    const visibleCount = Math.ceil(config.totalHeight / config.itemHeight) + 6;
    let firstIndex = 0;
    firstIndex = Math.floor(config.scrollTop / config.itemHeight);
    //往前3条
    if (firstIndex - 3 >= 0) {
        firstIndex = firstIndex - 3;
    }
    let endIndex = firstIndex + visibleCount;
    if (endIndex >= data.length) {
        endIndex = data.length;
    }
    const visibleData: DataSourceType[] = [];
    for (let i = firstIndex; i != endIndex; i++) {
        let _style: { height?: string } = {
            //默认值
            height: config.itemHeight + 'px',
        };
        if (i == firstIndex && firstIndex != 0) {
            _style.height = firstIndex * config.itemHeight + 'px';
        }
        if (i == endIndex - 1 && endIndex != data.length) {
            _style.height =
                (data.length - endIndex + 1) * config.itemHeight + 'px';
        }
        visibleData.push({
            _index: i + '',
            _style: _style,
        });
    }
    let onRow = (record: any) => {
        return { style: record._style };
    };
    return { dataSource: visibleData, onRow: onRow };
}

type VirtualRecursivePropsType = {
    recursiveIndex: RecursiveIndex;
    expandedIndex: string;
};

//计算每行占用的高度
function getRecursiveHeightDataSource(
    prevHeight: number,
    preIndex: string,
    currentLevel: number,
    data: any[],
    config: VirtualConfig,
    virtualRecursiveProps: VirtualRecursivePropsType,
): [DataSourceType[], number] {
    let dataSource: DataSourceType[] = [];
    const recursiveIndex = virtualRecursiveProps.recursiveIndex;
    const expandedIndex = virtualRecursiveProps.expandedIndex;
    let allTotalChildrenCount = 0;
    for (var i = 0; i != data.length; i++) {
        var singleData = data[i];
        var single: DataSourceType = {
            _index: preIndex != '' ? preIndex + '.' + i : i + '',
        };
        single._begin = prevHeight;
        let recursiveIndexName: string;
        if (recursiveIndex.type == 'recursive') {
            recursiveIndexName = recursiveIndex.recursiveIndex;
        } else {
            recursiveIndexName = recursiveIndex.childrenIndex[currentLevel];
        }
        let children = singleData[recursiveIndexName];
        let isExpand = singleData[expandedIndex];
        let childrenData: DataSourceType[] = [];
        let totalChildrenCount = 0;
        if (children && children.length != 0 && isExpand) {
            [childrenData, totalChildrenCount] = getRecursiveHeightDataSource(
                prevHeight + config.itemHeight,
                single._index + '.' + recursiveIndexName,
                currentLevel + 1,
                children,
                config,
                virtualRecursiveProps,
            );
        }

        //末端高度为，自身高度，以及所有子children的高度相加
        if (childrenData.length != 0) {
            single._children = childrenData;
        } else if (children && children.length != 0) {
            //对于原数据含有子数据的，我们也要填充一个空数组进去，以显示expand图标
            single._children = [];
        }
        //写入当前的level
        if (recursiveIndex.type == 'children') {
            single._currentLevel = currentLevel;
        }
        single._end =
            single._begin! + config.itemHeight * (totalChildrenCount + 1);
        prevHeight = single._end;
        allTotalChildrenCount += totalChildrenCount + 1;

        if (
            single._begin <= config.scrollTop + config.totalHeight + 100 &&
            single._end >= config.scrollTop - 100
        ) {
            //该区块可见
            single._visible = true;
        } else {
            //该区块不可见
            single._visible = false;
        }
        dataSource.push(single);
    }
    return [dataSource, allTotalChildrenCount];
}

//从每行占用的行高来计算，是否需要填写这个页面
function getRecursiveVirtualDataSource(
    dataSource: DataSourceType[],
    itemHeight: number,
): DataSourceType[] {
    let result: DataSourceType[] = [];
    for (var i = 0; i != dataSource.length; i++) {
        let single = dataSource[i];
        if (single._visible == true) {
            //可见
            if (i - 1 >= 0 && dataSource[i - 1]._visible == false) {
                //前一个不可见
                const end = dataSource[i - 1]._end;
                let begin = dataSource[i - 1]._begin;
                if (i - 1 != 0) {
                    begin = dataSource[0]._begin;
                }
                //撑起高度的虚拟块，没有_children
                let prevSingle = {
                    ...dataSource[i - 1],
                    _style: {
                        height: end! - begin! + 'px',
                    },
                    _children: undefined,
                };
                result.push(prevSingle);
            }
            if (single._children) {
                single._children = getRecursiveVirtualDataSource(
                    single._children,
                    itemHeight,
                );
            }
            if (
                single._end! - single._begin! != itemHeight &&
                (!single._children || single._children.length == 0)
            ) {
                single._style = {
                    height: single._end! - single._begin! + 'px',
                };
            } else {
                single._style = {
                    height: itemHeight + 'px',
                };
            }

            result.push(single);
        } else {
            //不可见
            if (i - 1 >= 0 && dataSource[i - 1]._visible == true) {
                //前一个可见
                let end = single._end;
                const begin = single._begin;
                if (i != dataSource.length - 1) {
                    end = dataSource[dataSource.length - 1]._end;
                }
                //撑起高度的虚拟块，没有_children
                let nextSingle = {
                    ...single,
                    _style: {
                        height: end! - begin! + 'px',
                    },
                    _children: undefined,
                };
                result.push(nextSingle);
                //可以提前结束了
                break;
            }
        }
    }
    return result;
}

//计算树形数据的virtual，这是整个项目中最复杂的部分
//这里的时间不是极限的，还可以进一步提升，
//高度不是每次render的时候重新计算，而是缓存一个本地数据，然后当data变化的时候，track同步来计算新数据。最后使用线段树来优化区间和操作
function getRecursiveVirtual(
    data: any[],
    config: VirtualConfig,
    virtualRecursiveProps: VirtualRecursivePropsType,
): { dataSource: DataSourceType[]; onRow: any } {
    let [dataSourceHeight, childrenCount] = getRecursiveHeightDataSource(
        0,
        '',
        0,
        data,
        config,
        virtualRecursiveProps,
    );

    let dataSource = getRecursiveVirtualDataSource(
        dataSourceHeight,
        config.itemHeight,
    );

    let onRow = (record: any) => {
        return { style: record._style };
    };

    return { dataSource: dataSource, onRow };
}

//虚拟列表的做法与用react-window的不同，它仅仅就是将视图的data传入Table组件而已，而是将头部与底部的rowHeight扩大来使得滚动条可用
//这样做的好处在于：
//* 可以支持原有的Table组件特性，column的fixed，render，width，行选择的radio，支持rowSpan与colSpan
//* 使用react-window的效率更高，但是以上所有特性都会丢失
//* 支持recursiveRow与childrenRow
//* 支持radio selection
//FIXME 暂时发现的问题有：
//* virtual暂时对checkbox的rowSelection的支持不完整，主要在于传入Table组件的数据仅仅是一小部分，一小部分点击完毕后，会误以为已经全选
//* 对expandable的支持不太完美，在底部行进行expandable会有点小问题
//TODO 未来要新增的功能有：
//* 向外部提供scroll控制，滚动到指定的位置
let globalClassId = 10001;

function getVirtualConfig(
    scroll: RcTableProps<any>['scroll'],
    virtualScroll: VirtualScrollProps,
): VirtualConfig {
    function getHeight(): number {
        //未设置时
        if (!virtualScroll?.itemHeight) {
            return 55;
        }
        if (typeof virtualScroll.itemHeight == 'number') {
            return virtualScroll.itemHeight;
        }
        if (virtualScroll.itemHeight.compact === true) {
            const compactValue = {
                default: 45,
                middle: 37,
                small: 29,
            };
            return compactValue[virtualScroll.itemHeight.size || 'default'];
        } else {
            const defaultValue = {
                default: 57,
                middle: 47,
                small: 39,
            };
            return defaultValue[virtualScroll.itemHeight.size || 'default'];
        }
    }
    const [scrollTop, setScrollTop] = useState(0);
    const className = useMemo(() => {
        globalClassId++;
        return 'formily_antd_virtual_' + globalClassId;
    }, []);
    const tableNode = useRef<Element>();
    useEffect(() => {
        tableNode.current = document.querySelector(
            '.' + className + ' .ant-table-body',
        )!;
        //节流函数，以避免过度渲染
        const listener = throttle(() => {
            setScrollTop(tableNode.current!.scrollTop);
            console.log('scrollTop', tableNode.current!.scrollTop, scroll!.y);
        }, 100);
        tableNode.current.addEventListener('scroll', listener);
        return () => {
            tableNode.current?.removeEventListener('scroll', listener);
        };
    }, []);
    return {
        className: [className],
        totalHeight: scroll!.y as number,
        itemHeight: getHeight(),
        scrollTop: scrollTop,
    };
}

function getVirtual(
    data: any[],
    scroll?: RcTableProps<any>['scroll'],
    virtualScroll?: VirtualScrollProps,
    virtualRecursiveProps?: VirtualRecursivePropsType,
): { className: string[]; dataSource: DataSourceType[]; onRow: any } {
    //不打开虚拟滚动
    if (!scroll || !virtualScroll) {
        return {
            className: [],
            ...getNoVirtual(data, virtualRecursiveProps?.recursiveIndex),
        };
    }
    if (!scroll.y || typeof scroll.y != 'number') {
        console.log(
            'You have not property set scroll.y，so Virtual Scroll disabled',
        );
        return {
            className: [],
            ...getNoVirtual(data, virtualRecursiveProps?.recursiveIndex),
        };
    }

    //打开虚拟滚动
    const virtualConfig = getVirtualConfig(scroll, virtualScroll);
    let virtual: { dataSource: DataSourceType[]; onRow: any };
    if (!virtualRecursiveProps) {
        //普通列表虚拟滚动
        virtual = getNormalVirtual(data, virtualConfig);
    } else {
        //树形数据虚拟滚动
        virtual = getRecursiveVirtual(
            data,
            virtualConfig,
            virtualRecursiveProps,
        );
    }
    return {
        className: virtualConfig.className,
        ...virtual,
    };
}

export default getVirtual;

export { VirtualScrollProps, VirtualScrollSizeProps };
