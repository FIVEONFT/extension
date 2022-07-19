import browser from 'webextension-polyfill';

class StorageController {

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