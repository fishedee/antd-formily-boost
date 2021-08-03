import { Button, Dropdown, Menu, Space, Tag, Table } from 'antd';
import ProCard from '@ant-design/pro-card';
import { SearchOutlined } from '@ant-design/icons';

const columns = [
  {
    title: '名字', //标题
    dataIndex: 'name', //dataIndex
    key: 'name', //key，一般与dataIndex一致的
    render: (text: string) => <a>{text}</a>, //渲染每个单元格的数据，第1个参数为单元格，第2个参数为行数据，第3个参数是index
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '标记',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags: string[]) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: string, record: any, index: number) => (
      <Space size="middle">
        <a>
          Invite {record.name},{index + 1}
        </a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];
export default () => {
  return (
    <Space
      style={{
        background: 'rgb(240, 242, 245)',
        padding: '20px',
        display: 'flex',
      }}
      direction="vertical"
      size={20}
    >
      <ProCard title="基础" bordered headerBordered>
        <Table
          //默认就有分页控件的
          columns={columns}
          dataSource={data}
        />
      </ProCard>
    </Space>
  );
};
