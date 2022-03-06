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
var _ElectronClient_dataFilter, _ElectronClient_dataQueue, _ElectronClient_eventEmitter, _ElectronClient_receiver, _ElectronClient_sender, _ElectronClient_sentInitialData;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronClient = void 0;
const GoodyHuts_1 = require("@civ-clone/civ1-goody-hut/GoodyHuts");
const PlayerActions_1 = require("@civ-clone/core-city-build/PlayerActions");
const Client_1 = require("@civ-clone/core-civ-client/Client");
const PlayerActions_2 = require("@civ-clone/civ1-unit/PlayerActions");
const ChooseResearch_1 = require("@civ-clone/civ1-science/PlayerActions/ChooseResearch");
const City_1 = require("@civ-clone/core-city/City");
const Civilization_1 = require("@civ-clone/core-civilization/Civilization");
const CompleteProduction_1 = require("@civ-clone/civ1-treasury/PlayerActions/CompleteProduction");
const DataQueue_1 = require("./DataQueue");
const PlayerActions_3 = require("@civ-clone/civ1-player/PlayerActions");
const MandatoryPlayerAction_1 = require("@civ-clone/core-player/MandatoryPlayerAction");
const Player_1 = require("@civ-clone/core-player/Player");
const PlayerWorld_1 = require("@civ-clone/core-player-world/PlayerWorld");
const Retryable_1 = require("./Retryable");
const TransferObject_1 = require("./TransferObject");
const Tile_1 = require("@civ-clone/core-world/Tile");
const UndiscoveredTile_1 = require("@civ-clone/core-player-world/UndiscoveredTile");
const Unit_1 = require("@civ-clone/core-unit/Unit");
const City_2 = require("../UnknownObjects/City");
const Player_2 = require("../UnknownObjects/Player");
const Unit_2 = require("../UnknownObjects/Unit");
const AdvanceRegistry_1 = require("@civ-clone/core-science/AdvanceRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const LeaderRegistry_1 = require("@civ-clone/core-civilization/LeaderRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const Year_1 = require("@civ-clone/core-game-year/Year");
const EventEmitter = require("events");
// const referenceObject = <T extends DataObject = DataObject>(object: T) => ({
const referenceObject = (object) => ({
    '#ref': object.id(),
}), filterToReference = (...types) => (object) => types.some((Type) => object instanceof Type)
    ? referenceObject(object)
    : object, filterToReferenceAllExcept = (...types) => (object) => types.some((Type) => object instanceof Type)
    ? object
    : referenceObject(object);
const unknownPlayers = new Map(), unknownUnits = new Map(), unknownCities = new Map();
class ElectronClient extends Client_1.Client {
    constructor(player, sender, receiver) {
        super(player);
        _ElectronClient_dataFilter.set(this, (localFilter = (object) => object) => (object) => {
            if (object instanceof Player_1.default && object !== this.player()) {
                if (!unknownPlayers.has(object)) {
                    unknownPlayers.set(object, Player_2.default.fromPlayer(object));
                }
                return unknownPlayers.get(object);
            }
            if (object instanceof Unit_1.default && object.player() !== this.player()) {
                if (!unknownUnits.has(object)) {
                    unknownUnits.set(object, Unit_2.default.fromUnit(object));
                }
                return unknownUnits.get(object);
            }
            if (object instanceof City_1.default && object.player() !== this.player()) {
                if (!unknownCities.has(object)) {
                    unknownCities.set(object, City_2.default.fromCity(object));
                }
                return unknownCities.get(object);
            }
            if (object instanceof Tile_1.default) {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (!playerWorld.includes(object)) {
                    return new UndiscoveredTile_1.default(object.x(), object.y(), object.map());
                }
            }
            return localFilter(object);
        });
        _ElectronClient_dataQueue.set(this, new DataQueue_1.default());
        _ElectronClient_eventEmitter.set(this, void 0);
        _ElectronClient_receiver.set(this, void 0);
        _ElectronClient_sender.set(this, void 0);
        _ElectronClient_sentInitialData.set(this, false);
        __classPrivateFieldSet(this, _ElectronClient_eventEmitter, new EventEmitter(), "f");
        __classPrivateFieldSet(this, _ElectronClient_sender, sender, "f");
        __classPrivateFieldSet(this, _ElectronClient_receiver, receiver, "f");
        __classPrivateFieldGet(this, _ElectronClient_receiver, "f").call(this, 'action', (...args) => {
            __classPrivateFieldGet(this, _ElectronClient_eventEmitter, "f").emit('action', ...args);
        });
        // TODO: These could be `HiddenAction`s. Need to add a `perform` method to actions too...
        __classPrivateFieldGet(this, _ElectronClient_receiver, "f").call(this, 'cheat', ({ name, value }) => {
            if (name === 'RevealMap') {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                // A bit nasty... I wonder how slow this data transfer will be...
                const [tile] = playerWorld.entries();
                tile
                    .map()
                    .entries()
                    .forEach((tile) => {
                    if (playerWorld.includes(tile)) {
                        return;
                    }
                    playerWorld.register(tile);
                    __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(playerWorld.id(), () => tile.toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this)), `entries[${playerWorld.entries().indexOf(tile)}]`);
                });
            }
            if (name === 'GrantAdvance') {
                const [Advance] = AdvanceRegistry_1.instance.filter((Advance) => Advance.name === value), playerResearch = PlayerResearchRegistry_1.instance.getByPlayer(this.player());
                if (!Advance) {
                    return;
                }
                if (playerResearch.completed(Advance)) {
                    return;
                }
                playerResearch.addAdvance(Advance);
            }
            if (name === 'GrantGold') {
                const playerTreasury = PlayerTreasuryRegistry_1.instance.getByPlayer(this.player());
                playerTreasury.add(value);
            }
            this.sendPatchData();
        });
        Engine_1.instance.on('player:visibility-changed', (tile, player) => {
            if (player !== this.player()) {
                return;
            }
            const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player()), index = playerWorld.entries().indexOf(tile);
            if (index === -1) {
                console.log('using a Retryable');
                new Retryable_1.default(() => {
                    const index = playerWorld.entries().indexOf(tile);
                    if (index === -1) {
                        return false;
                    }
                    __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(playerWorld.id(), () => tile.toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Player_1.default))), `tiles[${index}]`);
                    return true;
                }, 2, 20);
                return;
            }
            __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(playerWorld.id(), () => tile.toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Player_1.default))), `tiles[${index}]`);
        });
        ['unit:created', 'unit:destroyed'].forEach((event) => {
            Engine_1.instance.on(event, (unit) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (!playerWorld.includes(unit.tile())) {
                    return;
                }
                // TODO: check if this is another player first and if there's already another unit there, use an unknown unit
                //  Need to update Units renderer if this happens
                __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(unit.tile().id(), () => unit.tile().toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Player_1.default))));
                if (unit.player() !== this.player()) {
                    return;
                }
                if (event === 'unit:created') {
                    const playerUnits = UnitRegistry_1.instance.getByPlayer(this.player()), playerIndex = playerUnits.indexOf(unit), cityUnits = UnitRegistry_1.instance.getByCity(unit.city()), cityIndex = cityUnits.indexOf(unit), tileUnits = UnitRegistry_1.instance.getByTile(unit.tile()), tileIndex = tileUnits.indexOf(unit);
                    __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(player.id(), () => unit.toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Tile_1.default, Player_1.default, City_1.default))), `units[${playerIndex}]`);
                    __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(unit.tile().id(), () => unit.toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Unit_1.default))), `units[${tileIndex}]`);
                    if (unit.city() !== null) {
                        __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(unit.city().id(), () => unit.toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Unit_1.default))), `units[${cityIndex}]`);
                    }
                    return;
                }
                __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").update(this.player().id(), () => this.player().toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReferenceAllExcept(Player_1.default, Unit_1.default))));
            });
        });
        ['unit:moved'].forEach((event) => {
            Engine_1.instance.on(event, (unit, action) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (!playerWorld.includes(action.from()) &&
                    !playerWorld.includes(action.to())) {
                    return;
                }
                if (unit.player() !== this.player()) {
                    if (playerWorld.includes(action.from())) {
                        __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").update(action.from().id(), () => action
                            .from()
                            .toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Player_1.default, City_1.default))));
                    }
                    if (playerWorld.includes(action.to())) {
                        __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").update(action.to().id(), () => action
                            .to()
                            .toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Player_1.default, City_1.default))));
                    }
                }
                action
                    .to()
                    .getSurroundingArea(unit.visibility().value())
                    .forEach((tile) => __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").update(tile.id(), () => tile.toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Player_1.default, City_1.default)))));
            });
        });
        ['tile-improvement:built', 'tile-improvement:pillaged'].forEach((event) => {
            Engine_1.instance.on(event, (tile) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (playerWorld.includes(tile)) {
                    __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").update(tile.id(), () => tile.toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Player_1.default, City_1.default))));
                }
            });
        });
        Engine_1.instance.on('city: captured', (city, capturingPlayer, originalPlayer) => {
            if (originalPlayer === this.player()) {
                this.sendNotification(`${capturingPlayer
                    .civilization()
                    .name()} have captured our city ${city.name()}!`);
                return;
            }
            if (capturingPlayer === this.player()) {
                this.sendNotification(`We have captured ${city.name()} from ${capturingPlayer
                    .civilization()
                    .name()}!`);
                return;
            }
        });
        ['city:created', 'city:captured', 'city:destroyed'].forEach((event) => {
            Engine_1.instance.on(event, (city) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (!playerWorld.includes(city.tile())) {
                    return;
                }
                __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").update(city.tile().id(), () => city.tile().toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Player_1.default))));
                if (city.player() !== this.player()) {
                    return;
                }
                if (event === 'city:captured') {
                    const playerCities = CityRegistry_1.instance.getByPlayer(this.player()), cityIndex = playerCities.indexOf(city);
                    if (cityIndex === -1) {
                    }
                    __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(this.player().id(), () => city
                        .tile()
                        .toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Tile_1.default))), `cities[]`);
                }
            });
        });
        Engine_1.instance.on('city:building-complete', (cityBuild, build) => {
            if (cityBuild.city().player() !== this.player()) {
                return;
            }
            __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").update(cityBuild.id(), () => cityBuild.toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Tile_1.default, Unit_1.default, Player_1.default))));
            this.sendNotification(`${cityBuild.city().name()} has completed work on ${build.constructor.name}!`);
        });
        Engine_1.instance.on('player:research-complete', (playerResearch, advance) => {
            if (playerResearch.player() !== this.player()) {
                return;
            }
            __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").update(playerResearch.id(), () => playerResearch.toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Player_1.default))));
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
        Engine_1.instance.on('player:defeated', (player) => this.sendNotification(`${player.civilization().name()} destroyed by ${player
            .civilization()
            .name()}`));
    }
    chooseCivilization(Civilizations) {
        const makeChoice = (ChosenCivilization) => {
            this.player().setCivilization(new ChosenCivilization());
            return this.chooseLeader(this.player().civilization());
        };
        return new Promise((resolve, reject) => {
            if (Civilizations.length === 1) {
                const [Civilization] = Civilizations;
                makeChoice(Civilization).then(() => resolve());
                return;
            }
            __classPrivateFieldGet(this, _ElectronClient_sender, "f").call(this, 'chooseCivilization', new TransferObject_1.default({ choices: Civilizations }).toPlainObject());
            __classPrivateFieldGet(this, _ElectronClient_receiver, "f").call(this, 'chooseCivilization', (choice) => {
                const [Civilization] = Civilizations.filter((Civilization) => Civilization.name === choice);
                if (!Civilization) {
                    reject(`Invalid civilization ${choice} (options: ${Civilizations.map((Civilization) => Civilization.name).join(', ')})`);
                    return;
                }
                makeChoice(Civilization).then(() => resolve());
            });
        });
    }
    chooseLeader(civilization) {
        return new Promise((resolve, reject) => {
            const Leaders = LeaderRegistry_1.instance.getByCivilization(civilization.constructor);
            if (Leaders.length === 1) {
                const [Leader] = Leaders;
                civilization.setLeader(new Leader());
                resolve();
                return;
            }
            __classPrivateFieldGet(this, _ElectronClient_sender, "f").call(this, 'chooseLeader', new TransferObject_1.default({ choices: Leaders }).toPlainObject());
            __classPrivateFieldGet(this, _ElectronClient_receiver, "f").call(this, 'chooseLeader', (choice) => {
                const [Leader] = Leaders.filter((Leader) => Leader.name === choice);
                if (!Leader) {
                    reject(`Invalid civilization ${choice} (options: ${Leaders.map((Leader) => Leader.name).join(', ')})`);
                    return;
                }
                civilization.setLeader(new Leader());
                resolve();
            });
        });
    }
    handleAction(...args) {
        const [action] = args, player = this.player(), actions = player.actions(), mandatoryActions = actions.filter((action) => action instanceof MandatoryPlayerAction_1.default);
        const { name, id } = action;
        if (name === 'EndTurn') {
            return (mandatoryActions.length === 1 &&
                mandatoryActions.every((action) => action instanceof PlayerActions_3.EndTurn));
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
        if (playerAction instanceof PlayerActions_2.ActiveUnit) {
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
        if (playerAction instanceof PlayerActions_1.CityBuild ||
            playerAction instanceof PlayerActions_1.ChangeProduction) {
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
        if (playerAction instanceof CompleteProduction_1.default) {
            const city = playerAction.value(), playerTreasury = PlayerTreasuryRegistry_1.instance.getByPlayer(this.player());
            playerTreasury.buy(city);
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
        __classPrivateFieldGet(this, _ElectronClient_sender, "f").call(this, 'gameData', dataObject.toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this)));
        __classPrivateFieldSet(this, _ElectronClient_sentInitialData, true, "f");
    }
    sendPatchData() {
        __classPrivateFieldGet(this, _ElectronClient_sender, "f").call(this, 'gameDataPatch', __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").transferData());
        __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").clear();
    }
    sendNotification(message) {
        __classPrivateFieldGet(this, _ElectronClient_sender, "f").call(this, 'gameNotification', {
            message: message,
        });
    }
    takeTurn() {
        return new Promise((resolve, reject) => {
            if (!__classPrivateFieldGet(this, _ElectronClient_sentInitialData, "f")) {
                this.sendInitialData();
            }
            setTimeout(() => {
                __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").update(Turn_1.instance.id(), () => Turn_1.instance.toPlainObject());
                __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").update(Year_1.instance.id(), () => Year_1.instance.toPlainObject());
                __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").add(this.player().id(), () => this.player().toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(Tile_1.default, Civilization_1.default))));
                this.sendPatchData();
            }, 1);
            const listener = (...args) => {
                try {
                    if (this.handleAction(...args)) {
                        __classPrivateFieldGet(this, _ElectronClient_eventEmitter, "f").off('action', listener);
                        this.sendPatchData();
                        setTimeout(() => resolve(), 100);
                        return;
                    }
                    __classPrivateFieldGet(this, _ElectronClient_dataQueue, "f").update(this.player().id(), () => this.player().toPlainObject(__classPrivateFieldGet(this, _ElectronClient_dataFilter, "f").call(this, filterToReference(PlayerWorld_1.default, Tile_1.default, City_1.default))));
                    this.sendPatchData();
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
_ElectronClient_dataFilter = new WeakMap(), _ElectronClient_dataQueue = new WeakMap(), _ElectronClient_eventEmitter = new WeakMap(), _ElectronClient_receiver = new WeakMap(), _ElectronClient_sender = new WeakMap(), _ElectronClient_sentInitialData = new WeakMap();
exports.default = ElectronClient;
//# sourceMappingURL=ElectronClient.js.map