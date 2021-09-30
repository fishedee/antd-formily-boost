import {
    isColumnType,
    isCheckboxColumnType,
    isRadioColumnType,
    isExpandableRowType,
    isRecursiveRowType,
    isChildrenRowType,
    isSplitRowType,
} from '../components/IsType';

import { Schema, useField, useForm } from '@formily/react';
import { ColumnProps, ColumnPropsKeys } from '../components/Column';
import {
    CheckboxColumnProps,
    CheckboxColumnPropsKey,
} from '../components/CheckboxColumn';
import {
    ExpandableRowProps,
    ExpandableRowPropsKey,
} from '../components/ExpandableRow';
import {
    RecursiveRowProps,
    RecursiveRowPropsKey,
} from '../components/RecursiveRow';
import { RadioColumnPropsKey } from '../components/RadioColumn';
import {
    ChildrenRowProps,
    ChildrenRowPropsKey,
} from '../components/ChildrenRow';
import { SplitRowProps, SplitRowPropsKey } from '../components/SplitRow';
import { ExpandableConfig } from 'rc-table/lib/interface';

export type SplitRowRenderType = {
    type: 'splitRow';
    schema: ColumnSchema;
    level: number;
};

export type NormalRenderType = { type: 'normal'; schema: ColumnSchema };

export type NoneRowRenderType = { type: 'none' };

export type RowRenderType =
    | NormalRenderType
    | NoneRowRenderType
    | SplitRowRenderType;

export type SplitRowConvertType = {
    type: 'split';
    splitIndex: string[];
};

export type NormalConverType = {
    type: 'normal';
};

export type RecursiveConvertType = {
    type: 'recursive';
    dataIndex: string;
};

export type ChildrenConverType = {
    type: 'children';
    dataIndex: string;
    children: ChildrenConverType | SplitRowConvertType | NormalConverType;
};

export type DataConvertType =
    | NormalConverType
    | SplitRowConvertType
    | RecursiveConvertType
    | ChildrenConverType;

type ColumnSchema = {
    title: string;
    dataIndex: string;
    key: string;
    schema: Schema;
    type:
        | 'column'
        | 'rowSelectionColumn'
        | 'expandableRow'
        | 'recursiveRow'
        | 'childrenRow'
        | 'splitRow'
        | 'dataConvert';
    columnProps?: ColumnProps & {
        rowRender: RowRenderType[];
        children: ColumnSchema[];
    };
    rowSelectionColumnProps?: {
        type: 'radio' | 'checkbox';
    } & CheckboxColumnProps;
    expandableRrops?: ExpandableRowProps;
    recursiveProps?: RecursiveRowProps;
    childrenProps?: ChildrenRowProps & {
        children: ColumnSchema[];
    };
    splitProps?: SplitRowProps & {
        children: ColumnSchema[];
    };
    dataConvertProps?: {
        tree: DataConvertType;
        list: string[];
    };
};

