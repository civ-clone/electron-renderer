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
var _eventEmitter, _gameData, _patchData, _previousData, _sender, _receiver;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronClient = void 0;
const PlayerActions_1 = require("@civ-clone/core-city-build/PlayerActions");
const Client_1 = require("@civ-clone/core-civ-client/Client");
const PlayerActions_2 = require("@civ-clone/civ1-unit/PlayerActions");
const BasicTile_1 = require("./lib/BasicTile");
const ChooseResearch_1 = require("@civ-clone/civ1-science/PlayerActions/ChooseResearch");
const City_1 = require("@civ-clone/core-city/City");
const EnemyCity_1 = require("./lib/EnemyCity");
const EnemyUnit_1 = require("./lib/EnemyUnit");
const EnemyPlayer_1 = require("./lib/EnemyPlayer");
const MandatoryPlayerAction_1 = require("@civ-clone/core-player/MandatoryPlayerAction");
const Player_1 = require("@civ-clone/core-player/Player");
const Tile_1 = require("@civ-clone/core-world/Tile");
const TransferObject_1 = require("./TransferObject");
const Unit_1 = require("@civ-clone/core-unit/Unit");
const Yield_1 = require("@civ-clone/core-yield/Yield");
const EventEmitter = require("events");
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const Year_1 = require("@civ-clone/core-game-year/Year");
const reconstituteData_1 = require("@civ-clone/core-data-object/lib/reconstituteData");
class ElectronClient extends Client_1.Client {
    constructor(player, sender, receiver) {
        super(player);
        _eventEmitter.set(this, void 0);
        _gameData.set(this, {});
        _patchData.set(this, {});
        _previousData.set(this, { hierarchy: {}, objects: {} });
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
            const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
            this.addPatchFor(tile);
            if (!__classPrivateFieldGet(this, _previousData).objects[playerWorld.id()]) {
                this.addPatchFor(playerWorld);
            }
            this.addPatch({
                [playerWorld.id()]: {
                    tiles: {
                        [__classPrivateFieldGet(this, _previousData).objects[playerWorld.id()].tiles.length]: {
                            '#ref': tile.id(),
                        },
                    },
                },
            });
        });
        ['unit:created', 'unit:destroyed'].forEach((event) => {
            Engine_1.instance.on(event, (unit) => {
                var _a;
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (!playerWorld.includes(unit.tile())) {
                    return;
                }
                console.log(event);
                console.log(unit.id());
                if (event === 'unit:created') {
                    this.addPatchFor(unit);
                    this.addPatch({
                        [unit.player().id()]: {
                            units: {
                                [UnitRegistry_1.instance.getByPlayer(unit.player()).length]: {
                                    '#ref': unit.id(),
                                },
                            },
                        },
                    });
                    return;
                }
                // event === 'unit:destroyed'
                // TODO: This will leave orphans (improvements, etc...)
                //  have a new Worker spawned every turn (?) to return a list of orphaned keys to strip, asynchronously
                this.addPatch({
                    [unit.id()]: undefined,
                });
                this.addPatchData(...[unit.player().id(), unit.tile().id(), (_a = unit.city()) === null || _a === void 0 ? void 0 : _a.id()].filter((id) => id !== null).map((id) => this.removeFromCollection(id, unit, 'units')));
            });
        });
        ['unit:moved'].forEach((event) => {
            Engine_1.instance.on(event, (unit, action) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                // Don't care about anything that's entirely outside our World
                if (!playerWorld.includes(action.from()) &&
                    !playerWorld.includes(action.to())) {
                    return;
                }
                this.addPatchFor(unit);
                if (action.to() !== action.from()) {
                    this.addPatchFor(action.from());
                }
            });
        });
        ['tile-improvement:built', 'tile-improvement:pillaged'].forEach((event) => {
            Engine_1.instance.on(event, (tile) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (!playerWorld.includes(tile)) {
                    return;
                }
                this.addPatchFor(tile);
            });
        });
        ['city:created', 'city:destroyed'].forEach((event) => {
            Engine_1.instance.on(event, (city) => {
                const playerWorld = PlayerWorldRegistry_1.instance.getByPlayer(this.player());
                if (!playerWorld.includes(city.tile())) {
                    return;
                }
                this.addPatchFor(city);
                if (event === 'city:created') {
                    this.addPatch({
                        [city.player().id()]: {
                            cities: {
                                [CityRegistry_1.instance.getByPlayer(city.player())
                                    .length]: this.referenceTo(city),
                            },
                        },
                    });
                    return;
                }
                this.addPatch(this.removeFromCollection(this.player().id(), city, 'cities'));
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
        const firstTurnHandler = (player) => {
            if (player !== this.player()) {
                return;
            }
            this.sendInitialData();
            Engine_1.instance.off('player:turn-start', firstTurnHandler);
        };
        Engine_1.instance.on('player:turn-start', firstTurnHandler);
        Engine_1.instance.on('turn:start', () => {
            CityRegistry_1.instance
                .getByPlayer(this.player())
                .forEach((city) => this.addPatchFor(CityBuildRegistry_1.instance.getByCity(city), CityGrowthRegistry_1.instance.getByCity(city)));
            this.addPatchFor(PlayerResearchRegistry_1.instance.getByPlayer(player));
            this.addPatchFor(PlayerTreasuryRegistry_1.instance.getByPlayer(player));
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
        console.log(`unhandled action: ${JSON.stringify(action)}`);
        return false;
    }
    toPlainObjectFilter(entity) {
        if (entity instanceof Player_1.default) {
            if (entity === this.player()) {
                return {
                    '#ref': this.player().id(),
                };
            }
            return EnemyPlayer_1.default.get(entity);
        }
        if (entity instanceof Unit_1.default && entity.player() !== this.player()) {
            return EnemyUnit_1.default.get(entity);
        }
        if (entity instanceof City_1.default && entity.player() !== this.player()) {
            return EnemyCity_1.default.get(entity);
        }
        if (entity instanceof Tile_1.default) {
            return BasicTile_1.default.get(entity, this.player());
        }
        // Simplifying Yields instead of having them as `DataObject`s with an `id`... Save data transfer!
        //  Alternative is to create all the `Yield`s when the parent object is instantiated (`Tile`, `Unit`, etc) and have
        //  them update when the values change... Feels like it would be nicer, but might be a little more tricky...
        if (entity instanceof Yield_1.default) {
            return {
                _: entity.constructor.name,
                value: entity.value(),
                values: entity.values().map((yieldValue) => ({
                    provider: yieldValue.provider(),
                    value: yieldValue.value(),
                })),
            };
        }
        return entity;
    }
    sendInitialData() {
        const rawData = {
            player: this.player(),
            turn: Turn_1.instance,
            year: Year_1.instance,
        };
        const dataObject = new TransferObject_1.default(rawData).toPlainObject((entity) => {
            if (entity === this.player()) {
                return this.player();
            }
            return this.toPlainObjectFilter(entity);
        });
        __classPrivateFieldGet(this, _sender).call(this, 'initialData', dataObject);
        // console.log(dataObject);
        __classPrivateFieldSet(this, _previousData, dataObject);
        __classPrivateFieldSet(this, _gameData, reconstituteData_1.default(dataObject));
    }
    sendGameData() {
        const actions = this.player().actions();
        this.addPatch({
            [this.player().id()]: {
                actions: [],
                mandatoryActions: [],
            },
        });
        actions.forEach((action, index) => {
            const { objects } = action.toPlainObject((entity) => this.toPlainObjectFilter(entity));
            this.addPatch(objects);
            this.addPatch({
                [this.player().id()]: {
                    actions: {
                        [index]: this.referenceTo(action),
                    },
                },
            });
        });
        this.addPatch({
            [this.player().id()]: {
                mandatoryActions: actions
                    .filter((action) => action instanceof MandatoryPlayerAction_1.default)
                    .map((action) => this.referenceTo(action)),
            },
        });
        // const data = new TransferObject(this.#gameData).toPlainObject((entity) =>
        //     this.toPlainObjectFilter(entity)
        //   ),
        //   dataDiff = diff(this.#previousData, data);
        // console.log(this.#previousData);
        // console.log(data.constructor.name);
        // console.log(dataDiff);
        __classPrivateFieldGet(this, _sender).call(this, 'gameDataPatch', __classPrivateFieldGet(this, _patchData));
        __classPrivateFieldSet(this, _patchData, {});
        // this.#patchData = [];
        // this.#previousData = data;
        // this.#gameData = reconstituteData(data);
    }
    sendNotification(message) {
        __classPrivateFieldGet(this, _sender).call(this, 'gameNotification', {
            message: message,
        });
    }
    // Called externally
    takeTurn() {
        return new Promise((resolve, reject) => {
            this.sendGameData();
            const listener = (...args) => {
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
    addPatch(...patches) {
        patches.forEach((patch) => {
            this.addPatchData(patch);
            this.applyPatch(patch);
        });
    }
    addPatchFor(...dataObjects) {
        dataObjects.forEach((data) => {
            const { objects } = data.toPlainObject((entity) => this.toPlainObjectFilter(entity));
            Object.entries(objects)
                .filter(([key, value]) => {
                if (key === 'player') {
                    console.log('player');
                    console.log(value);
                }
                if (key === this.player().id()) {
                    console.log('player id');
                    console.log(value);
                }
                if (value['#ref'] === this.player().id()) {
                    console.log('player ref');
                    console.log(value);
                }
                return true;
            })
                .forEach(([key, value]) => {
                if (value && value['#ref']) {
                    return this.addPatch({
                        [key]: value,
                    });
                }
                if (key === this.player().id()) {
                    console.log('PROBLEM');
                }
                return this.addPatch({
                    // [key]: diff(this.#previousData.objects[key], value),
                    [key]: value,
                });
            });
        });
    }
    addPatchData(...patches) {
        patches.forEach((patch) => this.applyPatch(patch, __classPrivateFieldGet(this, _patchData)));
    }
    applyPatch(patch, to = __classPrivateFieldGet(this, _previousData).objects) {
        Object.entries(patch).forEach(([key, value]) => {
            if (value === undefined) {
                delete to[key];
                return;
            }
            if (Array.isArray(value)) {
                to[key] = value;
                return;
            }
            if (to[key] !== null &&
                typeof to[key] === 'object' &&
                value !== null &&
                typeof value === 'object') {
                return this.applyPatch(value, to[key]);
            }
            to[key] = value;
        });
    }
    referenceTo(data) {
        return {
            '#ref': data.id(),
        };
    }
    removeFromCollection(parentId, entity, key) {
        var _a;
        const parentObject = __classPrivateFieldGet(this, _previousData).objects[parentId];
        if (!parentObject) {
            return {};
        }
        const current = (_a = parentObject[key]) !== null && _a !== void 0 ? _a : [];
        if (parentObject[key] === undefined) {
            console.log('missing data for ' + key);
            console.log(parentObject);
        }
        __classPrivateFieldGet(this, _previousData).objects[parentId][key] = current.filter((objectReference) => objectReference['#ref'] !== entity.id());
        return {
            [parentId]: {
                [key]: __classPrivateFieldGet(this, _previousData).objects[parentId][key],
            },
        };
    }
}
exports.ElectronClient = ElectronClient;
_eventEmitter = new WeakMap(), _gameData = new WeakMap(), _patchData = new WeakMap(), _previousData = new WeakMap(), _sender = new WeakMap(), _receiver = new WeakMap();
exports.default = ElectronClient;
//# sourceMappingURL=ElectronClient.js.map