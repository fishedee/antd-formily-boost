import {
    isColumnType,
    isCheckboxColumnType,
    isRadioColumnType,
    isExpandableRowType,
    isRecursiveRowType,
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

type ColumnSchema = {
    title: string;
    dataIndex: string;
    key: string;
    schema: Schema;
    type: 'column' | 'rowSelectionColumn' | 'expandableRow' | 'recursiveRow';
    columnProps?: ColumnProps & {
        children: ColumnSchema[];
    };
    rowSelectionColumnProps?: {
        type: 'radio' | 'checkbox';
    } & CheckboxColumnProps;
    expandableRrops?: ExpandableRowProps;
    recursiveProps?: RecursiveRowProps;
};

function getColumnSchema(schema: Schema): ColumnSchema[] {
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
            for (let key in ColumnPropsKeys) {
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
                        ...config,
                    },
                },
            ];
        } else if (isCheckboxColumnType(component)) {
            //获取该列的信息
            const config: any = {};
            for (let key in CheckboxColumnPropsKey) {
                config[key] = columnField
                    ? columnField.componentProps?.[key]
                    : schema['x-component-props']?.[key];
            }
            if (!config.dataIndex) {
                config.dataIndex = '_selected';
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
            for (let key in RadioColumnPropsKey) {
                config[key] = columnField
                    ? columnField.componentProps?.[key]
                    : schema['x-component-props']?.[key];
            }
            if (!config.dataIndex) {
                config.dataIndex = '_selected';
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
            for (let key in ExpandableRowPropsKey) {
                config[key] = columnField
                    ? columnField.componentProps?.[key]
                    : schema['x-component-props']?.[key];
            }
            if (!config.dataIndex) {
                config.dataIndex = '_selected';
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
            for (let key in RecursiveRowPropsKey) {
                config[key] = columnField
                    ? columnField.componentProps?.[key]
                    : schema['x-component-props']?.[key];
            }
            if (!config.dataIndex) {
                config.dataIndex = '_selected';
            }
            return [
                {
                    ...columnBase,
                    type: 'recursiveRow',
                    recursiveProps: { ...config },
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

export default getColumnSchema;

export { ColumnSchema };
