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
import { Form } from '@formily/core';

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

function getColumnConfig(
    form: Form<any>,
    fieldAddress: string,
    config: string,
): any {
    if (!config || typeof config != 'string' || config.length == 0) {
        return {};
    }
    let configAddress: string;
    if (config[0] == '.') {
        configAddress = fieldAddress + config;
    } else {
        configAddress = config;
    }
    let result = form.getValuesIn(configAddress);
    if (!result || typeof result != 'object') {
        return {};
    }
    return result;
}

function getColumnSchemaInner(
    schema: Schema,
    columnConfig: string,
): ColumnSchema[] {
    //?????????????????????Column????????????Field
    let itemsSchema: Schema['items'] = schema.items;
    const items = Array.isArray(itemsSchema) ? itemsSchema : [itemsSchema];
    //????????????array???field
    let form = useForm();
    let field = useField();
    let columnConfigObject = getColumnConfig(
        form,
        field.address.toString(),
        columnConfig,
    );
    const getSingleColumnConfig = (
        target: any,
        schema: Schema,
        name: keyof Schema,
    ): any => {
        if (target && typeof target == 'object') {
            let propertyValue = target[name];
            if (propertyValue != undefined) {
                return propertyValue;
            }
        }
        return schema[name];
    };

    const getSingleColumnComponentPropsConfig = (
        target: any,
        schema: Schema,
        name: string,
    ): any => {
        if (target && typeof target == 'object') {
            let componentProps = target['x-component-props'];
            if (componentProps && typeof componentProps == 'object') {
                let propertyValue = componentProps[name];
                if (propertyValue != undefined) {
                    return propertyValue;
                }
            }
        }
        return schema['x-component-props']?.[name];
    };

    const parseSource = (schema: Schema): ColumnSchema[] => {
        //???????????????????????????????????????Column???Field????????????Schema??????????????????
        //?????????????????????????????????field???????????????createField
        //????????????render????????????Field???????????????????????????undefined
        let columnField = columnConfigObject[schema.name!];
        let component = schema['x-component'];
        let isVisible = getSingleColumnConfig(columnField, schema, 'x-visible');
        if (isVisible == false) {
            return [];
        }
        let columnBase = {
            key: schema.name + '',
            dataIndex: schema.name + '',
            title: getSingleColumnConfig(columnField, schema, 'title'),
            schema: schema,
        };
        if (isColumnType(component)) {
            const config: any = {};
            for (let key in new ColumnPropsKeys()) {
                config[key] = getSingleColumnComponentPropsConfig(
                    columnField,
                    schema,
                    key,
                );
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
            //?????????????????????
            const config: any = {};
            for (let key in new CheckboxColumnPropsKey()) {
                config[key] = getSingleColumnComponentPropsConfig(
                    columnField,
                    schema,
                    key,
                );
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
            //?????????????????????
            const config: any = {};
            for (let key in new RadioColumnPropsKey()) {
                config[key] = getSingleColumnComponentPropsConfig(
                    columnField,
                    schema,
                    key,
                );
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
            //?????????????????????
            const config: any = {};
            for (let key in new ExpandableRowPropsKey()) {
                config[key] = getSingleColumnComponentPropsConfig(
                    columnField,
                    schema,
                    key,
                );
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
                config[key] = getSingleColumnComponentPropsConfig(
                    columnField,
                    schema,
                    key,
                );
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
                config[key] = getSingleColumnComponentPropsConfig(
                    columnField,
                    schema,
                    key,
                );
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
                config[key] = getSingleColumnComponentPropsConfig(
                    columnField,
                    schema,
                    key,
                );
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
        //??????items???????????????schema?????????Schema???Void?????????????????????Properties
        if (schema.properties) {
            return schema.reduceProperties((current, schema) => {
                return current.concat(parseSource(schema));
            }, [] as ColumnSchema[]);
        } else {
            return [];
        }
    };
    return items.reduce((current, schema) => {
        //????????????items?????????schema
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
                //????????????
                let columnName: string;
                if (isRefColumn) {
                    columnName = column.columnProps?.refColumnName + '';
                } else {
                    columnName = column.schema.name + '';
                }
                result.set(columnName, column);
            } else {
                //???????????????
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
            //???SplitRow??????SplitRow??????children????????????
            let splitChildInfo = getSplitRowRender(
                splitRowColumn.splitProps.children,
                false,
                level + 1,
            );
            //????????????dataConvert
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
            //???????????????SplitRow??????????????????
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
    //??????SplitRow?????????SplitRow??????children?????????
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
        throw new Error(childrenRowSchema + '???childrenIndex??????!');
    }

    //???????????????RowRender???DataConvert
    let currentLevelInfo = getSplitRowRender(childrenSchema, false, 0);

    if (currentLevelInfo.dataConvert.type == 'split') {
        //????????????SplitRow??????????????????
        let rowRenderTree: RowRenderTreeType = currentLevelInfo.rowRenderTree;
        let dataConvert: DataConvertType = {
            type: 'children',
            dataIndex: childrenIndex,
            children: currentLevelInfo.dataConvert,
        };
        return { rowRenderTree, dataConvert };
    }

    //???????????????RowRenderType
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
            //???RenderType
            const currentChildrenRender = rowRenderTree.renderType.get(key);
            value.columnProps?.rowRender.push(currentChildrenRender!);
        }
    });
    //?????????????????????????????????
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
        //??????childrenRow?????????????????????
        return { rowRenderTree, dataConvert };
    } else {
        //???childrenRow
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
        //??????recursiveRows?????????????????????
        return { rowRenderTree, dataConvert };
    } else {
        //???recursiveRows
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
        return [dataConvert.dataIndex, ...childrenIndex];
    } else {
        return [];
    }
}

function calculateRowRenderAndDataConvert(
    columnSchema: ColumnSchema[],
): ColumnSchema[] {
    //???????????????
    let allNormalColumn = getAllNormalColumn(columnSchema);

    //???????????????SplitRow???RowRender
    let rowRenderAndDataConvert = getSplitRowRender(columnSchema, true, 0);

    //??????ChildrenRow????????????????????????RowRender????????????????????????RowRender
    let rowRenderAndDataConvert2 = getAllChildrenRowRender(
        columnSchema,
        rowRenderAndDataConvert.rowRenderTree,
        rowRenderAndDataConvert.dataConvert,
    );

    //??????RecursiveRow
    let rowRenderAndDataConvert3 = getAllRecursiveRowRender(
        columnSchema,
        rowRenderAndDataConvert2.rowRenderTree,
        rowRenderAndDataConvert2.dataConvert,
    );

    //?????????RowRender??????????????????normalColumn?????????
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

    //??????????????????????????????????????????????????????
    return columnSchema;
}

//?????????????????????SplitRow?????????????????????
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
        throw new Error('SplitRow ??????????????????ChildrenRow');
    }

    if (hasRecursiveColumn) {
        throw new Error('SplitRow ??????????????????RecursiveRow');
    }

    if (hasExpandableColumn) {
        throw new Error('SplitRow ??????????????????ExpandableRow');
    }

    if (splitColumns.length > 1) {
        throw new Error('SplitRow ??????????????????????????????');
    }
    if (splitColumns.length != 0) {
        if (!splitColumns[0].splitProps?.splitIndex) {
            throw new Error('splitIndex ?????????');
        }
        checkSplitRowSchemaInner(splitColumns[0].splitProps!.children);
    }
    return;
}

