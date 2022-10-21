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
        }
    },
    babel: {
        "sourceType": "unambiguous",
        "plugins": ["@babel/plugin-transform-runtime"],
        "presets": ["@babel/preset-env"]
    }
};