function getColumnSchemaInner(schema: Schema): ColumnSchema[] {
    //在当前实现中，Column层看成是Field
    let itemsSchema: Schema['items'] = schema.items;
    const items = Array.isArray(itemsSchema) ? itemsSchema : [itemsSchema];
    //获取当前array的field
    let form = useForm();
    let field = useField();
    const parseSource = (schema: Schema): ColumnSchema[] => {
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
            const config: any = {};
            for (let key in new ColumnPropsKeys()) {
                config[key] = columnField
                    ? columnField.componentProps?.[key]
                    : schema['x-component-props']?.[key];
            }
            return [
                {
                    ...columnBase,
                    type: 'column',
                    columnProps: {
                        ...config,
                        rowRender: [],
                        children: reduceProperties(schema),
                    },
                },
            ];
        } else if (isCheckboxColumnType(component)) {
            //获取该列的信息
            const config: any = {};
            for (let key in new CheckboxColumnPropsKey()) {
                config[key] = columnField
                    ? columnField.componentProps?.[key]
                    : schema['x-component-props']?.[key];
            }
            if (!config.selectedIndex) {
                config.selectedIndex = '_selected';
            }
            if (!config.checkStrictly) {
                config.checkStrictly = false;
            }
            return [
                {
                    ...columnBase,
                    type: 'rowSelectionColumn',
                    rowSelectionColumnProps: {
                        type: 'checkbox',
                        ...config,
                    },
                },
            ];
        } else if (isRadioColumnType(component)) {
            //获取该列的信息
            const config: any = {};
            for (let key in new RadioColumnPropsKey()) {
                config[key] = columnField
                    ? columnField.componentProps?.[key]
                    : schema['x-component-props']?.[key];
            }
            if (!config.selectedIndex) {
                config.selectedIndex = '_selected';
            }
            return [
                {
                    ...columnBase,
                    type: 'rowSelectionColumn',
                    rowSelectionColumnProps: {
                        type: 'radio',
                        ...config,
                    },
                },
            ];
        } else if (isExpandableRowType(component)) {
            //获取该列的信息
            const config: any = {};
            for (let key in new ExpandableRowPropsKey()) {
                config[key] = columnField
                    ? columnField.componentProps?.[key]
                    : schema['x-component-props']?.[key];
            }
            if (!config.expandedIndex) {
                config.expandedIndex = '_expanded';
            }
            return [
                {
                    ...columnBase,
                    type: 'expandableRow',
                    expandableRrops: { ...config },
                },
            ];
        } else if (isRecursiveRowType(component)) {
            const config: any = {};
            for (let key in new RecursiveRowPropsKey()) {
                config[key] = columnField
                    ? columnField.componentProps?.[key]
                    : schema['x-component-props']?.[key];
            }
            if (!config.expandedIndex) {
                config.expandedIndex = '_expanded';
            }
            return [
                {
                    ...columnBase,
                    type: 'recursiveRow',
                    recursiveProps: { ...config },
                },
            ];
        } else if (isChildrenRowType(component)) {
            const config: any = {};
            for (let key in new ChildrenRowPropsKey()) {
                config[key] = columnField
                    ? columnField.componentProps?.[key]
                    : schema['x-component-props']?.[key];
            }
            if (!config.expandedIndex) {
                config.expandedIndex = '_expanded';
            }
            return [
                {
                    ...columnBase,
                    type: 'childrenRow',
                    childrenProps: {
                        ...config,
                        children: reduceProperties(schema),
                    },
                },
            ];
        } else if (isSplitRowType(component)) {
            const config: any = {};
            for (let key in new SplitRowPropsKey()) {
                config[key] = columnField
                    ? columnField.componentProps?.[key]
                    : schema['x-component-props']?.[key];
            }
            return [
                {
                    ...columnBase,
                    type: 'splitRow',
                    splitProps: {
                        ...config,
                        children: reduceProperties(schema),
                    },
                },
            ];
        }
        return [];
    };
    const reduceProperties = (schema: Schema): ColumnSchema[] => {
        //对于items里面的每个schema，每个Schema为Void字段，遍历它的Properties
        if (schema.properties) {
            return schema.reduceProperties((current, schema) => {
                return current.concat(parseSource(schema));
            }, [] as ColumnSchema[]);
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
    }, [] as ColumnSchema[]);
}

function getAllNormalColumn(
    columnSchema: ColumnSchema[],
    isRefColumn?: boolean,
): Map<string, ColumnSchema> {
    let result = new Map<string, ColumnSchema>();
    for (let i = 0; i != columnSchema.length; i++) {
        let column = columnSchema[i];
        if (column.type == 'column') {
            if (
                !column.columnProps ||
                column.columnProps.children.length == 0
            ) {
                //叶子节点
                let columnName: string;
                if (isRefColumn) {
                    columnName = column.columnProps?.refColumnName + '';
                } else {
                    columnName = column.schema.name + '';
                }
                result.set(columnName, column);
            } else {
                //非叶子节点
                let childMapColumns = getAllNormalColumn(
                    column.columnProps.children,
                );
                childMapColumns.forEach((value, key) => {
                    result.set(key, value);
                });
            }
        }
    }
    return result;
}

