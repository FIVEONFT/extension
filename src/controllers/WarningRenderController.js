import { createRoot } from 'react-dom/client';
import WebsiteWarning from '../components/content/WebsiteWarning.js';
import React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { red } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            light: red[50],
            dark: red[100],
            main: red[50],
            contrastText: red[50]
        },
        secondary: {
            light: red[600],
            dark: red[900],
            main: red[800],
            contrastText: red[800]
        }
    },
    typography: {
        htmlFontSize: 12
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlined: {
                    textTransform: 'none'
                }
            }
        }
    }
});

class WarningRenderController {

    constructor(report) {
        this.report = report;
    }

    render() {
        const renderWarning = () => {
            const shadowHost = document.createElement('div');
            document.body.appendChild(shadowHost);
            const shadowDOM = shadowHost.attachShadow({ mode: 'open' });
            const reactDiv = document.createElement('div');
            const emotionRoot = document.createElement('style');
            shadowDOM.appendChild(reactDiv);
            shadowDOM.appendChild(emotionRoot);

            const cache = createCache({
                key: 'css',
                prepend: true,
                container: emotionRoot
            });

            const root = createRoot(reactDiv);
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