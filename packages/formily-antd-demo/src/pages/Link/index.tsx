import { createForm, onFieldInputValueChange } from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import { Label, Table } from 'formily-antd';
import { Form, FormItem, Input, Select, Space } from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import 'antd/dist/antd.css';

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
    Table,
    Label,
  },
});

export default () => {
  return (
    <Space
      style={{
        background: 'rgb(240, 242, 245)',
        padding: '20px',
        display: 'flex',
      }}
      direction="vertical"
      size={10}
    >
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
                    width: '50%',
                  }}
                >
                  <SchemaField.String
                    name="name"
                    required={true}
                    x-component={'Input'}
                    x-decorator="FormItem"
                  />
                </SchemaField.Void>

                <SchemaField.Void
                  x-component="Table.Column"
                  x-component-props={{
                    title: '年龄',
                    width: '50%',
                  }}
                >
                  <SchemaField.String name="age" x-component={'Label'} />
                </SchemaField.Void>
              </SchemaField.Void>
            </SchemaField.Array>
          </SchemaField>
        </Form>
      </ProCard>

      <ProCard title="数据">
        <Form form={form} feedbackLayout="terse">
          <FormConsumer>
            {() => <div>{JSON.stringify(form.values)}</div>}
          </FormConsumer>
        </Form>
      </ProCard>
    </Space>
  );
};