import { Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import { ColumnSchema } from './columnSchema';
import { getDataInIndex, setDataInIndex } from './util';
import React from 'react';

function extractSelection(
    data: any[],
    dataIndex: string,
    result: string[],
    prevIndex: string,
    recursiveIndex?: string
) {
    for (var i = 0; i != data.length; i++) {
        let single = data[i];
        //初始化每个值为false
        if (single[dataIndex] === undefined) {
            single[dataIndex] = false;
        }
        const currentIndex = prevIndex != '' ? prevIndex + '.' + i : i + '';
        if (single[dataIndex]) {
            result.push(currentIndex);
        }
        if (recursiveIndex) {
            let children = single[recursiveIndex];
            if (children && children.length != 0) {
                extractSelection(
                    children,
                    dataIndex,
                    result,
                    currentIndex + '.' + recursiveIndex,
                    recursiveIndex
                );
            }
        }
    }
}

function fillSelection(
    data: any[],
    dataIndex: string,
    oldSelectedRowKeys: string[],
    newSelectedRowKeys: string[]
) {
    //先建立一个map
    let newSelectedKeyMap: { [key in string]: boolean } = {};
    for (let i in newSelectedRowKeys) {
        let index = newSelectedRowKeys[i];
        newSelectedKeyMap[index] = true;
    }

    //对于每个旧值，设置为false
    for (let i = 0; i != oldSelectedRowKeys.length; i++) {
        let index = oldSelectedRowKeys[i];
        if (!newSelectedKeyMap[index]) {
            setDataInIndex(data, index + '.' + dataIndex, false);
        }
    }

    //对于每个新值，设置为true
    for (let i = 0; i != newSelectedRowKeys.length; i++) {
        let index = newSelectedRowKeys[i];
        setDataInIndex(data, index + '.' + dataIndex, true);
    }
}
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
function getRowSelection(
    data: any[],
    columns: ColumnSchema[],
    recursiveIndex?: string
): {
    selection: TableRowSelection<any> | undefined;
    rowWrapper: React.FC<any> | undefined;
    className: string[];
} {
    let rowSelectionColumns = columns.filter((column) => {
        return column.type == 'rowSelectionColumn';
    });
    let column: ColumnSchema;
    if (rowSelectionColumns.length <= 0) {
        return { selection: undefined, rowWrapper: undefined, className: [] };
    }
    column = rowSelectionColumns[0];
    const dataIndex = column.rowSelectionColumnProps!.dataIndex!;
    let selectedRowKeys: string[] = [];

    //从data里面抽取selection
    extractSelection(data, dataIndex, selectedRowKeys, '', recursiveIndex);
    const rowSelection: TableRowSelection<any> = {
        type: column.rowSelectionColumnProps!.type,
        fixed: column.rowSelectionColumnProps!.fixed,
        columnTitle: column.title,
        columnWidth: column.rowSelectionColumnProps!.width,
        selectedRowKeys: selectedRowKeys,
        checkStrictly: column.rowSelectionColumnProps?.checkStrictly,
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
            fillSelection(
                data,
                dataIndex,
                selectedRowKeys,
                newSelectedRowKeys as string[]
            );
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
            '.ant-table-selection-column .ant-checkbox-input'
        ) as any;
        if (input && input.click) {
            input.click();
        }
    };
    let rowWrapper: React.FC<any> | undefined;
    if (column.rowSelectionColumnProps?.selectRowByClick) {
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
    if (column.rowSelectionColumnProps?.hidden === true) {
        className = ['formily_antd_none_checkbox'];
    }

    return {
        selection: rowSelection,
        rowWrapper: rowWrapper,
        className: className,
    };
}

export default getRowSelection;
