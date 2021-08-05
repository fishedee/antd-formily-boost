import { RecursionField, useField, useForm } from '@formily/react';
import { Schema, useFieldSchema } from '@formily/react';
import { observable } from '@formily/reactive';
import { observer } from '@formily/reactive-react';
import { Divider } from 'antd';
import React, { Children, Fragment } from 'react';

type SpaceDividerProps = {
    type?: 'vertical' | 'horizontal';
};

function getColumns(schema: Schema): Schema[] {
    const form = useForm();
    const field = useField();
    const parseSource = (schema: Schema): Schema[] => {
        let columnField = form.query(field.address + '.' + schema.name).take();
        let isVisible = columnField ? columnField.visible : schema['x-visible'];
        if (isVisible === false) {
            return [];
        }
        return [schema];
    };
    const reduceProperties = (schema: Schema): Schema[] => {
        //对于items里面的每个schema，每个Schema为Void字段，遍历它的Properties
        if (schema.properties) {
            return schema.reduceProperties((current, preSchema) => {
                return current.concat(parseSource(preSchema));
            }, [] as Schema[]);
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
    const properties: Schema[] = getColumns(schema);
    let result = [];
    for (var i = 0; i != properties.length; i++) {
        if (i != 0) {
            result.push(<Divider type={type} key={'_divider_' + i} />);
        }
        let single = properties[i];
        result.push(
            <RecursionField
                key={'_field_' + single.name}
                name={single.name}
                schema={single}
            />
        );
    }
    return <Fragment>{result}</Fragment>;
});

export default SpaceDivider;
