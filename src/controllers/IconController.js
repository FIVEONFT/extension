import browser from 'webextension-polyfill';

class IconController {

    setSafeIcon(tabId) {
        return browser.action.setIcon({
            path: '/icons/icon-safe.png',
            tabId
        });
    }

    setDefaultIcon(tabId) {
        return browser.action.setIcon({
            path: '/icons/icon-default.png',
            tabId
        });
    }
}

export default new IconController();