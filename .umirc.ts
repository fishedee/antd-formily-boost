import { defineConfig } from 'dumi';

export default defineConfig({
    title: 'antd-formily-boost',
    favicon:
        'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
    logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
    outputPath: 'docs-dist',
    mode: 'site',
    publicPath: '/antd-formily-boost/',
    base: '/antd-formily-boost/',
    navs: [
        null, // null 值代表保留约定式生成的导航，只做增量配置
        {
            title: 'GitHub',
            path: 'https://github.com/fishedee/antd-formily-boost',
        },
    ],
    // more config: https://d.umijs.org/config
});