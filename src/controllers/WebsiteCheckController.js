import { isMatch } from 'matcher';
import MessageController from './MessageController.js';
import browser from 'webextension-polyfill';
import StorageController from './StorageController.js';

class WebsiteCheckController {

    constructor(tab) {
        this.url = '';
        this.tab = tab;
        this.reports = [];
        this.ignored = [];
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
    }

    async loadUrl() {
        this.url = this.formatUrl(await this.getTabUrl(this.tab.id));
    }

    async loadReports() {
        const res = await fetch('https://react-five-o.vercel.app/reports.json');
        this.reports = await res.json();
    }

    async performCheck() {
        await Promise.all([this.loadReports(), this.loadUrl(), this.loadIgnored()]);
        if (!this.reports?.length) return;
        for (let i = 0; i < this.reports.length; i++) {
            if (this.ignored.includes(this.reports[i].id)) continue;
            if (isMatch(this.url, this.padAsterisks(this.reports[i].website))) {
                // console.log('matches', this.padAsterisks(this.reports[i].website), this.tab);
                await MessageController.sendTabMessage(this.tab.id, {
                    message: 'RENDER_WARNING',
                    data: this.reports[i]
                });
                break;
            }
        }
    }
}

export default WebsiteCheckController;