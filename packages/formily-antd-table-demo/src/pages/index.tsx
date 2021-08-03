import styles from './index.less';
import AntdTable from 'formily-antd-table';

export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <AntdTable />
    </div>
  );
}
