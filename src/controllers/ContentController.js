import MessageController from './MessageController.js';
import WarningRenderController from './WarningRenderController.js';
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
                const _WarningRenderController = new WarningRenderController(request.data);
                _WarningRenderController.render();
                break;
            case 'VERIFY_HOLDER':
                console.log('content VERIFY_HOLDER', request.data);
                VerifyHolderController.init(request.data);
                break;
        }
    }
}

export default ContentController;