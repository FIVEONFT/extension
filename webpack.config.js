const webpack = require('webpack');
const { version } = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');
const ejs = require('ejs');

const config = {
    mode: process.env.NODE_ENV,
    context: __dirname + '/src',
    entry: {
        'background': './background/background.js',
        'content': './content/content.js',
        // 'popup/popup': './popup/popup.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        envName: process.env.NODE_ENV
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            global: 'window'
        }),
        new CopyPlugin({
            patterns: [
                // { from: 'icons', to: 'icons', ignore: ['icon.xcf'] },
                // { from: 'popup/popup.html', to: 'popup/popup.html', transform: transformHtml },
                {
                    from: 'manifest.json',
                    to: 'manifest.json',
                    transform: (content) => {
                        const jsonContent = JSON.parse(content);
                        jsonContent.version = version;

                        if (config.mode === 'development') {
                            jsonContent['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
                        }

                        return JSON.stringify(jsonContent, null, 2);
                    }
                }
            ]
        })
    ]
};

if (config.mode === 'production') {
    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ]);
}

// not working with webpack 5
// if (process.env.HMR === 'true') {
//     config.plugins = (config.plugins || []).concat([
//         new ExtensionReloader({
//             manifest: __dirname + '/src/manifest.json'
//         })
//     ]);
// }

// function transformHtml(content) {
//     return ejs.render(content.toString(), {
//         ...process.env
//     });
// }

module.exports = config;