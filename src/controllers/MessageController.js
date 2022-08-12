import browser from 'webextension-polyfill';

class MessageController {

    sendTabMessage(tabId, data) {
        return new Promise(resolve => {
            browser.tabs.sendMessage(tabId, data).then(results => {
                resolve(results);
            });
        });
    }

    sendRuntimeMessage(data) {
        return new Promise(resolve => {
            browser.runtime.sendMessage(data).then(results => {
                resolve(results);
            });
        });
    }

    addMessageListener(cb) {
        browser.runtime.onMessage.addListener(cb);
    }
}

export default new MessageController();