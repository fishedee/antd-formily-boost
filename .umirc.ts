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
    /*
    externals: {
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
    },

    // 引入被 external 库的 scripts
    // 区分 development 和 production，使用不同的产物
    scripts: [
        'https://unpkg.com/react@16.14.0/umd/react.production.min.js',
        'https://unpkg.com/react-dom@16.14.0/umd/react-dom.production.min.js',
    ],
    // more config: https://d.umijs.org/config
*/
});
