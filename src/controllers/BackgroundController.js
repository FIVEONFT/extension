import StorageController from './StorageController.js';
import WebsiteCheckController from './WebsiteCheckController.js';
import browser from 'webextension-polyfill';
import MessageController from './MessageController.js';
import config from '../config/config.js';

const licenseRefreshFreq = {
    daily: 86400000, // 1d
    hourly: 7200000 // 2h
};

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

    async openVerifyHolderTab() {
        const lastOpenVerifyHolderTab = await StorageController.get('lastOpenVerifyHolderTab');
        if ((lastOpenVerifyHolderTab + 10800000) < new Date().getTime()) { // 3h
            StorageController.set('lastOpenVerifyHolderTab', new Date().getTime());
            browser.tabs.create({ url: config.urls.verifyHolder });
        }
    }

    async onInstall() {
        await StorageController.initDefaults();
        await this.openVerifyHolderTab();
    }

    async onStartup() {
        await this.triggerLicenseCheck({ freq: 'daily' });
    }

    async triggerLicenseCheck({ freq = 'daily' }) {
        console.log(`[BackgroundController] license check: ${freq}`);
        const lastLicenseRefresh = await StorageController.get('lastLicenseRefresh');
        if ((lastLicenseRefresh + licenseRefreshFreq[freq]) < new Date().getTime()) {
            console.log(`[BackgroundController] license expired`);
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
                console.log(`[BackgroundController] license open holder tab`)
                await this.openVerifyHolderTab();
            } else {
                console.log(`[BackgroundController] license updated`)
                StorageController.set('license', licenseResJSON.license);
                StorageController.set('licenseExpiresTimestamp', licenseResJSON.expiresTimestamp);
            }
        }
    }

    async onTabUpdated(tabId, changeInfo, tab) {
        // console.log('[BackgroundController] onTabUpdated', changeInfo);
        switch (changeInfo.status) {
            case 'complete':
                await this.triggerLicenseCheck({ freq: 'hourly' });
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
            case 'IGNORE_WEBSITE_ONCE':
                const ignoreIdOnce = data.data.id;
                const ignoredExistsOnce = await StorageController.get('ignoredOnce');
                StorageController.set('ignoredOnce', [...ignoredExistsOnce, ignoreIdOnce]);
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