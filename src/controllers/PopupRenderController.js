import * as ReactDOMClient from 'react-dom/client';
import PopupContent from '../components/popup/PopupContent.js';
import React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme/theme.js';

class PopupRenderController {
    render() {
        const renderPopup = () => {
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
                    <PopupContent/>
                </ThemeProvider>
            </CacheProvider>);
        };

        renderPopup();
    }
}

export default PopupRenderController;