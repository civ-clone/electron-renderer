import { reconstituteData } from './lib/reconstituteData.js';
import Actions from './components/Actions.js';
import ActiveUnit from './components/Map/ActiveUnit.js';
import Cities from './components/Map/Cities.js';
import City from './components/City.js';
import EventHandler from './lib/EventHandler.js';
import GameDetails from './components/GameDetails.js';
import IntervalHandler from './lib/IntervalHandler.js';
import Notifications from './components/Notifications.js';
import PlayerDetails from './components/PlayerDetails.js';
import Portal from './components/Portal.js';
import Terrain from './components/Map/Terrain.js';
import UnitDetails from './components/UnitDetails.js';
import Units from './components/Map/Units.js';
import World from './components/World.js';
import Yields from './components/Map/Yields.js';
import MainMenu from './components/MainMenu.js';
try {
    ((transport) => {
        const notificationArea = document.getElementById('notification'), mainMenuElement = document.querySelector('#mainmenu'), actionArea = document.getElementById('actions'), gameArea = document.getElementById('game'), mapWrapper = document.getElementById('map'), mapPortal = mapWrapper.querySelector('canvas'), gameInfo = document.getElementById('gameDetails'), playerInfo = document.getElementById('playerDetails'), minimap = document.getElementById('minimap'), unitInfo = document.getElementById('unitInfo'), notifications = new Notifications(), mainMenu = new MainMenu(mainMenuElement);
        let globalNotificationTimer, lastUnit;
        transport.receive('notification', (data) => {
            notificationArea.innerHTML = data;
            if (globalNotificationTimer) {
                window.clearTimeout(globalNotificationTimer);
            }
            globalNotificationTimer = window.setTimeout(() => {
                globalNotificationTimer = undefined;
                notificationArea.innerText = '';
            }, 4000);
        });
        transport.receiveOnce('gameData', (objectMap) => {
            const data = reconstituteData(objectMap);
            gameArea.classList.add('active');
            mapPortal.width = mapPortal.parentElement.offsetWidth;
            mapPortal.height = mapPortal.parentElement.offsetHeight;
            const world = new World(data.player.world);
            let activeUnit = null, activeUnits = [], shouldBuild = true;
            const intervalHandler = new IntervalHandler(), eventHandler = new EventHandler(), terrainMap = new Terrain(world), yieldsMap = new Yields(world), unitsMap = new Units(world), citiesMap = new Cities(world), activeUnitsMap = new ActiveUnit(world);
            yieldsMap.setVisible(false);
            const portal = new Portal(world, mapPortal, terrainMap, yieldsMap, unitsMap, citiesMap, activeUnitsMap);
            intervalHandler.on(() => {
                activeUnitsMap.setVisible(!activeUnitsMap.isVisible());
                if (shouldBuild) {
                    portal.build();
                    shouldBuild = false;
                }
                portal.render();
            });
            window.addEventListener('resize', () => {
                mapPortal.width = mapPortal.parentElement.offsetWidth;
                mapPortal.height = mapPortal.parentElement.offsetHeight;
            });
            const handler = (objectMap) => {
                const data = reconstituteData(objectMap);
                const actions = new Actions(data.player.mandatoryActions, actionArea);
                gameArea.append(actions.element());
                world.setTileData(data.player.world.tiles);
                const gameDetails = new GameDetails(gameInfo, data.turn, data.year);
                gameDetails.build();
                const playerDetails = new PlayerDetails(playerInfo, data.player);
                playerDetails.build();
                activeUnits = data.player.actions.filter((action) => action._ === 'ActiveUnit');
                // This prioritises units that are already on screen
                const [activeUnitAction,] = activeUnits.sort(({ value: unitA }, { value: unitB }) => unitB === lastUnit
                    ? 1
                    : unitA === lastUnit
                        ? -1
                        : (portal.isVisible(unitB.tile.x, unitB.tile.y)
                            ? 1
                            : 0) -
                            (portal.isVisible(unitA.tile.x, unitA.tile.y)
                                ? 1
                                : 0));
                activeUnit = activeUnitAction ? activeUnitAction.value : null;
                unitsMap.setActiveUnit(activeUnit);
                activeUnitsMap.setActiveUnit(activeUnit);
                const unitDetails = new UnitDetails(unitInfo, activeUnit);
                unitDetails.build();
                if (activeUnit) {
                    lastUnit = activeUnit;
                    unitsMap.setActiveUnit(activeUnit);
                    activeUnitsMap.setActiveUnit(activeUnit);
                    if (!portal.isVisible(activeUnit.tile.x, activeUnit.tile.y)) {
                        portal.setCenter(activeUnit.tile.x, activeUnit.tile.y);
                        portal.render();
                    }
                }
                shouldBuild = true;
                const minimapContext = minimap.getContext('2d');
                minimap.height =
                    terrainMap.canvas().height * (190 / terrainMap.canvas().width);
                minimapContext.drawImage(terrainMap.canvas(), 0, 0, 190, minimap.height);
                // ensure UI looks responsive
                portal.build();
                portal.render();
                // TODO: make this an option
                if (data.player.mandatoryActions.length === 0) {
                    transport.send('action', {
                        name: 'EndOfTurn',
                    });
                }
            };
            handler(objectMap);
            transport.receive('gameData', handler);
            transport.receive('gameNotification', (data) => {
                notifications.receive(data);
            });
            document.addEventListener('click', (event) => {
                if (!event.target) {
                    return;
                }
                const target = event.target;
                if (target.matches('.notificationWindow button[data-action="close"]')) {
                    const parent = target.parentElement;
                    if (!parent) {
                        return;
                    }
                    parent.remove();
                }
                if (event.target === mapPortal) {
                    const tileSize = terrainMap.tileSize(), currentCenter = portal.center();
                    let x = event.offsetX, y = event.offsetY;
                    x =
                        (x - (mapPortal.width / 2 - tileSize / 2)) / tileSize +
                            currentCenter.x;
                    y =
                        (y - (mapPortal.height / 2 - tileSize / 2)) / tileSize +
                            currentCenter.y;
                    while (x < 0) {
                        x += world.width();
                    }
                    while (y < 0) {
                        y += world.height();
                    }
                    while (x > world.width()) {
                        x -= world.width();
                    }
                    while (y > world.height()) {
                        y -= world.height();
                    }
                    const tile = world.get(Math.trunc(x), Math.trunc(y));
                    if (tile.city) {
                        const cityView = new City(tile.city);
                        gameArea.append(cityView.element());
                    }
                    else if (tile.units.length) {
                        console.log(tile.units);
                    }
                    else {
                        portal.setCenter(tile.x, tile.y);
                    }
                }
            });
            const keyToActionsMap = {
                ' ': ['NoOrders'],
                b: ['FoundCity'],
                D: ['Disband'],
                f: ['Fortify', 'BuildFortress'],
                i: ['BuildIrrigation', 'ClearForest'],
                m: ['BuildMine', 'PlantForest'],
                P: ['Pillage'],
                r: ['BuildRoad', 'BuildRailroad'],
                s: ['Sleep'],
                u: ['Unload'],
                w: ['Wait'],
            }, directionKeyMap = {
                ArrowUp: 'n',
                PageUp: 'ne',
                ArrowRight: 'e',
                PageDown: 'se',
                ArrowDown: 's',
                End: 'sw',
                ArrowLeft: 'w',
                Home: 'nw',
            };
            eventHandler.on('keydown', (event) => {
                if (activeUnit) {
                    if (event.key in keyToActionsMap) {
                        const actions = [...keyToActionsMap[event.key]];
                        while (actions.length) {
                            const actionName = actions.shift(), [unitAction] = activeUnit.actions.filter((action) => action._ === actionName);
                            if (unitAction) {
                                transport.send('action', {
                                    name: 'ActiveUnit',
                                    id: activeUnit.id,
                                    unitAction: unitAction._,
                                    target: unitAction.to.id,
                                });
                                event.stopPropagation();
                                event.preventDefault();
                                return;
                            }
                        }
                    }
                    if (event.key in directionKeyMap) {
                        const [unitAction] = activeUnit.actionsForNeighbours[directionKeyMap[event.key]];
                        if (unitAction) {
                            transport.send('action', {
                                name: 'ActiveUnit',
                                id: activeUnit.id,
                                unitAction: unitAction._,
                                target: unitAction.to.id,
                            });
                            event.stopPropagation();
                            event.preventDefault();
                            return;
                        }
                    }
                }
                if (event.key === 'Enter') {
                    transport.send('action', {
                        name: 'EndOfTurn',
                    });
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
                if (event.key === 'c') {
                    if (activeUnit) {
                        portal.setCenter(activeUnit.tile.x, activeUnit.tile.y);
                        portal.render();
                    }
                }
                if (event.key === 't') {
                    unitsMap.setVisible(!unitsMap.isVisible());
                    citiesMap.setVisible(!citiesMap.isVisible());
                    activeUnitsMap.setVisible(!activeUnitsMap.isVisible());
                    portal.render();
                }
                if (event.key === 'y') {
                    yieldsMap.setVisible(!yieldsMap.isVisible());
                    portal.render();
                }
            });
            document.addEventListener('keydown', (event) => eventHandler.handle('keydown', event));
        });
    })({
        sendingData: false,
        receive(channel, handler) {
            transport.receive(channel, (...args) => {
                if (channel === 'gameData' && this.sendingData) {
                    this.sendingData = false;
                }
                handler(...args);
            });
        },
        receiveOnce: transport.receiveOnce,
        send(channel, payload) {
            // throttle 'action' requests
            if (channel === 'action') {
                if (this.sendingData) {
                    return;
                }
                this.sendingData = true;
            }
            transport.send(channel, payload);
        },
    });
}
catch (e) {
    console.error(e);
}
//# sourceMappingURL=renderer.js.map