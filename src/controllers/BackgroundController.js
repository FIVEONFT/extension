import StorageController from './StorageController.js';
import WebsiteCheckController from './WebsiteCheckController.js';
import browser from 'webextension-polyfill';
import MessageController from './MessageController.js';
import config from '../config/config.js';

const safeSiteRefreshFreq = 86400000; // 1d

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
        MessageController.addMessageListener((...params) => this.onMessage(...params));
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
        await this.updateSafeSites();
    }

    async updateSafeSites() {
        console.log(`[BackgroundController] update safe/warn sites`);
        const lastSafeSitesRefresh = await StorageController.get('lastSafeSitesRefresh') || 0;
        const license = await StorageController.get('license');
        if (!license) {
            console.log(`[BackgroundController] license not found`);
            return;
        }
        if ((lastSafeSitesRefresh + safeSiteRefreshFreq) < new Date().getTime()) {
            console.log(`[BackgroundController] safe sites expired, refreshing`);
            StorageController.set('lastSafeSitesRefresh', new Date().getTime());

            const sitesConf = [
                { api: config.urls.safeSitesAPI, storageName: 'safeSites' },
                { api: config.urls.warnSitesAPI, storageName: 'warnSites' }
            ];

            for (let i = 0; i < sitesConf.length; i++) {
                const thisConf = sitesConf[i];
                let safeSitesJSON;
                try {
                    const safeSites = await fetch(`${thisConf.api}?license=${license}`, {
                        method: 'GET'
                    });
                    safeSitesJSON = await safeSites.json();
                } catch (e) {
                    // ...
                }
                if (!!safeSitesJSON?.success) {
                    console.log(`[BackgroundController] retrieved ${thisConf.storageName} sites list`);
                    StorageController.set(thisConf.storageName, safeSitesJSON.data);
                }
            }
        }
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
            if (!licenseResJSON?.success) {
                console.log(`[BackgroundController] license open holder tab`);
                await this.openVerifyHolderTab();
            } else {
                console.log(`[BackgroundController] license updated`);
                StorageController.set('license', licenseResJSON.license);
                StorageController.set('roleId', licenseResJSON.roleId);
                StorageController.set('user', licenseResJSON.user);
                StorageController.set('licenseExpiresTimestamp', licenseResJSON.expiresTimestamp);
                await this.updateSafeSites();
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

    async processCurrentTab() {
        const currentTab = await browser.tabs.query({ active: true, currentWindow: true });
        if (currentTab.length === 0) return {};
        const _WebsiteCheckController = new WebsiteCheckController(currentTab[0]);
        await _WebsiteCheckController.loadUrl();
        return _WebsiteCheckController;
    }

    async onMessage(data) {
        // console.log('[BackgroundController] onMessage', data);
        switch (data.message) {
            case 'DEV_RESET':
                await StorageController.resetStorage();
                console.log(`[BackgroundController] dev reset done`);
                break;
            case 'DEV_VIEW_STORAGE':
                await StorageController.viewStorage();
                console.log(`[BackgroundController] dev view storage done`);
                break;
            case 'DEV_GET_SAFE_SITES':
                StorageController.set('lastSafeSitesRefresh', 0);
                await this.updateSafeSites();
                console.log(`[BackgroundController] update safe sites done`);
                break;
            case 'GET_POPUP_DATA':
                const currentTab = await this.processCurrentTab();
                return {
                    currentTab,
                    user: await StorageController.get('user'),
                    roleId: await StorageController.get('roleId')
                };
            case 'SUBMIT_REPORT':
                console.log('here');
                const license = await StorageController.get('license');
                const submitReport = await fetch(config.urls.submitReportExt, {
                    method: 'POST',
                    body: JSON.stringify({
                        license,
                        url: data.data.url,
                        notes: data.data.notes
                    })
                });
                const submitReportJSON = await submitReport.json();
                return {
                    ...submitReportJSON
                };
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
                StorageController.set('user', data.data.user);
                StorageController.set('roleId', data.data.roleId);
                StorageController.set('licenseExpiresTimestamp', data.data.expiresTimestamp);
                StorageController.set('lastLicenseRefresh', new Date().getTime());
                break;
            default:
                break;
        }
    }
}

export default BackgroundController;