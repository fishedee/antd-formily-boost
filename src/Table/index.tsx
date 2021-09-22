import { ArrayField } from '@formily/core';
import {
    RecursionField,
    useField,
    useFieldSchema,
    useForm,
} from '@formily/react';
import { observer } from '@formily/reactive-react';
import React from 'react';
import { Table } from 'antd';

import { ArrayContextProvider } from './components/Context';
import Column, { ColumnProps } from './components/Column';
import CheckedColumn, {
    CheckboxColumnProps,
} from './components/CheckboxColumn';
import RadioColumn, { RadioColumnProps } from './components/RadioColumn';
import { TableProps as RcTableProps } from 'rc-table/lib/Table';
import MyIndex, { MyIndexProps } from './components/MyIndex';
import MyRemove, { MyRemoveProps } from './components/MyRemove';
import MyMoveUp, { MyMoveUpProps } from './components/MyMoveUp';
import MyMoveDown, { MyMoveDownProps } from './components/MyMoveDown';
import MyAddition, { MyAdditionProps } from './components/MyAddition';
import ExpandableRow, { ExpandableRowProps } from './components/ExpandableRow';
import RecursiveRow, { RecursiveRowProps } from './components/RecursiveRow';
import getPagination, {
    PaginationPropsType,
    PaginationType,
} from './member/paginaction';
import getVirtual, { VirtualScrollProps } from './member/virtual';
import getColumnSchema from './member/columnSchema';
import getRecursiveRow from './member/recursiveRow';
import getDataColumns from './member/dataColumn';
import getRowSelection from './member/rowSelection';
import getScroll from './member/scroll';
import getExpandableRow from './member/expandableRow';
import MySubtreeAddition, {
    MySubtreeAdditionProps,
} from './components/MySubtreeAddition';
import { ExpandableConfig } from 'antd/lib/table/interface';
import ChildrenRow, { ChildrenRowProps } from './components/ChildrenRow';

type PropsType = {
    paginaction?: PaginationType;
    paginationProps?: PaginationPropsType;
    scroll?: RcTableProps<any>['scroll'];
    virtualScroll?: VirtualScrollProps;
    size?: 'middle' | 'small';
    bordered?: boolean;
    loading?: boolean;
    style?: React.CSSProperties;
    className?: string;
};

type MyTableType = React.FC<PropsType> & {
    Column?: React.FC<ColumnProps>;
    CheckboxColumn?: React.FC<CheckboxColumnProps>;
    RadioColumn?: React.FC<RadioColumnProps>;
    ExpandableRow?: React.FC<ExpandableRowProps>;
    RecursiveRow?: React.FC<RecursiveRowProps>;
    ChildrenRow?: React.FC<ChildrenRowProps>;
    Index?: React.FC<MyIndexProps>;
    Remove?: React.FC<MyRemoveProps>;
    MoveUp?: React.FC<MyMoveUpProps>;
    MoveDown?: React.FC<MyMoveDownProps>;
    Addition?: React.FC<MyAdditionProps>;
    SubtreeAddition?: React.FC<MySubtreeAdditionProps>;
};

const MyTable: MyTableType = observer((props: PropsType) => {
    const field = useField<ArrayField>();
    const fieldSchema = useFieldSchema();
    const columnSchemas = getColumnSchema(fieldSchema);

    const recursiveRow = getRecursiveRow(field.value, columnSchemas);

    const dataColumns = getDataColumns(
        field.value,
        columnSchemas,
        recursiveRow?.recursiveIndex,
    );

    const rowSelection = getRowSelection(
        field.value,
        columnSchemas,
        recursiveRow?.recursiveIndex,
    );

    const pagination = getPagination(
        field.value.length,
        props.paginaction,
        props.paginationProps,
    );

    const scroll = getScroll(props.scroll);

    const virtual = getVirtual(
        field.value,
        props.scroll,
        props.virtualScroll,
        recursiveRow,
    );

    //递归行，与展开行，只能二选一
    let expandable: ExpandableConfig<any> | undefined;
    if (recursiveRow) {
        expandable = recursiveRow.expandedProps;
    } else {
        expandable = getExpandableRow(field.value, columnSchemas);
    }

    const allClassName = [...rowSelection.className, ...virtual.className];
    return (
        <ArrayContextProvider value={field}>
            <Table
                style={props.style}
                className={allClassName.join(' ') + ' ' + props.className}
                rowKey="_index"
                columns={dataColumns}
                dataSource={virtual.dataSource}
                rowSelection={rowSelection.selection}
                pagination={pagination}
                scroll={scroll}
                expandable={expandable}
                components={{
                    body: {
                        row: rowSelection.rowWrapper,
                    },
                }}
                loading={props.loading}
                size={props.size}
                bordered={props.bordered}
                onRow={virtual.onRow}
                childrenColumnName={recursiveRow ? '_children' : undefined}
            />
            {columnSchemas.map((column) => {
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

MyTable.ExpandableRow = ExpandableRow;

MyTable.RecursiveRow = RecursiveRow;

MyTable.ChildrenRow = ChildrenRow;

MyTable.Index = MyIndex;

MyTable.Remove = MyRemove;

MyTable.MoveUp = MyMoveUp;

MyTable.MoveDown = MyMoveDown;

MyTable.Addition = MyAddition;

MyTable.SubtreeAddition = MySubtreeAddition;

export default MyTable;

//这段代码仅仅为为了生成API文档的
const MyTableTypeForDoc: React.FC<PropsType> = () => {
    return <span />;
};

export { MyTableTypeForDoc };
