import browser from 'webextension-polyfill';

export const storageDefaults = {
    ignored: [],
    ignoredOnce: [],
    safeSites: [],
    license: '',
    licenseExpiresTimestamp: '',
    lastLicenseRefresh: 0,
    lastSafeSitesRefresh: 0,
    lastOpenVerifyHolderTab: 0
};

class StorageController {

    async initDefaults() {
        for (let key in storageDefaults) {
            const exists = await this.get(key);
            if (!exists) this.set(key, storageDefaults[key]);
        }
    }

    set(key, val) {
        const obj = {};
        obj[key] = val;
        return browser.storage.sync.set({ ...obj });
    }

    get(key) {
        return new Promise(resolve => {
            browser.storage.sync.get(key).then((obj) => {
                resolve(obj[key]);
            });
        });
    }
}

export default new StorageController();