import { RecursionField, useField, useForm } from '@formily/react';
import { Schema, useFieldSchema } from '@formily/react';
import { observable } from '@formily/reactive';
import { observer } from '@formily/reactive-react';
import { Divider } from 'antd';
import React, { Children, Fragment } from 'react';

type SpaceDividerProps = {
    type?: 'vertical' | 'horizontal';
};

type Column = {
    visible?: boolean;
    schema: Schema;
    name: string;
};
//所有Column都要拿出来，即使visible为false，因为Column的隐藏状态时，也要createField，使得它的effects能运行起来
function getColumns(schema: Schema): Column[] {
    const form = useForm();
    const field = useField();
    const parseSource = (schema: Schema): Column[] => {
        let columnField = field.query('.' + schema.name).take();
        let isVisible = columnField ? columnField.visible : schema['x-visible'];
        return [
            {
                visible: isVisible,
                schema: schema,
                name: schema.name + '',
            },
        ];
    };
    const reduceProperties = (schema: Schema): Column[] => {
        //对于items里面的每个schema，每个Schema为Void字段，遍历它的Properties
        if (schema.properties) {
            return schema.reduceProperties((current, preSchema) => {
                return current.concat(parseSource(preSchema));
            }, [] as Column[]);
        } else {
            return [];
        }
    };
    return reduceProperties(schema);
}

//需要属于Void类型的组件，但是依然使用自己解析schema。因为该组件只在visible的子组件之间插入Divider
const SpaceDivider: React.FC<SpaceDividerProps> = observer((props) => {
    let type = props.type ? props.type : 'vertical';
    const schema = useFieldSchema();
    const columns: Column[] = getColumns(schema);
    let result = [];
    let showIndex = 0;
    for (var i = 0; i != columns.length; i++) {
        let isShow = columns[i].visible === true;
        if (isShow && showIndex != 0) {
            result.push(<Divider type={type} key={'_divider_' + i} />);
        }
        if (isShow) {
            showIndex++;
        }
        let single = columns[i];
        result.push(
            <RecursionField
                key={'_field_' + single.name}
                name={single.name}
                schema={single.schema}
            />
        );
    }
    return <Fragment>{result}</Fragment>;
});

export default SpaceDivider;
