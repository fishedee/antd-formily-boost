import { Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import { ColumnSchema, TableConfig } from './config';
import { flatDataInIndex, fillDataInIndex } from '../util';
import React from 'react';
import './rowSelectionStyle.css';
import { batch } from '@formily/reactive';

//rowSelection的设计的三个目标
//1. 数组的每个元素的_rowSelected值都需要初始化为false
// * 使用renderCell里面的createField每个元素是不行的，因为在Table分页的时候有些元素的ReactNode根本就没有创建出来
// * 目前的方案只能显式地通过data[i]._rowSelected = false 来初始化每个元素
//2. _rowSelected的每个Field值能响应effected，同时Field的disabled来控制该checkbox是否可用
// * 这只能通过在renderCell里面创建field来实现，同时在getCheckboxProps中控制是否可用，但是性能损耗较大
// * 暂时没有找到合适的解决方案，这里并没有得到实现
//3. 尽可能减少render，当数组元素checked的时候，不会整个Table的render，而只是局部的render
// * 使用每个Field类型为Checkbox来代替Table组件的rowSelection，Column的头部为单独的Checkbox组件，但是这样会造成原有的选中样式丢失了
// * 暂时没有找到合适的解决方案，这里并没有得到实现
//4. 选中行但是不显示rowSelection列，仅仅是显式底色，功能依然可以通过点击行来实现选择行。
// * 返回一个新的classname
//5. 为什么不使用React约定的办法，暴露整个selection数组给用户，而是每次从data中重新计算？
// * 因为Table组件是支持编辑，每一行可以添加和删除，而行key是与index有关的，不是固定的key，直接暴露selection数组，会导致中删一行的时候，选择行会自动往前一行偏移
//6. 为什么不在Virtual以后，再在有限的dataSource里面计算selection数组
// * 因为selection的onChange中需要完整的旧selection数组来diff，计算数据
//7. 后续的优化的办法主要是：
// * 将checkbox与radio变为自己渲染的，而不是依赖Table组件的机制，这样需要配合在tr上添加ant-table-selection-column类名，以及行头的checkbox实现，工作量较大，而且不兼容Table组件未来对selection的新特性
// * 监听data的变化，使用@formily/Reactive库的observe方法，对原始data监听，然后增量生成selection数组，而不是每次重新生成。这个实现的难度大一点，但工作量更少，而且兼容Table组件未来对selection的新特性
function getRowSelection(
    data: any[],
    tableConfig: TableConfig,
): {
    selection: TableRowSelection<any> | undefined;
    rowWrapper: React.FC<any> | undefined;
    className: string[];
} {
    if (!tableConfig.rowSelectionColumn) {
        return { selection: undefined, rowWrapper: undefined, className: [] };
    }
    let rowSelectionColumnProps =
        tableConfig.rowSelectionColumn.rowSelectionColumnProps!;

    const selectedIndex = rowSelectionColumnProps!.selectedIndex;

    let selectedRowKeys: string[] = flatDataInIndex(
        data,
        selectedIndex,
        '',
        0,
        false,
        tableConfig.dataConvertProps.tree,
        false, //不能提前终止对checkbox的检查
    );

    const rowSelection: TableRowSelection<any> = {
        type: rowSelectionColumnProps!.type,
        fixed: rowSelectionColumnProps!.fixed,
        columnTitle: tableConfig.rowSelectionColumn.title,
        columnWidth: rowSelectionColumnProps!.width,
        selectedRowKeys: selectedRowKeys,
        checkStrictly: rowSelectionColumnProps?.checkStrictly,
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
            batch(() => {
                fillDataInIndex(
                    data,
                    selectedIndex,
                    selectedRowKeys,
                    newSelectedRowKeys as string[],
                );
            });
        },
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
        ],
    };

    //这里采用在行中寻找对应的input元素，手动触发onClick事件的方式来实现行点击
    //为什么不直接修改数据，因为在RecursiveRow的树形数据中，本行的checkbox状态与父checkbox状态是有关联的，只修改本行状态，不修改父checkbox状态会有问题
    const onClick = (e: any) => {
        const event: PointerEvent = e.nativeEvent;
        let target: any = event.target as any;
        if (!target) {
            return;
        }
        while (target != null) {
            if (target.nodeName.toLowerCase() == 'tr') {
                break;
            }
            target = target.parentNode;
        }
        if (!target) {
            return;
        }
        let input = target.querySelector(
            '.ant-table-selection-column input',
        ) as any;
        if (input && input.click) {
            input.click();
        }
    };
    let rowWrapper: React.FC<any> | undefined;
    if (rowSelectionColumnProps?.selectRowByClick) {
        rowWrapper = (props) => {
            const rowKey = props['data-row-key'];
            return (
                <tr {...props} onClick={onClick}>
                    {props.children}
                </tr>
            );
        };
    }

    let className: string[] = [];
    if (rowSelectionColumnProps?.hidden == 'DisplayNone') {
        className = ['formily_antd_selection_display_none'];
    } else if (rowSelectionColumnProps?.hidden == 'WidthZero') {
        className = ['formily_antd_selection_width_zero'];
    }

    return {
        selection: rowSelection,
        rowWrapper: rowWrapper,
        className: className,
    };
}

export default getRowSelection;
