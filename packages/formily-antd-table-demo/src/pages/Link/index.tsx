import { createForm, onFieldInputValueChange } from '@formily/core';
import {
  createSchemaField,
  Field,
  FormConsumer,
  ObjectField,
} from '@formily/react';
import FormilyAntdTable from 'formily-antd-table';
import { Form, FormItem, Input, Select, PreviewText } from '@formily/antd';
import ProCard from '@ant-design/pro-card';

const form = createForm({
  initialValues: {
    data: [
      {
        name: 'fish',
        age: 123,
      },
      {
        name: 'cat',
        age: 456,
      },
      {
        name: 'dog',
        age: 789,
      },
    ],
  },
  effects: () => {},
});

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    Table: FormilyAntdTable,
  },
});

export default () => {
  return (
    <div style={{ background: 'rgb(240, 242, 245)', padding: '20px' }}>
      <ProCard title="基础">
        <Form form={form} feedbackLayout="terse">
          <SchemaField>
            <SchemaField.Array name="data" x-component="Table">
              <SchemaField.Void>
                <SchemaField.Void
                  name="firstColumn"
                  x-component="Table.Column"
                  x-component-props={{
                    title: '名字',
                    width: '100px',
                  }}
                >
                  <SchemaField.String name="name" x-component={'Table.Text'} />
                </SchemaField.Void>

                <SchemaField.Void
                  x-component="Table.Column"
                  x-component-props={{
                    title: '年龄',
                  }}
                >
                  <SchemaField.String name="age" x-component={'Table.Text'} />
                </SchemaField.Void>
              </SchemaField.Void>
            </SchemaField.Array>
          </SchemaField>
          <FormConsumer>
            {() => <div>{JSON.stringify(form.values)}</div>}
          </FormConsumer>
        </Form>
      </ProCard>
    </div>
  );
};
