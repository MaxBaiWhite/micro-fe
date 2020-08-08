const path = require('path')
module.exports = {

    // publicPath: 'https://ca.healthstar.pharmeyes.com/insv/micro-fe-platform-dev/',
    publicPath: process.env.PUBLICPATH,
    outputDir: process.env.dist,
    // 选项...
    devServer: {
        port: "10000",
        proxy: {
            // '/phwxin/manage-dev/api/v1/': {
            //     target: 'https://ca.healthstar.pharmeyes.com/',
            //     changeOrigin: true
            // },
            '/hpgc-qdpt/': {
                target: 'http://192.168.181.28:9084/',
                changeOrigin: true
            },
        },
    },
    productionSourceMap: false,
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
    },
};

function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/assets/css/commonFun.scss'),
            ],
        })
}