import { ArrayField, Field } from '@formily/core';
import {
    RecursionField,
    Schema,
    useField,
    useFieldSchema,
    useForm,
} from '@formily/react';
import { observer } from '@formily/reactive-react';
import React, { Component, Fragment, useMemo } from 'react';
import { Table } from 'antd';
import { ReactElement } from 'react';
import {
    isColumnType,
    isCheckboxColumnType,
    isRadioColumnType,
} from './IsType';
import { ColumnsType, ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { ArrayContextProvider, ArrayIndexContextProvider } from './Context';
import { ColumnGroupType } from 'antd/lib/table';
import Column, { ColumnProps } from './Column';
import CheckedColumn, { CheckboxColumnProps } from './CheckboxColumn';
import { RowSelectionType, TableRowSelection } from 'antd/lib/table/interface';
import RadioColumn, { RadioColumnProps } from './RadioColumn';
import { useEffect } from 'react';
import { useRef } from 'react';
import { TableProps as RcTableProps } from 'rc-table/lib/Table';
import { useState } from 'react';
import MyIndex, { MyIndexProps } from './MyIndex';
import MyRemove, { MyRemoveProps } from './MyRemove';
import MyMoveUp, { MyMoveUpProps } from './MyMoveUp';
import MyMoveDown, { MyMoveDownProps } from './MyMoveDown';
import MyAddition, { MyAdditionProps } from './MyAddition';

type Column = {
    title: string;
    dataIndex: string;
    key: string;
    schema: Schema;
    type: 'column' | 'rowSelectionColumn';
    columnProps?: ColumnProps & { children: Column[] };
    rowSelectionColumnProps?: { type: RowSelectionType } & CheckboxColumnProps;
};

function getColumn(schema: Schema): Column[] {
    //在当前实现中，Column层看成是Field
    let itemsSchema: Schema['items'] = schema.items;
    const items = Array.isArray(itemsSchema) ? itemsSchema : [itemsSchema];
    //获取当前array的field
    let form = useForm();
    let field = useField();
    const parseSource = (schema: Schema): Column[] => {
        //在渲染的时候，手动拿出每个Column的Field，并且将Schema作为保底逻辑
        //这里的写法，其实是先取field数据，再去createField
        //当第一次render的时候，Field不存在时，返回值为undefined
        let columnField = form.query(field.address + '.' + schema.name).take();
        let component = schema['x-component'];
        let isVisible = columnField ? columnField.visible : schema['x-visible'];
        if (isVisible == false) {
            return [];
        }
        let columnBase = {
            key: schema.name + '',
            dataIndex: schema.name + '',
            title: columnField ? columnField.title : schema.title,
            schema: schema,
        };
        if (isColumnType(component)) {
            //获取该列的信息
            const style: ColumnProps = {};
            style.width = columnField
                ? columnField.componentProps?.width
                : schema['x-component-props']?.width;
            style.ellipsis = columnField
                ? columnField.componentProps?.ellipsis
                : schema['x-component-props']?.ellipsis;
            style.fixed = columnField
                ? columnField.componentProps?.fixed
                : schema['x-component-props']?.fixed;
            return [
                {
                    ...columnBase,
                    type: 'column',
                    columnProps: {
                        children: reduceProperties(schema),
                        ...style,
                    },
                },
            ];
        } else if (isCheckboxColumnType(component)) {
            //获取该列的信息
            const style: CheckboxColumnProps = {
                dataIndex: columnField
                    ? columnField.componentProps?.dataIndex
                    : schema['x-component-props']?.dataIndex,
                fixed: columnField
                    ? columnField.componentProps?.fixed
                    : schema['x-component-props']?.fixed,
                width: columnField
                    ? columnField.componentProps?.width
                    : schema['x-component-props']?.width,
                selectRowByClick: columnField
                    ? columnField.componentProps?.selectRowByClick
                    : schema['x-component-props']?.selectRowByClick,
                checkStrictly: columnField
                    ? columnField.componentProps?.checkStrictly
                    : schema['x-component-props']?.checkStrictly,
                hidden: columnField
                    ? columnField.componentProps?.hidden
                    : schema['x-component-props']?.hidden,
            };
            if (!style.dataIndex) {
                style.dataIndex = '_selected';
            }
            return [
                {
                    ...columnBase,
                    type: 'rowSelectionColumn',
                    rowSelectionColumnProps: {
                        type: 'checkbox',
                        ...style,
                    },
                },
            ];
        } else if (isRadioColumnType(component)) {
            //获取该列的信息
            const style: RadioColumnProps = {
                dataIndex: columnField
                    ? columnField.componentProps?.dataIndex
                    : schema['x-component-props']?.dataIndex,
                fixed: columnField
                    ? columnField.componentProps?.fixed
                    : schema['x-component-props']?.fixed,
                width: columnField
                    ? columnField.componentProps?.width
                    : schema['x-component-props']?.width,
                selectRowByClick: columnField
                    ? columnField.componentProps?.selectRowByClick
                    : schema['x-component-props']?.selectRowByClick,
                hidden: columnField
                    ? columnField.componentProps?.hidden
                    : schema['x-component-props']?.hidden,
            };
            if (!style.dataIndex) {
                style.dataIndex = '_selected';
            }
            return [
                {
                    ...columnBase,
                    type: 'rowSelectionColumn',
                    rowSelectionColumnProps: {
                        type: 'radio',
                        ...style,
                    },
                },
            ];
        }
        return [];
    };
    const reduceProperties = (schema: Schema): Column[] => {
        //对于items里面的每个schema，每个Schema为Void字段，遍历它的Properties
        if (schema.properties) {
            return schema.reduceProperties((current, schema) => {
                return current.concat(parseSource(schema));
            }, [] as Column[]);
        } else {
            return [];
        }
    };
    return items.reduce((current, schema) => {
        //遍历每个items里面的schema
        if (schema) {
            return current.concat(reduceProperties(schema));
        }
        return current;
    }, [] as Column[]);
}

function getDataSource(data: any[], columns: Column[]): any[] {
    let result = [];
    for (var i = 0; i != data.length; i++) {
        var single = {
            _index: i,
        };
        result.push(single);
    }
    return result;
}

function getDataColumns(
    columns: Column[]
): (ColumnGroupType<unknown> | ColumnType<unknown>)[] {
    const convertColumn = (column: Column) => {
        if (
            column.columnProps &&
            column.columnProps.children &&
            column.columnProps.children.length != 0
        ) {
            let single: ColumnGroupType<unknown> = {
                ...column,
                ...column.columnProps,
                children: column.columnProps.children
                    .filter((column) => {
                        return column.type == 'column';
                    })
                    .map(convertColumn),
            };
            return single;
        } else {
            let single: ColumnType<unknown> = {
                ...column,
                ...column.columnProps,
                render: (value: any, record: any, index: number) => {
                    return (
                        <ArrayIndexContextProvider
                            value={parseInt(record._index)}
                        >
                            <RecursionField
                                name={record._index}
                                schema={column.schema}
                                onlyRenderProperties
                            />
                        </ArrayIndexContextProvider>
                    );
                },
            };
            return single;
        }
    };
    return columns
        .filter((column) => {
            return column.type == 'column';
        })
        .map(convertColumn);
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
    columns: Column[]
): {
    selection: TableRowSelection<any> | undefined;
    rowWrapper: React.FC<any> | undefined;
    className: string[];
} {
    let rowSelectionColumns = columns.filter((column) => {
        return column.type == 'rowSelectionColumn';
    });
    let column: Column;
    if (rowSelectionColumns.length <= 0) {
        return { selection: undefined, rowWrapper: undefined, className: [] };
    }
    column = rowSelectionColumns[0];
    const dataIndex = column.rowSelectionColumnProps!.dataIndex!;
    let selectedRowKeys: any[] = [];
    for (var i = 0; i != data.length; i++) {
        let single = data[i];
        //初始化每个值为false
        if (single[dataIndex] === undefined) {
            single[dataIndex] = false;
        }
        if (single[dataIndex]) {
            selectedRowKeys.push(i + '');
        }
    }
    const rowSelection: TableRowSelection<any> = {
        type: column.rowSelectionColumnProps!.type,
        fixed: column.rowSelectionColumnProps!.fixed,
        columnTitle: column.title,
        columnWidth: column.rowSelectionColumnProps!.width,
        selectedRowKeys: selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
            //虽然这里没有使用Batch来触发更改数据，但是只会产生1次Render，可能是observer的优化问题
            let newSelectedKeyMap: { [key in number]: boolean } = {};
            for (let i in newSelectedRowKeys) {
                let index = newSelectedRowKeys[i] as number;
                newSelectedKeyMap[index] = true;
            }
            //先将旧值设置为false
            for (let i = 0; i != selectedRowKeys.length; i++) {
                let index = selectedRowKeys[i];
                if (!newSelectedKeyMap[index]) {
                    data[index][dataIndex] = false;
                }
            }
            for (let i = 0; i != newSelectedRowKeys.length; i++) {
                let index = newSelectedRowKeys[i] as number;
                data[index][dataIndex] = true;
            }
        },
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
        ],
    };
    let rowWrapper: React.FC<any> | undefined;
    if (column.rowSelectionColumnProps?.selectRowByClick) {
        rowWrapper = (props) => {
            const rowKey = props['data-row-key'];
            const onClick = () => {
                if (column.rowSelectionColumnProps?.type == 'radio') {
                    //radio是清空原来的
                    if (selectedRowKeys.length != 0) {
                        let oldRowKey = selectedRowKeys[0];
                        let single = data[oldRowKey];
                        single[dataIndex] = false;
                    }
                    let single = data[rowKey];
                    single[dataIndex] = true;
                } else {
                    //checkbox反选
                    let single = data[rowKey];
                    single[dataIndex] = !single[dataIndex];
                }
            };
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

export type PaginationType = {
    current: number;
    pageSize: number;
    total?: number;
};

type PaginationPropsType = {
    defaultPageSize?: number;
    showQuickJumper?: boolean;
    showSizeChanger?: boolean;
    showTotal?: boolean;
    pageSizeOptions?: string[];
};

function getPagination(
    totalSize: number,
    paginaction?: PaginationType,
    paginationProps?: PaginationPropsType
): TablePaginationConfig | false {
    if (!paginaction) {
        return false;
    }
    //重新当前页
    if (paginaction.current < 1) {
        paginaction.current = 1;
    }
    if (paginaction.total !== undefined) {
        totalSize = paginaction.total;
    }
    const maxPage = Math.ceil(totalSize / paginaction.pageSize) + 1;
    if (paginaction.current > maxPage) {
        paginaction.current = maxPage;
    }
    let result: TablePaginationConfig = {
        current: paginaction.current,
        onChange: (current: number) => {
            paginaction.current = current;
        },
        pageSize: paginaction.pageSize,
        onShowSizeChange: (current: number, pageSize: number) => {
            paginaction.current = current;
            paginaction.pageSize = pageSize;
        },
        total: paginaction.total,
        showQuickJumper: paginationProps?.showQuickJumper,
        showSizeChanger: paginationProps?.showSizeChanger,
        pageSizeOptions: paginationProps?.pageSizeOptions,
        showTotal: paginationProps?.showTotal
            ? (total, range) => `共${total}条`
            : undefined,
    };
    return result;
}

function getScroll(scroll: RcTableProps<any>['scroll']) {
    return scroll;
}

type VirtualScrollProps = {
    itemHeight?: number;
};

//虚拟列表的做法与用react-window的不同，它仅仅就是将视图的data传入Table组件而已，而是将头部与底部的rowHeight扩大来使得滚动条可用
//FIXME virtual暂时对checkbox的rowSelection的支持不完整，主要在于传入Table组件的数据仅仅是一小部分，一小部分点击完毕后，会误以为已经全选
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
        const listener = () => {
            setScrollTop(tableNode.current!.scrollTop);
        };
        tableNode.current.addEventListener('scroll', listener);
        return () => {
            tableNode.current?.removeEventListener('scroll', listener);
        };
    }, []);

    const totalHeight: number = scroll.y;
    const itemHeight = virtualScroll.itemHeight ? virtualScroll.itemHeight : 38;
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

