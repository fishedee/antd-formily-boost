import {
    isColumnType,
    isCheckboxColumnType,
    isRadioColumnType,
    isExpandableRowType,
    isRecursiveRowType,
    isChildrenRowType,
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

//ChildrenRowRender有两种方法
//根据ColumnSchema渲染子数据
//或者就是空的不渲染
type ChildrenRowRenderType = ColumnSchema | undefined;

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
        | 'childrenRow';
    columnProps?: ColumnProps & {
        childrenRowRender: ChildrenRowRenderType[];
        children: ColumnSchema[];
    };
    rowSelectionColumnProps?: {
        type: 'radio' | 'checkbox';
    } & CheckboxColumnProps;
    expandableRrops?: ExpandableRowProps;
    recursiveProps?: RecursiveRowProps;
    childrenProps?: ChildrenRowProps & {
        children: ColumnSchema[];
        allChildrenIndex: string[];
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
                        children: reduceProperties(schema),
                        childrenRowSchema: [],
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
    columnSchema: ColumnSchema[]
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
                let refColumnName = column.columnProps?.refColumnName;
                let columnName =
                    refColumnName && refColumnName != ''
                        ? refColumnName
                        : column.schema.name + '';

                result.set(columnName, column);
            } else {
                //非叶子节点
                let childMapColumns = getAllNormalColumn(
                    column.childrenProps!.children
                );
                childMapColumns.forEach((value, key) => {
                    result.set(key, column);
                });
            }
        }
    }
    return result;
}

type ChildrenRowColumn = {
    childrenIndex: string;
    allChildrenIndex: string[];
    refColumns: Map<string, ColumnSchema>;
    children?: ChildrenRowColumn;
};

function getAllChildrenRowColumn(
    childrenRowSchema: ColumnSchema
): ChildrenRowColumn {
    let childrenSchema = childrenRowSchema.childrenProps?.children;
    let nestedChildren: ChildrenRowColumn | undefined;

    //获取子ChildrenRowSchema
    if (childrenSchema && childrenSchema.length != 0) {
        let nestedChildrenRowSchema = childrenSchema.filter((column) => {
            return column.type == 'childrenRow';
        });
        if (nestedChildrenRowSchema.length != 0) {
            nestedChildren = getAllChildrenRowColumn(
                nestedChildrenRowSchema[0]
            );
        }
    }

    //获取普通的Schema
    let refColumns = new Map<string, ColumnSchema>();
    if (childrenSchema && childrenSchema.length != 0) {
        refColumns = getAllNormalColumn(childrenSchema);
    }

    let childrenIndex = childrenRowSchema.childrenProps?.childrenIndex;
    if (!childrenIndex) {
        throw new Error(childrenRowSchema + '的childrenIndex为空!');
    }

    let allChildrenIndex: string[] = [childrenIndex];
    if (nestedChildren) {
        allChildrenIndex = allChildrenIndex.concat(
            nestedChildren.allChildrenIndex
        );
    }

    return {
        childrenIndex: childrenIndex,
        allChildrenIndex: allChildrenIndex,
        refColumns: refColumns,
        children: nestedChildren,
    };
}

function fillChildrenRowColumnToNormalColumn(
    parent: ChildrenRowColumn,
    normalColumn: Map<string, ColumnSchema>
) {
    normalColumn.forEach((value, key) => {
        const hasColumnRewrite = parent.refColumns.has(key);
        if (hasColumnRewrite == false) {
            //没有该数据的时候，填充undefined，不渲染
            value.columnProps?.childrenRowRender.push(undefined);
        } else {
            //有该数据的时候，填充Schema进去
            const currentChildrenRender = parent.refColumns.get(key);
            value.columnProps?.childrenRowRender.push(currentChildrenRender);
        }
    });
    //进一步渲染下一级的数据
    if (parent.children) {
        fillChildrenRowColumnToNormalColumn(parent.children, normalColumn);
    }
}

function combineChildrenRowSchema(
    columnSchema: ColumnSchema[]
): ColumnSchema[] {
    let childrenColumns = columnSchema.filter((column) => {
        return column.type == 'childrenRow';
    });
    //没有childrenRow
    if (childrenColumns.length == 0) {
        return columnSchema;
    }
    let childrenColumn = childrenColumns[0];
    let allNormalColumn = getAllNormalColumn(columnSchema);
    let allChildrenRowColumn = getAllChildrenRowColumn(childrenColumn);

    //将childrenRowColumn的信息填充进去
    fillChildrenRowColumnToNormalColumn(allChildrenRowColumn, allNormalColumn);

    //设置顶层的allChildrenIndex
    childrenColumn.childrenProps!.allChildrenIndex =
        allChildrenRowColumn.allChildrenIndex;

    //原样返回，但是内部数据已经被修改过了
    return columnSchema;
}
function getColumnSchema(schema: Schema): ColumnSchema[] {
    let columnSchema: ColumnSchema[] = getColumnSchemaInner(schema);
    let combineColumnSchema: ColumnSchema[] =
        combineChildrenRowSchema(columnSchema);
    return combineColumnSchema;
}

export default getColumnSchema;

export { ColumnSchema };
