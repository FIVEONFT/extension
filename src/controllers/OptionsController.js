import OptionsApp from '../components/options/OptionsApp.js';
import * as ReactDOMClient from 'react-dom/client';
import React from 'react';

class OptionsController {

    constructor() {
        this.init();
    }

    init() {
        const reactDiv = document.getElementById('root');
        const root = ReactDOMClient.createRoot(reactDiv);
        root.render(<OptionsApp/>);
    }
}

export default OptionsController;