type PropsType = {
    paginaction?: PaginationType;
    paginationProps?: PaginationPropsType;
    scroll?: RcTableProps<any>['scroll'];
    virtualScroll?: VirtualScrollProps;
};

type MyTableType = React.FC<PropsType> & {
    Column?: React.FC<ColumnProps>;
    CheckboxColumn?: React.FC<CheckboxColumnProps>;
    RadioColumn?: React.FC<RadioColumnProps>;
    Index?: React.FC<MyIndexProps>;
    Remove?: React.FC<MyRemoveProps>;
    MoveUp?: React.FC<MyMoveUpProps>;
    MoveDown?: React.FC<MyMoveDownProps>;
    Addition?: React.FC<MyAdditionProps>;
};

const MyTable: MyTableType = observer((props: PropsType) => {
    const field = useField<ArrayField>();
    const fieldSchema = useFieldSchema();
    const tableColumns = getColumn(fieldSchema);

    const dataSource = getDataSource(field.value, tableColumns);
    const dataColumns: ColumnsType<any> = getDataColumns(tableColumns);

    const rowSelection = getRowSelection(field.value, tableColumns);

    const pagination = getPagination(
        dataSource.length,
        props.paginaction,
        props.paginationProps
    );

    const scroll = getScroll(props.scroll);
    const virtual = getVirtual(dataSource, props.scroll, props.virtualScroll);

    const allClassName = [rowSelection.className, virtual.className];
    console.log('Table Render', virtual.dataSource.length);
    return (
        <ArrayContextProvider value={field}>
            <Table
                className={allClassName.join(' ')}
                rowKey="_index"
                bordered={true}
                columns={dataColumns}
                dataSource={virtual.dataSource}
                rowSelection={rowSelection.selection}
                pagination={pagination}
                scroll={scroll}
                components={{
                    body: {
                        row: rowSelection.rowWrapper,
                    },
                }}
                onRow={virtual.onRow}
            />
            {tableColumns.map((column) => {
                //这里实际渲染每个Column，以保证Column能接收到Reaction
                //注意要使用onlyRenderSelf
                return (
                    <RecursionField
                        key={'items_' + column.key}
                        name={column.key}
                        schema={column.schema}
                        onlyRenderSelf
                    />
                );
            })}
            <RecursionField
                key={'properties'}
                schema={fieldSchema}
                onlyRenderProperties
            />
        </ArrayContextProvider>
    );
});

MyTable.Column = Column;

MyTable.CheckboxColumn = CheckedColumn;

MyTable.RadioColumn = RadioColumn;

MyTable.Index = MyIndex;

MyTable.Remove = MyRemove;

MyTable.MoveUp = MyMoveUp;

MyTable.MoveDown = MyMoveDown;

MyTable.Addition = MyAddition;

export default MyTable;
