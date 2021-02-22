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
var _eventEmitter, _sender, _receiver;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronClient = void 0;
const Client_1 = require("@civ-clone/core-civ-client/Client");
const PlayerActions_1 = require("@civ-clone/civ1-unit/PlayerActions");
const ChooseResearch_1 = require("@civ-clone/civ1-science/PlayerActions/ChooseResearch");
const PlayerActions_2 = require("@civ-clone/core-city-build/PlayerActions");
const MandatoryPlayerAction_1 = require("@civ-clone/core-player/MandatoryPlayerAction");
const TransferObject_1 = require("./TransferObject");
const EventEmitter = require("events");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const Year_1 = require("@civ-clone/core-game-year/Year");
class ElectronClient extends Client_1.Client {
    constructor(player, sender, receiver) {
        super(player);
        _eventEmitter.set(this, void 0);
        _sender.set(this, void 0);
        _receiver.set(this, void 0);
        __classPrivateFieldSet(this, _eventEmitter, new EventEmitter());
        __classPrivateFieldSet(this, _sender, sender);
        __classPrivateFieldSet(this, _receiver, receiver);
        __classPrivateFieldGet(this, _receiver).call(this, 'action', (...args) => {
            __classPrivateFieldGet(this, _eventEmitter).emit('action', ...args);
        });
    }
    handleAction(...args) {
        const [action] = args, player = this.player(), actions = player.actions(), mandatoryActions = actions.filter((action) => action instanceof MandatoryPlayerAction_1.default);
        // {
        //   name: 'ActiveUnit',
        //   data: {
        //     id: '...',
        //     action: {
        //       name: 'FoundCity',
        //       target: {
        //         id: '...'
        //       }
        //     }
        //   }
        // }
        // {
        //   name: 'CityBuild',
        //   data: {
        //     id: '...',
        //     target: {
        //       name: 'Spearman'
        //     }
        //   }
        // }
        const { name, id } = action;
        if (name === 'EndOfTurn') {
            return mandatoryActions.length === 0;
        }
        if (!name) {
            this.sendNotification('action not specified');
            return false;
        }
        const [playerAction] = actions.filter((action) => action.constructor.name === name &&
            id === (action.value() ? action.value().id() : undefined));
        if (!playerAction) {
            this.sendNotification(`action not found: ${name}`);
            return false;
        }
        // TODO: other actions
        // TODO: make this better...
        if (playerAction instanceof PlayerActions_1.ActiveUnit) {
            const { unitAction, target } = action, unit = playerAction.value(), allActions = [
                ...unit.actions(),
                ...Object.values(unit.actionsForNeighbours()),
            ].flat();
            let actions = allActions.filter((action) => action.constructor.name === unitAction);
            while (actions.length !== 1) {
                if (actions.length === 0) {
                    this.sendNotification(`action not found: ${unitAction}`);
                    return false;
                }
                actions = actions.filter((action) => action.to().id() === target);
                if (actions.length > 1) {
                    if (!target) {
                        this.sendNotification(`too many actions found: ${unitAction} (${actions.length})`);
                        return false;
                    }
                }
            }
            const [actionToPerform] = actions;
            actionToPerform.perform();
        }
        if (playerAction instanceof PlayerActions_2.CityBuild) {
            const cityBuild = playerAction.value(), { chosen } = action;
            if (!chosen) {
                this.sendNotification(`no build item specified`);
                return false;
            }
            const [BuildItem] = cityBuild
                .available()
                .filter((BuildItem) => BuildItem.name === chosen);
            if (!BuildItem) {
                this.sendNotification(`build item not available: ${chosen}`);
                return false;
            }
            cityBuild.build(BuildItem);
        }
        if (playerAction instanceof ChooseResearch_1.default) {
            const playerResearch = playerAction.value(), { chosen } = action;
            if (!chosen) {
                this.sendNotification(`no build item specified`);
                return false;
            }
            const [ChosenAdvance] = playerResearch
                .available()
                .filter((AdvanceType) => AdvanceType.name === chosen);
            if (!ChosenAdvance) {
                this.sendNotification(`build item not available: ${chosen}`);
                return false;
            }
            playerResearch.research(ChosenAdvance);
        }
        return !player.mandatoryActions().length;
    }
    sendGameData() {
        const dataObject = new TransferObject_1.default({
            player: this.player(),
            turn: Turn_1.instance,
            year: Year_1.instance,
        });
        __classPrivateFieldGet(this, _sender).call(this, 'gameData', dataObject.toPlainObject());
    }
    sendNotification(message) {
        __classPrivateFieldGet(this, _sender).call(this, 'gameNotification', {
            message: message,
        });
    }
    takeTurn() {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.sendGameData(), 200);
            // this.sendGameData();
            const listener = (...args) => {
                this.sendGameData();
                try {
                    if (this.handleAction(...args)) {
                        __classPrivateFieldGet(this, _eventEmitter).off('action', listener);
                        resolve();
                    }
                    this.sendGameData();
                }
                catch (e) {
                    reject(e);
                }
            };
            __classPrivateFieldGet(this, _eventEmitter).on('action', listener);
        });
    }
}
exports.ElectronClient = ElectronClient;
_eventEmitter = new WeakMap(), _sender = new WeakMap(), _receiver = new WeakMap();
exports.default = ElectronClient;
//# sourceMappingURL=ElectronClient.js.map