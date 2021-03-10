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
var _dataQueue, _eventEmitter, _hasSentData, _sender, _receiver;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronClient = void 0;
const Client_1 = require("@civ-clone/core-civ-client/Client");
const PlayerActions_1 = require("@civ-clone/civ1-unit/PlayerActions");
const ChooseResearch_1 = require("@civ-clone/civ1-science/PlayerActions/ChooseResearch");
const PlayerActions_2 = require("@civ-clone/core-city-build/PlayerActions");
const MandatoryPlayerAction_1 = require("@civ-clone/core-player/MandatoryPlayerAction");
const TransferObject_1 = require("./TransferObject");
const EventEmitter = require("events");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const Year_1 = require("@civ-clone/core-game-year/Year");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const PlayerTradeRatesRegistry_1 = require("@civ-clone/core-trade-rate/PlayerTradeRatesRegistry");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
class ElectronClient extends Client_1.Client {
    constructor(player, sender, receiver) {
        super(player);
        _dataQueue.set(this, new Set());
        _eventEmitter.set(this, void 0);
        _hasSentData.set(this, false);
        _sender.set(this, void 0);
        _receiver.set(this, void 0);
        __classPrivateFieldSet(this, _eventEmitter, new EventEmitter());
        __classPrivateFieldSet(this, _sender, sender);
        __classPrivateFieldSet(this, _receiver, receiver);
        __classPrivateFieldGet(this, _receiver).call(this, 'action', (...args) => {
            __classPrivateFieldGet(this, _eventEmitter).emit('action', ...args);
        });
        Engine_1.instance.on('player:visibility-changed', (tile, player) => {
            if (player !== this.player()) {
                return;
            }
            __classPrivateFieldGet(this, _dataQueue).add(tile);
        });
        ['unit:created', 'unit:destroyed'].forEach((event) => {
            Engine_1.instance.on(event, (unit) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (!playerWorld.includes(unit.tile())) {
                    return;
                }
                __classPrivateFieldGet(this, _dataQueue).add(unit.tile());
            });
        });
        ['unit:moved'].forEach((event) => {
            Engine_1.instance.on(event, (unit, action) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                // TODO: filter unit details here - EnemyUnitStack.fromUnits(...unitRegistry.getByTile(unit.tile())) ?
                if (unit.player() !== this.player()) {
                    if (playerWorld.includes(action.from())) {
                        __classPrivateFieldGet(this, _dataQueue).add(action.from());
                    }
                    if (playerWorld.includes(action.to())) {
                        __classPrivateFieldGet(this, _dataQueue).add(action.to());
                    }
                    return;
                }
                __classPrivateFieldGet(this, _dataQueue).add(unit.tile());
                if (action.from() !== action.to()) {
                    __classPrivateFieldGet(this, _dataQueue).add(action.from());
                }
            });
        });
        ['tile-improvement:built', 'tile-improvement:pillaged'].forEach((event) => {
            Engine_1.instance.on(event, (tile) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (playerWorld.includes(tile)) {
                    __classPrivateFieldGet(this, _dataQueue).add(tile);
                }
            });
        });
        [
            'city:created',
            'city:destroyed',
            'city:building-complete',
            'city:grow',
            'city:shrink',
        ].forEach((event) => {
            Engine_1.instance.on(event, (city) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (city.player() !== this.player()) {
                    if (event === 'city:created' || event === 'city:destroyed') {
                        if (playerWorld.includes(city.tile())) {
                            __classPrivateFieldGet(this, _dataQueue).add(city.tile());
                        }
                    }
                    return;
                }
            });
        });
        Engine_1.instance.on('city:building-complete', (cityBuild, build) => {
            if (cityBuild.city().player() !== this.player()) {
                return;
            }
            this.sendNotification(`${cityBuild.city().name()} has completed work on ${build.constructor.name}!`);
        });
        Engine_1.instance.on('player:research-complete', (playerResearch, advance) => {
            if (playerResearch.player() !== this.player()) {
                return;
            }
            this.sendNotification(`You have discovered the secrets of ${advance.constructor.name}!`);
        });
        // TODO: need to realise the Action so it can be relayed to the player - maybe these need to be calculated when the
        //  hut is instantiated...
        // engineInstance.on('goody-hut:discovered', (goodyHut, unit) => {
        //   if (unit.player() !== this.player()) {
        //     return;
        //   }
        //
        //   if (goodyHut instanceof FreeAdvance) {
        //     this.sendNotification(
        //       'You have discovered scrolls of ancient wisdom...'
        //     );
        //
        //     return;
        //   }
        //
        //   if (goodyHut instanceof FreeCity) {
        //     this.sendNotification('You have discovered an advanced tribe...');
        //
        //     return;
        //   }
        //
        //   if (goodyHut instanceof FreeGold) {
        //     this.sendNotification('You have discovered valuable treasure...');
        //
        //     return;
        //   }
        //
        //   if (goodyHut instanceof FreeUnit) {
        //     this.sendNotification(
        //       'You have discovered a tribe of skilled mercenaries...'
        //     );
        //
        //     return;
        //   }
        //
        //   this.sendNotification(goodyHut.constructor.name);
        // });
    }
    handleAction(...args) {
        const [action] = args, player = this.player(), actions = player.actions(), mandatoryActions = actions.filter((action) => action instanceof MandatoryPlayerAction_1.default);
        const { name, id } = action;
        if (name === 'EndOfTurn') {
            return mandatoryActions.length === 0;
        }
        if (!name) {
            console.log('action not specified');
            return false;
        }
        const [playerAction] = actions.filter((action) => action.constructor.name === name &&
            id === (action.value() ? action.value().id() : undefined));
        if (!playerAction) {
            console.log('action not specified');
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
                    console.log(`action not found: ${unitAction}`);
                    return false;
                }
                actions = actions.filter((action) => action.to().id() === target);
                if (actions.length > 1) {
                    if (!target) {
                        console.log(`too many actions found: ${unitAction} (${actions.length})`);
                        return false;
                    }
                }
            }
            const [actionToPerform] = actions;
            actionToPerform.perform();
            return false;
        }
        if (playerAction instanceof PlayerActions_2.CityBuild ||
            playerAction instanceof PlayerActions_2.ChangeProduction) {
            const cityBuild = playerAction.value(), { chosen } = action;
            if (!chosen) {
                console.log(`no build item specified`);
                return false;
            }
            const [BuildItem] = cityBuild
                .available()
                .filter((BuildItem) => BuildItem.name === chosen);
            if (!BuildItem) {
                console.log(`build item not available: ${chosen}`);
                return false;
            }
            cityBuild.build(BuildItem);
            return false;
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
                console.log(`build item not available: ${chosen}`);
                return false;
            }
            playerResearch.research(ChosenAdvance);
            return false;
        }
        console.log(`unhandled action: ${JSON.stringify(action)}`);
        return false;
    }
    sendInitialData() {
        const rawData = {
            player: this.player(),
            turn: Turn_1.instance,
            year: Year_1.instance,
        };
        const dataObject = new TransferObject_1.default(rawData);
        __classPrivateFieldGet(this, _sender).call(this, 'gameData', dataObject.toPlainObject());
    }
    sendGameData() {
        const actions = this.player().actions(), patch = {
            player: {
                actions: actions,
                cities: CityRegistry_1.instance.getByPlayer(this.player()),
                government: PlayerGovernmentRegistry_1.instance.getByPlayer(this.player()),
                mandatoryActions: actions.filter((action) => action instanceof MandatoryPlayerAction_1.default),
                rates: PlayerTradeRatesRegistry_1.instance.getByPlayer(this.player()),
                research: PlayerResearchRegistry_1.instance.getByPlayer(this.player()),
                treasury: PlayerTreasuryRegistry_1.instance.getByPlayer(this.player()),
                units: UnitRegistry_1.instance.getByPlayer(this.player()),
                world: {
                    tiles: [...__classPrivateFieldGet(this, _dataQueue)],
                },
            },
        };
        __classPrivateFieldGet(this, _sender).call(this, 'gameDataPatch', new TransferObject_1.default(patch).toPlainObject());
        __classPrivateFieldGet(this, _dataQueue).clear();
    }
    sendNotification(message) {
        __classPrivateFieldGet(this, _sender).call(this, 'gameNotification', {
            message: message,
        });
    }
    takeTurn() {
        return new Promise((resolve, reject) => {
            this.sendInitialData();
            const listener = (...args) => {
                try {
                    if (this.handleAction(...args)) {
                        __classPrivateFieldGet(this, _eventEmitter).off('action', listener);
                        resolve();
                    }
                    this.sendInitialData();
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
_dataQueue = new WeakMap(), _eventEmitter = new WeakMap(), _hasSentData = new WeakMap(), _sender = new WeakMap(), _receiver = new WeakMap();
exports.default = ElectronClient;
//# sourceMappingURL=ElectronClient.js.map