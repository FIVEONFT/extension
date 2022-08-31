import { isMatch } from 'matcher';
import MessageController from './MessageController.js';
import browser from 'webextension-polyfill';
import StorageController from './StorageController.js';
import config from '../config/config.js';

class WebsiteCheckController {

    constructor(tab) {
        this.url = '';
        this.tab = tab;
        this.reports = [];
        this.ignored = [];
        this.ignoredOnce = [];
    }

    formatUrl(str) {
        return str.replace(/^https?:\/\//, '');
    }

    padAsterisks(str) {
        if (!str.startsWith('*')) str = `*${str}`;
        if (!str.endsWith('*')) str = `${str}*`;
        return str;
    }

    getTabUrl(tabId) {
        return new Promise(async resolve => {
            const tabInfo = await browser.tabs.get(tabId);
            resolve(tabInfo.url);
        });
    }

    async loadIgnored() {
        this.ignored = await StorageController.get('ignored');
        this.ignoredOnce = await StorageController.get('ignoredOnce');
    }

    async loadUrl() {
        this.url = this.formatUrl(await this.getTabUrl(this.tab.id));
    }

    async loadReports() {
        let resJSON;
        try {
            const res = await fetch(`${config.urls.reportsAPI}?license=${await StorageController.get('license')}`);
            resJSON = await res.json();
        } catch (e) {
            // ...
        }
        this.reports = resJSON?.data || [];
    }

    async performCheck() {
        await this.loadUrl();
        if (this.url.startsWith('chrome-extension://')) return;
        if (config.urls.verifyHolderFormatted.find(item => this.url.startsWith(item))) {
            await MessageController.sendTabMessage(this.tab.id, {
                message: 'VERIFY_HOLDER',
                data: {
                    id: await StorageController.get('license'),
                    expiresTimestamp: await StorageController.get('licenseExpiresTimestamp')
                }
            });
            return;
        }
        await Promise.all([this.loadReports(), this.loadIgnored()]);
        if (!this.reports?.length) return;
        for (let i = 0; i < this.reports.length; i++) {
            if (this.ignored.includes(this.reports[i].id)) continue;
            if (this.ignoredOnce.includes(this.reports[i].id)) {
                StorageController.set('ignoredOnce', this.ignoredOnce.filter(item => item !== this.reports[i].id));
                continue;
            }
            if (isMatch(this.url, this.padAsterisks(this.reports[i].website))) {
                await MessageController.sendTabMessage(this.tab.id, {
                    message: 'RENDER_WARNING',
                    data: {
                        ...this.reports[i],
                        redirectURL: browser.runtime.getURL(`blocked/blocked.html`)
                    }
                });
                break;
            }
        }
    }
}

export default WebsiteCheckController;