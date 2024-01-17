//@ts-ignore
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

//@ts-ignore
module.exports = function override(config, env) {
    config.plugins.push(new MonacoWebpackPlugin({
        languages: ['html']
    }));
    return config;
}
