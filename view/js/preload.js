"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log('preload loaded');
electron_1.ipcRenderer.on('logger', (event, data) => {
    console.log('logger');
    document.getElementById('data').innerHTML += JSON.stringify(data);
});
electron_1.ipcRenderer.on('notification', (event, data) => {
    console.log('notification');
    document.getElementById('notification').innerHTML = data;
});
//# sourceMappingURL=preload.js.map