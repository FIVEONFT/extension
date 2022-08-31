import WarningRenderController from '../controllers/WarningRenderController.js';

const params = new URLSearchParams(window.location.search);

function paramsToObject(entries) {
    const result = {};
    for (const [key, value] of entries) { // each 'entry' is a [key, value] tupple
        result[key] = value;
    }
    return result;
}

const _WarningRenderController = new WarningRenderController(paramsToObject(params.entries()));
_WarningRenderController.render();