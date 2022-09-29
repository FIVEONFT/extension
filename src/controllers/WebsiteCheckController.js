import { isMatch } from 'matcher';
import browser from 'webextension-polyfill';
import MessageController from './MessageController.js';
import StorageController from './StorageController.js';
import IconController from './IconController.js';
import config from '../config/config.js';
import psl from 'psl';

class WebsiteCheckController {

    constructor(tab) {
        this.url = '';
        this.rawUrl = '';
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
        this.rawUrl = await this.getTabUrl(this.tab.id);
        this.url = this.formatUrl(this.rawUrl);
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

    async checkSafeSite() {
        const safeSites = await StorageController.get('safeSites') || [];
        if (Array.isArray(safeSites) && !!safeSites.length) {
            const parsed = psl.parse(new URL(this.rawUrl).hostname);
            console.log(parsed);
            const domainOnly = parsed.domain;
            console.log(domainOnly);
            if (safeSites.includes(domainOnly)) {
                console.log('url is safe');
                await IconController.setSafeIcon(this.tab.id);
            } else {
                await IconController.setDefaultIcon(this.tab.id);
            }
        }
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
        await this.checkSafeSite();
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
                await IconController.setDefaultIcon(this.tab.id);
                break;
            }
        }
    }
}

export default WebsiteCheckController;