type RowRenderTreeType = {
    renderType: Map<string, RowRenderType>;
    children?: RowRenderTreeType;
};

function getSplitRowRender(
    columnSchema: ColumnSchema[],
    isTopParent: boolean,
    level: number,
): {
    rowRenderTree: RowRenderTreeType;
    dataConvert: SplitRowConvertType | NormalConverType;
} {
    let splitRowColumnList = columnSchema.filter((column) => {
        return column.type == 'splitRow';
    });

    if (splitRowColumnList.length != 0) {
        let splitRowColumn = splitRowColumnList[0];
        const splitIndex: string = splitRowColumn.splitProps!.splitIndex;
        if (
            splitRowColumn.splitProps &&
            splitRowColumn.splitProps.children.length != 0
        ) {
            //有SplitRow，且SplitRow下的children不是空的
            let splitChildInfo = getSplitRowRender(
                splitRowColumn.splitProps.children,
                false,
                level + 1,
            );
            //计算一下dataConvert
            let dataConvert: SplitRowConvertType = {
                type: 'split',
                splitIndex: [],
            };
            if (splitChildInfo.dataConvert.type == 'normal') {
                dataConvert = {
                    type: 'split',
                    splitIndex: [splitIndex],
                };
            } else {
                dataConvert = {
                    type: 'split',
                    splitIndex: [
                        splitIndex,
                        ...splitChildInfo.dataConvert.splitIndex,
                    ],
                };
            }
            //将子树上的SplitRow合并到本层上
            let rowRenderTree: RowRenderTreeType = {
                renderType: new Map<string, RowRenderType>(),
            };
            let normalSchema = getAllNormalColumn(columnSchema, !isTopParent);
            normalSchema.forEach((value, key) => {
                rowRenderTree.renderType.set(key, {
                    type: 'splitRow',
                    schema: value,
                    level: dataConvert.splitIndex.length,
                });
            });
            splitChildInfo.rowRenderTree.renderType.forEach((value, key) => {
                rowRenderTree.renderType.set(key, value);
            });
            return {
                rowRenderTree: rowRenderTree,
                dataConvert: dataConvert,
            };
        }
    }
    //没有SplitRow，或者SplitRow下的children是空的
    let rowRenderTree: RowRenderTreeType = {
        renderType: new Map<string, RowRenderType>(),
    };
    let normalSchema = getAllNormalColumn(columnSchema, !isTopParent);
    normalSchema.forEach((value, key) => {
        rowRenderTree.renderType.set(key, {
            type: 'normal',
            schema: value,
        });
    });
    let dataConvert: DataConvertType = {
        type: 'normal',
    };
    return { rowRenderTree, dataConvert };
}

