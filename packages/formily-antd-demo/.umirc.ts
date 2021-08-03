import { defineConfig } from 'umi';
import path from 'path';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  //hash路由
  history: {
    type: 'hash',
  },

  //打开locale
  locale: { antd: true },

  //https://umijs.org/zh-CN/plugins/plugin-antd
  //紧凑主题，或者暗黑主题
  antd: {
    //dark: true,
    compact: true,
  },
  alias: {
    '@formily/react': path.resolve(__dirname, './node_modules/@formily/react'),
    '@formily/reactive-react': path.resolve(
      __dirname,
      './node_modules/@formily/reactive-react',
    ),
  },
  //msfu对于node_modules的软链接模块并不友好
  //msfu:{}
  fastRefresh: {},
});
