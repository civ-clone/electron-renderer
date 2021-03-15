"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferObject = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class TransferObject extends DataObject_1.default {
    constructor(data) {
        super();
        // if `id` exists, skip it, as it'll break stuff
        const { id, ...rest } = data;
        Object.assign(this, rest);
        // @ts-ignore
        this.addKey(...Object.keys(data));
    }
}
exports.TransferObject = TransferObject;
exports.default = TransferObject;
//# sourceMappingURL=TransferObject.js.map