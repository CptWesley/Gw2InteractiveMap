/* eslint-disable */
const path = require(`path`);

module.exports = {
    webpack: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
        use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
        },
        configure: webpackConfig => {
            const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
              ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
            );
      
            webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
            return webpackConfig;
        }
    },
    babel: {
        "sourceType": "unambiguous",
        "plugins": ["@babel/plugin-transform-runtime"],
        "presets": ["@babel/preset-env"]
    }
};