//???????????????????????????SplitRow?????????????????????
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
        //???SplitRow?????????
        if (hasChildrenColumn) {
            throw new Error('SplitRow ???ChildrenRow?????????????????????');
        }

        if (hasRecursiveColumn) {
            throw new Error('SplitRow ???RecursiveRow?????????????????????');
        }

        if (hasExpandableColumn) {
            throw new Error('SplitRow ???ExpandableRow?????????????????????');
        }
        if (splitColumns.length > 1) {
            throw new Error('SplitRow??????????????????????????????');
        }
        if (!splitColumns[0].splitProps?.splitIndex) {
            throw new Error('splitIndex ?????????');
        }
        checkSplitRowSchemaInner(splitColumns[0].splitProps!.children);
    } else {
        //??????SplitRow?????????
        if (childrenColumns.length != 0) {
            //???????????????ChildrenRow?????????
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

function getTableConfig(schema: Schema, columnConfig: string): TableConfig {
    let columnSchema: ColumnSchema[] = getColumnSchemaInner(
        schema,
        columnConfig,
    );
    checkSplitRowSchema(columnSchema);
    let combineColumnSchema: ColumnSchema[] =
        calculateRowRenderAndDataConvert(columnSchema);

    let config: TableConfig = convertToTableConfig(combineColumnSchema);

    return config;
}

export default getTableConfig;

export { ColumnSchema };
