import MessageController from './MessageController.js';
import WarningRenderController from './WarningRenderController.js';

class ContentController {

    constructor() {
        this.init();
    }

    init() {
        MessageController.addMessageListener(this.messageListener);
    }

    messageListener(request, sender, sendResponse) {
        if (request.message === 'RENDER_WARNING') {
            const _WarningRenderController = new WarningRenderController(request.data);
            _WarningRenderController.render();
        }
    }
}

export default ContentController;