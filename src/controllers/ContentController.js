import MessageController from './MessageController.js';
import VerifyHolderController from './VerifyHolderController.js';

class ContentController {

    constructor() {
        this.init();
    }

    init() {
        MessageController.addMessageListener(this.messageListener);
    }

    messageListener(request, sender, sendResponse) {
        switch (request.message) {
            case 'RENDER_WARNING':
                // const _WarningRenderController = new WarningRenderController(request.data);
                // _WarningRenderController.render();
                const query = new URLSearchParams({
                    origin: window.location.href,
                    id: request.data.id,
                    notes: request.data.notes
                });
                window.location.href = `${request.data.redirectURL}?${query.toString()}`;
                break;
            case 'VERIFY_HOLDER':
                console.log('content VERIFY_HOLDER', request.data);
                VerifyHolderController.init(request.data);
                break;
        }
    }
}

export default ContentController;