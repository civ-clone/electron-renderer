"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _ready, _window;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const electron_1 = require("electron");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const Player_1 = require("@civ-clone/core-player/Player");
class Game {
    constructor() {
        _ready.set(this, void 0);
        _window.set(this, void 0);
        __classPrivateFieldSet(this, _ready, electron_1.app.whenReady().then(() => {
            this.createWindow();
            this.bindEvents();
            this.configure();
        }));
        electron_1.app.on('window-all-closed', () => electron_1.app.quit());
    }
    createWindow() {
        __classPrivateFieldSet(this, _window, new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: __dirname + '/view/js/preload.js',
            },
        }));
        __classPrivateFieldGet(this, _window).loadFile('view/html/index.html');
        // Open the DevTools.
        __classPrivateFieldGet(this, _window).webContents.openDevTools();
    }
    bindEvents() {
        Engine_1.instance.on('engine:plugins:load:success', (packageName) => this.sendData('logger', `loaded plugin: ${packageName}`));
    }
    configure() {
        Engine_1.instance.setOption('debug', true);
        // Determine number of players
        Engine_1.instance.setOption('players', 5);
    }
    sendData(channel, payload) {
        console.log(`sending data to ${channel}: ${JSON.stringify(payload)}`);
        __classPrivateFieldGet(this, _window).webContents.send(channel, { payload });
    }
    async start() {
        await __classPrivateFieldGet(this, _ready);
        // await engine.loadPlugins();
        this.sendData('notification', 'Plugins loaded.');
        PlayerRegistry_1.instance.register(new Player_1.default());
        this.sendData('notification', 'Added player');
        Engine_1.instance.start();
    }
}
exports.Game = Game;
_ready = new WeakMap(), _window = new WeakMap();
exports.default = Game;
//# sourceMappingURL=Game.js.map