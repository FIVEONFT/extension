import MessageController from './MessageController.js';

class VerifyHolderController {
    constructor() {
    }

    init(data) {
        window.addEventListener('UPDATE_LICENSE', this.onUpdateLicense);
        this.broadcastLicense(data);
    }

    broadcastLicense(data) {
        this.sendWindowEvent('VERIFY_HOLDER', data);
    }

    sendWindowEvent(type, data) {
        const customEvt = new CustomEvent(type, {
            detail: data
        });
        window.dispatchEvent(customEvt);
    }

    onUpdateLicense(e) {
        return MessageController.sendRuntimeMessage({
            message: 'UPDATE_LICENSE',
            data: e.detail
        });
    }
}

export default new VerifyHolderController();