function getSingleChildrenRowRender(childrenRowSchema: ColumnSchema): {
    rowRenderTree: RowRenderTreeType;
    dataConvert: ChildrenConverType;
} {
    let childrenIndex = childrenRowSchema.childrenProps!.childrenIndex;
    let childrenSchema = childrenRowSchema.childrenProps!.children;
    if (!childrenIndex) {
        throw new Error(childrenRowSchema + '的childrenIndex为空!');
    }

    //获取本层的RowRender与DataConvert
    let currentLevelInfo = getSplitRowRender(childrenSchema, false, 0);

    if (currentLevelInfo.dataConvert.type == 'split') {
        //本层含有SplitRow的，立即返回
        let rowRenderTree: RowRenderTreeType = currentLevelInfo.rowRenderTree;
        let dataConvert: DataConvertType = {
            type: 'children',
            dataIndex: childrenIndex,
            children: currentLevelInfo.dataConvert,
        };
        return { rowRenderTree, dataConvert };
    }

    //获取子层的RowRenderType
    let nestedChildrenRowSchema = childrenSchema.filter((column) => {
        return column.type == 'childrenRow';
    });
    if (nestedChildrenRowSchema.length != 0) {
        let nestedLevelInfo = getSingleChildrenRowRender(
            nestedChildrenRowSchema[0],
        );
        let rowRenderTree: RowRenderTreeType = {
            renderType: currentLevelInfo.rowRenderTree.renderType,
            children: nestedLevelInfo.rowRenderTree,
        };
        let dataConvert: DataConvertType = {
            type: 'children',
            dataIndex: childrenIndex,
            children: nestedLevelInfo.dataConvert,
        };

        return { rowRenderTree, dataConvert };
    } else {
        let rowRenderTree: RowRenderTreeType = currentLevelInfo.rowRenderTree;
        let dataConvert: DataConvertType = {
            type: 'children',
            dataIndex: childrenIndex,
            children: currentLevelInfo.dataConvert,
        };
        return { rowRenderTree, dataConvert };
    }
}

function fillRowRenderTreeToNormalColumn(
    rowRenderTree: RowRenderTreeType,
    normalColumn: Map<string, ColumnSchema>,
) {
    normalColumn.forEach((value, key) => {
        const hasColumnRewrite = rowRenderTree.renderType.has(key);
        if (hasColumnRewrite == false) {
            value.columnProps?.rowRender.push({
                type: 'none',
            });
        } else {
            //有RenderType
            const currentChildrenRender = rowRenderTree.renderType.get(key);
            value.columnProps?.rowRender.push(currentChildrenRender!);
        }
    });
    //进一步渲染下一级的数据
    if (rowRenderTree.children) {
        fillRowRenderTreeToNormalColumn(rowRenderTree.children, normalColumn);
    }
}

function getAllChildrenRowRender(
    columnSchema: ColumnSchema[],
    rowRenderTree: RowRenderTreeType,
    dataConvert: DataConvertType,
): {
    rowRenderTree: RowRenderTreeType;
    dataConvert: DataConvertType;
} {
    let childrenColumns = columnSchema.filter((column) => {
        return column.type == 'childrenRow';
    });
    if (childrenColumns.length == 0) {
        //没有childrenRow，那就返回自身
        return { rowRenderTree, dataConvert };
    } else {
        //有childrenRow
        let childrenColumn = childrenColumns[0];

        let rowRenderInfo = getSingleChildrenRowRender(childrenColumn);

        let newRowRenderTree: RowRenderTreeType = {
            renderType: rowRenderTree.renderType,
            children: rowRenderInfo.rowRenderTree,
        };
        return {
            rowRenderTree: newRowRenderTree,
            dataConvert: rowRenderInfo.dataConvert,
        };
    }
}

function getAllRecursiveRowRender(
    columnSchema: ColumnSchema[],
    rowRenderTree: RowRenderTreeType,
    dataConvert: DataConvertType,
): {
    rowRenderTree: RowRenderTreeType;
    dataConvert: DataConvertType;
} {
    let recursiveRows = columnSchema.filter((column) => {
        return column.type == 'recursiveRow';
    });
    if (recursiveRows.length == 0) {
        //没有recursiveRows，那就返回自身
        return { rowRenderTree, dataConvert };
    } else {
        //有recursiveRows
        let recursiveRow = recursiveRows[0];
        let dataConvert: DataConvertType = {
            type: 'recursive',
            dataIndex: recursiveRow.recursiveProps!.recursiveIndex,
        };
        return { rowRenderTree, dataConvert };
    }
}

