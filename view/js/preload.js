"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('transport', {
    receive(channel, handler) {
        electron_1.ipcRenderer.on(channel, (event, ...args) => {
            handler(...args);
        });
    },
    receiveOnce(channel, handler) {
        electron_1.ipcRenderer.once(channel, (event, ...args) => {
            try {
                handler(...args);
            }
            catch (e) {
                console.error(e);
            }
        });
    },
    send(channel, payload) {
        electron_1.ipcRenderer.invoke(channel, payload);
    },
});
//# sourceMappingURL=preload.js.map