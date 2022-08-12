import StorageController from './StorageController.js';
import WebsiteCheckController from './WebsiteCheckController.js';
import browser from 'webextension-polyfill';
import MessageController from './MessageController.js';
import config from '../config/config.js';

class BackgroundController {

    constructor() {
        browser.runtime.onInstalled.addListener(() => {
            return this.onInstall();
        });
        browser.runtime.onStartup.addListener(() => {
            return this.onStartup();
        });
        browser.tabs.onUpdated.addListener((...props) => {
            return this.onTabUpdated(...props);
        });
        MessageController.addMessageListener(this.onMessage);
    }

    openVerifyHolderTab() {
        browser.tabs.create({ url: config.urls.verifyHolder });
    }

    async onInstall() {
        await StorageController.initDefaults();
        this.openVerifyHolderTab();
    }

    async onStartup() {
        const lastLicenseRefresh = await StorageController.get('lastLicenseRefresh');
        if ((lastLicenseRefresh + 86400000) < new Date().getTime()) {
            StorageController.set('lastLicenseRefresh', new Date().getTime());
            const license = await StorageController.get('license');
            let licenseResJSON;
            try {
                const licenseRes = await fetch(config.urls.refreshLicense, {
                    method: 'POST',
                    body: JSON.stringify({
                        license
                    })
                });
                licenseResJSON = await licenseRes.json();
            } catch (e) {
                // ...
            }
            if (!licenseResJSON?.success || !licenseResJSON?.isAllowed) {
                this.openVerifyHolderTab();
            } else {
                StorageController.set('license', licenseResJSON.license);
                StorageController.set('licenseExpiresTimestamp', licenseResJSON.expiresTimestamp);
            }
        }
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
            case 'UPDATE_LICENSE':
                StorageController.set('license', data.data.license);
                StorageController.set('licenseExpiresTimestamp', data.data.expiresTimestamp);
                StorageController.set('lastLicenseRefresh', new Date().getTime());
                break;
            default:
                break;
        }
    }
}

export default BackgroundController;