function convertDataConvertTreeToList(dataConvert: DataConvertType): string[] {
    if (dataConvert.type == 'children') {
        let childrenIndex: string[] = [];
        if (dataConvert.children) {
            childrenIndex = convertDataConvertTreeToList(dataConvert.children);
        }
        return dataConvert.dataIndex, [...childrenIndex];
    } else {
        return [];
    }
}

function calculateRowRenderAndDataConvert(
    columnSchema: ColumnSchema[],
): ColumnSchema[] {
    //获取普通列
    let allNormalColumn = getAllNormalColumn(columnSchema);

    //获取首层的SplitRow的RowRender
    let rowRenderAndDataConvert = getSplitRowRender(columnSchema, true, 0);

    //获取ChildrenRow，以及包含其中的RowRender，及其嵌套以下的RowRender
    let rowRenderAndDataConvert2 = getAllChildrenRowRender(
        columnSchema,
        rowRenderAndDataConvert.rowRenderTree,
        rowRenderAndDataConvert.dataConvert,
    );

    //获取RecursiveRow
    let rowRenderAndDataConvert3 = getAllRecursiveRowRender(
        columnSchema,
        rowRenderAndDataConvert2.rowRenderTree,
        rowRenderAndDataConvert2.dataConvert,
    );

    //将所有RowRender合并到现有的normalColumn上面去
    fillRowRenderTreeToNormalColumn(
        rowRenderAndDataConvert3.rowRenderTree,
        allNormalColumn,
    );

    columnSchema.push({
        type: 'dataConvert',
        title: '',
        key: '',
        dataIndex: '',
        schema: new Schema({}),
        dataConvertProps: {
            tree: rowRenderAndDataConvert3.dataConvert,
            list: convertDataConvertTreeToList(
                rowRenderAndDataConvert3.dataConvert,
            ),
        },
    });

    //原样返回，但是内部数据已经被修改过了
    return columnSchema;
}

//在已知存在外部SplitRow的情况下，校验
function checkSplitRowSchemaInner(columnSchema: ColumnSchema[]) {
    let hasChildrenColumn: boolean = false;
    let hasRecursiveColumn: boolean = false;
    let hasExpandableColumn: boolean = false;

    let splitColumns: ColumnSchema[] = [];

    columnSchema.forEach((column) => {
        if (column.type == 'childrenRow') {
            hasChildrenColumn = true;
        } else if (column.type == 'recursiveRow') {
            hasRecursiveColumn = true;
        } else if (column.type == 'expandableRow') {
            hasExpandableColumn = true;
        } else if (column.type == 'splitRow') {
            splitColumns.push(column);
        }
    });

    if (hasChildrenColumn) {
        throw new Error('SplitRow 内部不能包含ChildrenRow');
    }

    if (hasRecursiveColumn) {
        throw new Error('SplitRow 内部不能包含RecursiveRow');
    }

    if (hasExpandableColumn) {
        throw new Error('SplitRow 内部不能包含ExpandableRow');
    }

    if (splitColumns.length > 1) {
        throw new Error('SplitRow 在同一层级只能有一个');
    }
    if (splitColumns.length != 0) {
        if (!splitColumns[0].splitProps?.splitIndex) {
            throw new Error('splitIndex 是空的');
        }
        checkSplitRowSchemaInner(splitColumns[0].splitProps!.children);
    }
    return;
}

