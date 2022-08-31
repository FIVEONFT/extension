const webpack = require('webpack');
const { version } = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ejs = require('ejs');

function transformHtml(content) {
    return ejs.render(content.toString(), {
        ...process.env
    });
}

const config = {
    mode: process.env.NODE_ENV,
    context: __dirname + '/src',
    entry: {
        'background': './background/background.js',
        'content': './content/content.js',
        'blocked/blocked': './blocked/blocked.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js'],
        fallback: {
            'fs': false,
            'tls': false,
            'net': false,
            'path': false,
            'zlib': false,
            'http': false,
            'https': false,
            'stream': false,
            'crypto': false
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
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
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            global: 'window'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new CopyPlugin({
            patterns: [
                { from: 'blocked/blocked.html', to: 'blocked/blocked.html', transform: transformHtml },
                { from: 'icons', to: 'icons' },
                {
                    from: 'manifest.json',
                    to: 'manifest.json',
                    transform: (content) => {
                        const jsonContent = JSON.parse(content);
                        jsonContent.version = version;

                        if (config.mode === 'development') {
                            jsonContent['content_security_policy'] = {
                                "extension_page": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
                            };
                        }

                        return JSON.stringify(jsonContent, null, 2);
                    }
                }
            ]
        })
    ]
};

if (process.env.NODE_ENV === 'development') {
    config.devtool = 'cheap-module-source-map';
}

if (config.mode === 'production') {
    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ]);
}

module.exports = config;