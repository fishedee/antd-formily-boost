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

//ChildrenRowRender有两种方法
//根据ColumnSchema渲染子数据
//或者就是空的不渲染
type ChildrenRowRenderType = { type: 'children'; schema: ColumnSchema };

type SplitRowRenderType = {
    type: 'splitRow';
    schema: ColumnSchema;
    level: number;
};

type NormalRenderType = { type: 'normal' };

type NoneRowRenderType = { type: 'none' };

type RowRenderType =
    | NormalRenderType
    | NoneRowRenderType
    | ChildrenRowRenderType
    | SplitRowRenderType;

type SplitRowChildrenType = ColumnSchema & {
    splitLevel: string[];
};

type SplitRowConvertType = {
    type: 'split';
    splitIndex: string[];
};

type NormalConverType = {
    type: 'normal';
};

type RecursiveConvertType = {
    type: 'recursive';
    dataIndex: string;
};

type ChildrenConverType = {
    type: 'children';
    dataIndex: string;
    children: ChildrenConverType | SplitRowConvertType;
};

type DataConvertType =
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
        children: SplitRowChildrenType[];
    };
    dataConvertProps?: DataConvertType;
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
                        children: reduceProperties(schema),
                        splitLevel: [],
                        childrenRowRender: [],
                        ...config,
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
                        startSplitLevel: 0,
                        allSplitIndex: [],
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
                    column.childrenProps!.children,
                );
                childMapColumns.forEach((value, key) => {
                    result.set(key, column);
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
    rowRenderTree: RowRenderTreeType,
) {
    let splitRowColumnList = columnSchema.filter((column) => {
        return column.type == 'splitRow';
    });
    if (splitRowColumnList.length == 0) {
        return;
    }
    let splitRowColumn = splitRowColumnList[0];
    splitRowColumn.splitProps!.allSplitChildren.forEach((single) => {
        rowRenderTree.renderType.set(single.columnProps!.refColumnName!, {
            type: 'splitRow',
            schema: single,
            level: single.splitLevel.length,
        });
    });
    return;
}

function getAllChildrenRowColumn(
    childrenRowSchema: ColumnSchema,
    rowRenderTree: RowRenderTreeType,
): string[] {
    let childrenSchema = childrenRowSchema.childrenProps?.children;

    //获取子层的RowRenderType
    let nestedChildrenIndex: string[] = [];
    if (childrenSchema && childrenSchema.length != 0) {
        let nestedChildrenRowSchema = childrenSchema.filter((column) => {
            return column.type == 'childrenRow';
        });
        if (nestedChildrenRowSchema.length != 0) {
            rowRenderTree.children = {
                renderType: new Map<string, RowRenderType>(),
            };
            nestedChildrenIndex = getAllChildrenRowColumn(
                nestedChildrenRowSchema[0],
                rowRenderTree.children,
            );
        }
    }

    //获取本层的RowRenderType
    if (childrenSchema && childrenSchema.length != 0) {
        //获取SplitRow
        getSplitRowRender(childrenSchema, rowRenderTree);

        //获取普通列
        let refColumns: Map<string, ColumnSchema> = getAllNormalColumn(
            childrenSchema,
            true,
        );
        refColumns.forEach((value, key) => {
            rowRenderTree.renderType.set(key, {
                type: 'children',
                schema: value,
            });
        });
    }

    let childrenIndex = childrenRowSchema.childrenProps?.childrenIndex;
    if (!childrenIndex) {
        throw new Error(childrenRowSchema + '的childrenIndex为空!');
    }

    return [childrenIndex, ...nestedChildrenIndex];
}

function fillRowRenderTreeToNormalColumn(
    rowRenderTree: RowRenderTreeType,
    normalColumn: Map<string, ColumnSchema>,
    currentLevel: number,
) {
    normalColumn.forEach((value, key) => {
        const hasColumnRewrite = rowRenderTree.renderType.has(key);
        if (hasColumnRewrite == false) {
            //没有RenderType
            if (currentLevel == 0) {
                //首层
                value.columnProps?.rowRender.push({
                    type: 'normal',
                });
            } else {
                //非首层
                value.columnProps?.rowRender.push({
                    type: 'none',
                });
            }
        } else {
            //有RenderType
            const currentChildrenRender = rowRenderTree.renderType.get(key);
            value.columnProps?.rowRender.push(currentChildrenRender!);
        }
    });
    //进一步渲染下一级的数据
    if (rowRenderTree.children) {
        fillRowRenderTreeToNormalColumn(
            rowRenderTree.children,
            normalColumn,
            currentLevel + 1,
        );
    }
}

function getAllChildrenRowRender(
    columnSchema: ColumnSchema[],
    rowRenderTree: RowRenderTreeType,
) {
    let childrenColumns = columnSchema.filter((column) => {
        return column.type == 'childrenRow';
    });
    //没有childrenRow
    if (childrenColumns.length == 0) {
        return columnSchema;
    }
    let childrenColumn = childrenColumns[0];

    rowRenderTree.children = {
        renderType: new Map<string, RowRenderType>(),
    };

    let allChildrenIndex = getAllChildrenRowColumn(
        childrenColumn,
        rowRenderTree.children,
    );

    //设置顶层的allChildrenIndex
    childrenColumn.childrenProps!.allChildrenIndex = allChildrenIndex;
}

function combineChildrenRowSchema(
    columnSchema: ColumnSchema[],
): ColumnSchema[] {
    //获取普通列
    let allNormalColumn = getAllNormalColumn(columnSchema);

    let rowRenderTree: RowRenderTreeType = {
        renderType: new Map<string, RowRenderType>(),
    };

    //获取首层的SplitRow的RowRender
    getSplitRowRender(columnSchema, rowRenderTree);

    //获取ChildrenRow，以及包含其中的RowRender，及其嵌套以下的RowRender
    getAllChildrenRowRender(columnSchema, rowRenderTree);

    //将所有RowRender合并到现有的normalColumn上面去
    fillRowRenderTreeToNormalColumn(rowRenderTree, allNormalColumn, 0);

    //原样返回，但是内部数据已经被修改过了
    return columnSchema;
}

//在已知存在外部SplitRow的情况下，校验
function checkSplitRowSchemaInner(
    columnSchema: SplitRowChildrenType[],
    splitLevel: string[],
    allSplitChildren: SplitRowChildrenType[],
) {
    let hasChildrenColumn: boolean = false;
    let hasRecursiveColumn: boolean = false;
    let hasExpandableColumn: boolean = false;

    let splitColumns: SplitRowChildrenType[] = [];
    let normalColumn: SplitRowChildrenType[] = [];

    columnSchema.forEach((column) => {
        if (column.type == 'childrenRow') {
            hasChildrenColumn = true;
        } else if (column.type == 'recursiveRow') {
            hasRecursiveColumn = true;
        } else if (column.type == 'expandableRow') {
            hasExpandableColumn = true;
        } else if (column.type == 'splitRow') {
            splitColumns.push(column);
        } else if (column.type == 'column') {
            normalColumn.push(column);
        }
    });
    for (let i = 0; i != normalColumn.length; i++) {
        normalColumn[i].splitLevel = splitLevel;
        allSplitChildren.push(normalColumn[i]);
    }

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

    checkSplitRowSchemaInner(
        splitColumns[0].splitProps!.children,
        [...splitLevel, splitColumns[0].splitProps!.splitIndex],
        allSplitChildren,
    );
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
        let allSplitChildren: SplitRowChildrenType[] = [];
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
        checkSplitRowSchemaInner(
            splitColumns[0].splitProps!.children,
            [splitColumns[0].splitProps!.splitIndex],
            allSplitChildren,
        );

        //顶层SplitRow的赋值
        let allSplitLevel: string[] = [];
        for (let i = 0; i != allSplitChildren.length; i++) {
            if (allSplitChildren[i].splitLevel.length > allSplitLevel.length) {
                allSplitLevel = allSplitChildren[i].splitLevel;
            }
        }

        splitColumns[0].splitProps!.allSplitChildren = allSplitChildren;
        splitColumns[0].splitProps!.allSplitLevel = allSplitLevel;
    } else {
        //没有SplitRow的情况
        if (childrenColumns.length != 0) {
            //且递归检查ChildrenRow的内部
            checkSplitRowSchema(childrenColumns[0].childrenProps!.children);
        }
    }

    return;
}

function getColumnSchema(schema: Schema): ColumnSchema[] {
    let columnSchema: ColumnSchema[] = getColumnSchemaInner(schema);
    checkSplitRowSchema(columnSchema);
    let combineColumnSchema: ColumnSchema[] =
        combineChildrenRowSchema(columnSchema);
    return combineColumnSchema;
}

export default getColumnSchema;

export { ColumnSchema };
