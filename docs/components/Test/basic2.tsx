import {
    observer,
    FormConsumer,
    Field,
    ObjectField,
    ArrayField,
} from '@formily/react';
import { Input, FormItem, Form } from '@formily/antd';
import { useMemo } from 'react';
import { createForm } from '@formily/core';
import { Space } from 'antd';
import React from 'react';
import { observable } from '@formily/reactive';

const MyTree: React.FC<any> = observer((props) => {
    let onClick = () => {
        props.pageData.current++;
    };

    return (
        <span>
            <button onClick={onClick}>点我</button>
            <div>{props.pageData.current}</div>
        </span>
    );
});

let lastState: { data: any; paginaction: any } = observable({
    data: [],
    current: 1,
    pageSize: 10,
});

for (var i = 0; i != 10; i++) {
    lastState.data.push({
        name: 'fish_' + i,
        age: i,
    });
}

const Test1: React.FC<any> = (props) => {
    const form = useMemo(() => {
        return createForm({
            values: lastState,
        });
    }, []);
    return (
        <Form form={form} feedbackLayout={'none'}>
            <ObjectField name="where" decorator={[Space]}>
                <ArrayField
                    name="data"
                    title="数组"
                    decorator={[FormItem]}
                    component={[
                        MyTree,
                        {
                            pageData: lastState,
                        },
                    ]}
                />
            </ObjectField>
            <FormConsumer>{(data) => JSON.stringify(data.values)}</FormConsumer>
        </Form>
    );
};

export default Test1;
