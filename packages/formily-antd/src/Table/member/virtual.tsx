import { TableProps as RcTableProps } from 'rc-table/lib/Table';
import { useEffect, useMemo, useRef, useState } from 'react';
import { throttle } from 'underscore';

type VirtualScrollSizeProps = {
    size: 'default' | 'middle' | 'small';
    compact: boolean;
};
type VirtualScrollProps = {
    itemHeight?: number | VirtualScrollSizeProps;
};

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
    dataSource: any[],
    scroll?: RcTableProps<any>['scroll'],
    virtualScroll?: VirtualScrollProps
): { className: string[]; dataSource: any[]; onRow: any } {
    if (!scroll || !virtualScroll || !dataSource) {
        return { className: [], dataSource: dataSource, onRow: undefined };
    }
    if (!scroll.y || typeof scroll.y != 'number') {
        console.log(
            'You have not property set scroll.y，so Virtual Scroll disabled'
        );
        return { className: [], dataSource: dataSource, onRow: undefined };
    }
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

    const totalHeight: number = scroll.y;
    const itemHeight = getHeight();
    const visibleCount = Math.ceil(totalHeight / itemHeight) + 6;
    let firstIndex = 0;
    firstIndex = Math.floor(scrollTop / itemHeight);
    //往前3条
    if (firstIndex - 3 >= 0) {
        firstIndex = firstIndex - 3;
    }
    let endIndex = firstIndex + visibleCount;
    if (endIndex >= dataSource.length) {
        endIndex = dataSource.length;
    }
    const visibleData = dataSource.slice(firstIndex, endIndex);
    for (let i = 0; i != visibleData.length; i++) {
        let single = visibleData[i];
        let _style: { height?: string } = {};
        if (i == 0 && firstIndex != 0) {
            _style.height = firstIndex * itemHeight + 'px';
        }
        if (i == visibleData.length - 1 && endIndex != dataSource.length) {
            _style.height =
                (dataSource.length - endIndex + 1) * itemHeight + 'px';
        }
        single._style = _style;
    }
    let onRow = (record: any) => {
        return { style: record._style };
    };
    return { className: [className], dataSource: visibleData, onRow: onRow };
}

export default getVirtual;

export { VirtualScrollProps, VirtualScrollSizeProps };
