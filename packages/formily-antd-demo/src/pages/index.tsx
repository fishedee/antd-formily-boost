import styles from './index.less';
//引入全局的紧凑样式
import 'antd/dist/antd.compact.css';

export default function IndexPage() {
    return (
        <div>
            <h1 className={styles.title}>Page index</h1>
        </div>
    );
}
