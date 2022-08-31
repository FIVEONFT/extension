import * as ReactDOMClient from 'react-dom/client';
import WebsiteWarning from '../components/content/WebsiteWarning.js';
import React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme/theme.js';

class WarningRenderController {

    constructor(report) {
        this.report = report;
    }

    render() {
        const renderWarning = () => {
            // const shadowHost = document.createElement('div');
            // document.body.appendChild(shadowHost);
            // const shadowDOM = shadowHost.attachShadow({ mode: 'open' });
            // const reactDiv = document.createElement('div');
            // const emotionRoot = document.createElement('style');
            // shadowDOM.appendChild(reactDiv);
            // shadowDOM.appendChild(emotionRoot);

            const reactDiv = document.getElementById('root');
            const emotionRoot = document.createElement('style');
            document.body.appendChild(emotionRoot);

            const cache = createCache({
                key: 'css',
                prepend: true,
                container: emotionRoot
            });

            const root = ReactDOMClient.createRoot(reactDiv);
            root.render(<CacheProvider
                value={cache}>
                <ThemeProvider
                    theme={theme}>
                    <CssBaseline/>
                    <WebsiteWarning
                        {...this.report}/>
                </ThemeProvider>
            </CacheProvider>);
        };

        if (document.readyState === 'complete') {
            renderWarning();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                renderWarning();
            });
        }
    }
}

export default WarningRenderController;