//在未知是否存在外部SplitRow的情况下，校验
function checkSplitRowSchema(columnSchema: ColumnSchema[]) {
    let hasChildrenColumn: boolean = false;
    let hasRecursiveColumn: boolean = false;
    let hasExpandableColumn: boolean = false;

    let childrenColumns: ColumnSchema[] = [];
    let splitColumns: ColumnSchema[] = [];

    columnSchema.forEach((column) => {
        if (column.type == 'childrenRow') {
            hasChildrenColumn = true;
            childrenColumns.push(column);
        } else if (column.type == 'recursiveRow') {
            hasRecursiveColumn = true;
        } else if (column.type == 'expandableRow') {
            hasExpandableColumn = true;
        } else if (column.type == 'splitRow') {
            splitColumns.push(column);
        }
    });
    if (splitColumns.length != 0) {
        //有SplitRow的情况
        if (hasChildrenColumn) {
            throw new Error('SplitRow 与ChildrenRow不能在同一层级');
        }

        if (hasRecursiveColumn) {
            throw new Error('SplitRow 与RecursiveRow不能在同一层级');
        }

        if (hasExpandableColumn) {
            throw new Error('SplitRow 与ExpandableRow不能在同一层级');
        }
        if (splitColumns.length > 1) {
            throw new Error('SplitRow在同一层级只能有一个');
        }
        if (!splitColumns[0].splitProps?.splitIndex) {
            throw new Error('splitIndex 是空的');
        }
        checkSplitRowSchemaInner(splitColumns[0].splitProps!.children);
    } else {
        //没有SplitRow的情况
        if (childrenColumns.length != 0) {
            //且递归检查ChildrenRow的内部
            checkSplitRowSchema(childrenColumns[0].childrenProps!.children);
        }
    }

    return;
}

type CommonExpandedProps = {
    indentSize: number;
    expandedIndex: string;
    defaultExpand: boolean;
    expandedConfig: ExpandableConfig<any>;
};
export type TableConfig = {
    allColumn: ColumnSchema[];
    renderColumn: ColumnSchema[];
    dataConvertProps: {
        tree: DataConvertType;
        list: string[];
    };
    commonExpandedProps?: CommonExpandedProps;
    rowSelectionColumn?: ColumnSchema;
    expandableColumn?: ColumnSchema;
    recursiveColumn?: ColumnSchema;
    childrenColumn?: ColumnSchema;
};

function convertToTableConfig(columnSchema: ColumnSchema[]): TableConfig {
    let result: TableConfig = {
        allColumn: [],
        renderColumn: [],
        dataConvertProps: {
            tree: { type: 'normal' },
            list: [],
        },
    };
    columnSchema.forEach((column) => {
        if (column.type == 'childrenRow') {
            result.childrenColumn = column;
        } else if (column.type == 'recursiveRow') {
            result.recursiveColumn = column;
        } else if (column.type == 'expandableRow') {
            result.expandableColumn = column;
        } else if (column.type == 'dataConvert') {
            result.dataConvertProps = column.dataConvertProps!;
        } else if (column.type == 'rowSelectionColumn') {
            result.rowSelectionColumn = column;
        } else if (column.type == 'column') {
            result.renderColumn.push(column);
        }

        if (column.type != 'dataConvert') {
            result.allColumn.push(column);
        }
    });
    if (result.childrenColumn) {
        result.commonExpandedProps = {
            indentSize: result.childrenColumn.childrenProps!.indentSize!,
            expandedIndex: result.childrenColumn.childrenProps!.expandedIndex!,
            defaultExpand: result.childrenColumn.childrenProps!.defaultExpand!,
            expandedConfig: result.childrenColumn.childrenProps!,
        };
    }
    if (result.recursiveColumn) {
        result.commonExpandedProps = {
            indentSize: result.recursiveColumn.recursiveProps!.indentSize!,
            expandedIndex:
                result.recursiveColumn.recursiveProps!.expandedIndex!,
            defaultExpand:
                result.recursiveColumn.recursiveProps!.defaultExpand!,
            expandedConfig: result.recursiveColumn.recursiveProps!,
        };
    }
    return result;
}

function getTableConfig(schema: Schema): TableConfig {
    let columnSchema: ColumnSchema[] = getColumnSchemaInner(schema);
    checkSplitRowSchema(columnSchema);
    let combineColumnSchema: ColumnSchema[] =
        calculateRowRenderAndDataConvert(columnSchema);

    let config: TableConfig = convertToTableConfig(combineColumnSchema);

    return config;
}

export default getTableConfig;

export { ColumnSchema };
