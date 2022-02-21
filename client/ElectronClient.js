"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ElectronClient_dataQueue, _ElectronClient_eventEmitter, _ElectronClient_sender, _ElectronClient_receiver;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronClient = void 0;
const Client_1 = require("@civ-clone/core-civ-client/Client");
const GoodyHuts_1 = require("@civ-clone/civ1-goody-hut/GoodyHuts");
const PlayerActions_1 = require("@civ-clone/civ1-unit/PlayerActions");
const ChooseResearch_1 = require("@civ-clone/civ1-science/PlayerActions/ChooseResearch");
const PlayerActions_2 = require("@civ-clone/core-city-build/PlayerActions");
const MandatoryPlayerAction_1 = require("@civ-clone/core-player/MandatoryPlayerAction");
const Player_1 = require("@civ-clone/core-player/Player");
const TransferObject_1 = require("./TransferObject");
const Unit_1 = require("@civ-clone/core-unit/Unit");
const City_1 = require("../UnknownObjects/City");
const Player_2 = require("../UnknownObjects/Player");
const Unit_2 = require("../UnknownObjects/Unit");
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
const City_2 = require("@civ-clone/core-city/City");
class ElectronClient extends Client_1.Client {
    constructor(player, sender, receiver) {
        super(player);
        _ElectronClient_dataQueue.set(this, new Set());
        _ElectronClient_eventEmitter.set(this, void 0);
        _ElectronClient_sender.set(this, void 0);
        _ElectronClient_receiver.set(this, void 0);
        __classPrivateFieldSet(this, _ElectronClient_eventEmitter, new EventEmitter(), "f");
        __classPrivateFieldSet(this, _ElectronClient_sender, sender, "f");
        __classPrivateFieldSet(this, _ElectronClient_receiver, receiver, "f");
        __classPrivateFieldGet(this, _ElectronClient_receiver, "f").call(this, 'action', (...args) => {
            __classPrivateFieldGet(this, _ElectronClient_eventEmitter, "f").emit('action', ...args);
        });
        __classPrivateFieldGet(this, _ElectronClient_receiver, "f").call(this, 'cheat', (code) => {
            if (code === 'RevealMap') {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                // A bit nasty... I wonder how slow this data transfer will be...
                playerWorld
                    .entries()[0]
                    .map()
                    .entries()
                    .forEach((tile) => playerWorld.register(tile));
            }
        });
        Engine_1.instance.on('player:visibility-changed', (tile, player) => {
            if (player !== this.player()) {
                return;
            }
            __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(tile);
        });
        ['unit:created', 'unit:destroyed'].forEach((event) => {
            Engine_1.instance.on(event, (unit) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (!playerWorld.includes(unit.tile())) {
                    return;
                }
                __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(unit.tile());
            });
        });
        ['unit:moved'].forEach((event) => {
            Engine_1.instance.on(event, (unit, action) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                // TODO: filter unit details here - EnemyUnitStack.fromUnits(...unitRegistry.getByTile(unit.tile())) ?
                if (unit.player() !== this.player()) {
                    if (playerWorld.includes(action.from())) {
                        __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(action.from());
                    }
                    if (playerWorld.includes(action.to())) {
                        __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(action.to());
                    }
                    return;
                }
                __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(unit.tile());
                if (action.from() !== action.to()) {
                    __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(action.from());
                }
            });
        });
        ['tile-improvement:built', 'tile-improvement:pillaged'].forEach((event) => {
            Engine_1.instance.on(event, (tile) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (playerWorld.includes(tile)) {
                    __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(tile);
                }
            });
        });
        ['city:created', 'city:destroyed'].forEach((event) => {
            Engine_1.instance.on(event, (city) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (city.player() !== this.player()) {
                    if (event === 'city:created' || event === 'city:destroyed') {
                        if (playerWorld.includes(city.tile())) {
                            __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(city.tile());
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
        Engine_1.instance.on('goody-hut:action-performed', (goodyHut, action) => {
            const tile = goodyHut.tile(), units = UnitRegistry_1.instance.getByTile(tile);
            if (!units.some((unit) => unit.player() === this.player())) {
                return;
            }
            if (action instanceof GoodyHuts_1.Advance) {
                this.sendNotification('You have discovered scrolls of ancient wisdom...');
                return;
            }
            if (action instanceof GoodyHuts_1.City) {
                this.sendNotification('You have discovered an advanced tribe...');
                return;
            }
            if (action instanceof GoodyHuts_1.Gold) {
                this.sendNotification('You have discovered valuable treasure...');
                return;
            }
            if (action instanceof GoodyHuts_1.Unit) {
                this.sendNotification('You have discovered a friendly tribe of skilled mercenaries...');
                return;
            }
        });
        Engine_1.instance.on('goody-hut:discovered', (goodyHut, unit) => {
            if (unit.player() !== this.player()) {
                return;
            }
        });
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
        __classPrivateFieldGet(this, _ElectronClient_sender, "f").call(this, 'gameData', dataObject.toPlainObject((object) => {
            if (object instanceof Player_1.default && object !== this.player()) {
                return Player_2.default.fromPlayer(object);
            }
            if (object instanceof Unit_1.default && object.player() !== this.player()) {
                return Unit_2.default.fromUnit(object);
            }
            if (object instanceof City_2.default && object.player() !== this.player()) {
                return City_1.default.fromCity(object);
            }
            return object;
        }));
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
                    tiles: [...__classPrivateFieldGet(this, _ElectronClient_dataQueue, "f")],
                },
            },
        };
        __classPrivateFieldGet(this, _ElectronClient_sender, "f").call(this, 'gameDataPatch', new TransferObject_1.default(patch).toPlainObject());
        __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").clear();
    }
    sendNotification(message) {
        __classPrivateFieldGet(this, _ElectronClient_sender, "f").call(this, 'gameNotification', {
            message: message,
        });
    }
    takeTurn() {
        return new Promise((resolve, reject) => {
            this.sendInitialData();
            const listener = (...args) => {
                try {
                    if (this.handleAction(...args)) {
                        __classPrivateFieldGet(this, _ElectronClient_eventEmitter, "f").off('action', listener);
                        resolve();
                    }
                    this.sendInitialData();
                }
                catch (e) {
                    reject(e);
                }
            };
            __classPrivateFieldGet(this, _ElectronClient_eventEmitter, "f").on('action', listener);
        });
    }
}
exports.ElectronClient = ElectronClient;
_ElectronClient_dataQueue = new WeakMap(), _ElectronClient_eventEmitter = new WeakMap(), _ElectronClient_sender = new WeakMap(), _ElectronClient_receiver = new WeakMap();
exports.default = ElectronClient;
//# sourceMappingURL=ElectronClient.js.map