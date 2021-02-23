"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferObject = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class TransferObject extends DataObject_1.default {
    // #player: Player;
    //
    // constructor(player: Player) {
    //   super();
    //
    //   this.#player = player;
    //
    //   this.addKey('player');
    // }
    //
    // player() {
    //   return this.#player;
    // }
    constructor(data) {
        super();
        Object.assign(this, data);
        // @ts-ignore
        this.addKey(...Object.keys(data));
    }
}
exports.TransferObject = TransferObject;
exports.default = TransferObject;
//# sourceMappingURL=TransferObject.js.map