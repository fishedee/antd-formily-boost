import { defineConfig } from 'umi';
import path from 'path';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  alias: {
    'formily-antd-table': path.resolve(__dirname, '../formily-antd-table'),
  },
  fastRefresh: {},
});
