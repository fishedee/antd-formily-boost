import { TableProps as RcTableProps } from 'rc-table/lib/Table';
import { useEffect, useMemo, useRef, useState } from 'react';
import { any, throttle } from 'underscore';

type VirtualScrollSizeProps = {
    size: 'default' | 'middle' | 'small';
    compact: boolean;
};
type VirtualScrollProps = {
    itemHeight?: number | VirtualScrollSizeProps;
};

type DataSourceType = {
    _index: string;
    _style: any;
};

function getDataSourceRecursive(
    preIndex: string,
    data: any[],
    recursiveIndex?: string
): DataSourceType[] {
    let result = [];
    for (var i = 0; i != data.length; i++) {
        var single: any = {
            _index: preIndex != '' ? preIndex + '.' + i : i + '',
        };
        if (recursiveIndex) {
            let children = data[i][recursiveIndex];
            if (children && children.length != 0) {
                single._children = getDataSourceRecursive(
                    single._index + '.' + recursiveIndex,
                    children,
                    recursiveIndex
                );
            }
        }
        result.push(single);
    }
    return result;
}

function getNoVirtual(
    data: any[],
    recursiveIndex?: string
): { dataSource: DataSourceType[]; onRow: any } {
    let dataSource = getDataSourceRecursive('', data, recursiveIndex);
    return {
        dataSource: dataSource,
        onRow: undefined,
    };
}

function getNormalVirtual(
    data: any[],
    totalHeight: number,
    scrollTop: number,
    itemHeight: number
): { dataSource: DataSourceType[]; onRow: any } {
    const visibleCount = Math.ceil(totalHeight / itemHeight) + 6;
    let firstIndex = 0;
    firstIndex = Math.floor(scrollTop / itemHeight);
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
        let _style: { height?: string } = {};
        if (i == 0 && firstIndex != 0) {
            _style.height = firstIndex * itemHeight + 'px';
        }
        if (i == endIndex - 1 && endIndex != data.length) {
            _style.height = (data.length - endIndex + 1) * itemHeight + 'px';
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
    recursiveIndex: string;
    expandedIndex: string;
};

function getRecursiveVirtual(
    data: any[],
    totalHeight: number,
    scrollTop: number,
    itemHeight: number
): { dataSource: DataSourceType[]; onRow: any } {
    return { dataSource: [], onRow: [] };
}

function getVirtualConfig(
    scroll: RcTableProps<any>['scroll'],
    virtualScroll: VirtualScrollProps
): {
    className: string[];
    totalHeight: number;
    scrollTop: number;
    itemHeight: number;
} {
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
            '.' + className + ' .ant-table-body'
        )!;
        //节流函数，以避免过度渲染
        const listener = throttle(() => {
            setScrollTop(tableNode.current!.scrollTop);
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

//虚拟列表的做法与用react-window的不同，它仅仅就是将视图的data传入Table组件而已，而是将头部与底部的rowHeight扩大来使得滚动条可用
//这样做的好处在于：
//* 可以支持原有的Table组件特性，column的fixed，render，width，行选择的radio，支持rowSpan与colSpan
//* 使用react-window的效率更高，但是以上所有特性都会丢失
//FIXME 暂时发现的问题有：
//* virtual暂时对checkbox的rowSelection的支持不完整，主要在于传入Table组件的数据仅仅是一小部分，一小部分点击完毕后，会误以为已经全选
//* 对expandable的支持不太完美，在底部行进行expandable会有点小问题
//* 对recursive的支持也不太完美
//TODO 未来要新增的功能有：
//* 向外部提供scroll控制，滚动到指定的位置
let globalClassId = 10001;

function getVirtual(
    data: any[],
    scroll?: RcTableProps<any>['scroll'],
    virtualScroll?: VirtualScrollProps,
    virtualRecursiveProps?: VirtualRecursivePropsType
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
            'You have not property set scroll.y，so Virtual Scroll disabled'
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
        virtual = getNormalVirtual(
            data,
            virtualConfig.totalHeight,
            virtualConfig.scrollTop,
            virtualConfig.itemHeight
        );
    } else {
        //树形数据虚拟滚动
        virtual = getRecursiveVirtual(
            data,
            virtualConfig.totalHeight,
            virtualConfig.scrollTop,
            virtualConfig.itemHeight
        );
    }
    return {
        className: virtualConfig.className,
        ...virtual,
    };
}

export default getVirtual;

export { VirtualScrollProps, VirtualScrollSizeProps };
