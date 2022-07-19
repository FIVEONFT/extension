import StorageController from './StorageController.js';
import WebsiteCheckController from './WebsiteCheckController.js';
import browser from 'webextension-polyfill';
import MessageController from './MessageController.js';

class BackgroundController {

    constructor() {
        browser.runtime.onInstalled.addListener(this.onInstall);
        browser.tabs.onUpdated.addListener(this.onTabUpdated);
        MessageController.addMessageListener(this.onMessage);
    }

    async onInstall() {
        const ignoredExists = await StorageController.get('ignored');
        if (!ignoredExists) StorageController.set('ignored', []);
    }

    async onTabUpdated(tabId, changeInfo, tab) {
        // console.log('[BackgroundController] onTabUpdated', changeInfo);
        switch (changeInfo.status) {
            case 'complete':
                const _WebsiteCheckController = new WebsiteCheckController(tab);
                await _WebsiteCheckController.performCheck();
                break;
            default:
                break;
        }
    }

    async onMessage(data) {
        // console.log('[BackgroundController] onMessage', data);
        switch (data.message) {
            case 'IGNORE_WEBSITE':
                const ignoreId = data.data.id;
                const ignoredExists = await StorageController.get('ignored');
                StorageController.set('ignored', [...ignoredExists, ignoreId]);
                break;
            default:
                break;
        }
    }
}

export default BackgroundController;