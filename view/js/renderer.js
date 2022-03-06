import { e, t } from './lib/html.js';
import { reconstituteData } from './lib/reconstituteData.js';
import Actions from './components/Actions.js';
import ActiveUnit from './components/Map/ActiveUnit.js';
import Cities from './components/Map/Cities.js';
import City from './components/City.js';
import CityNames from './components/Map/CityNames.js';
import EventHandler from './lib/EventHandler.js';
import Feature from './components/Map/Feature.js';
import Fog from './components/Map/Fog.js';
import GameDetails from './components/GameDetails.js';
import GoodyHuts from './components/Map/GoodyHuts.js';
import Improvements from './components/Map/Improvements.js';
import IntervalHandler from './lib/IntervalHandler.js';
import Irrigation from './components/Map/Irrigation.js';
import Land from './components/Map/Land.js';
import MainMenu from './components/MainMenu.js';
import Minimap from './components/Minimap.js';
import NotificationWindow from './components/NotificationWindow.js';
import Notifications from './components/Notifications.js';
import PlayerDetails from './components/PlayerDetails.js';
import Portal from './components/Portal.js';
import SelectionWindow from './components/SelectionWindow.js';
import Terrain from './components/Map/Terrain.js';
import UnitDetails from './components/UnitDetails.js';
import Units from './components/Map/Units.js';
import World from './components/World.js';
import Yields from './components/Map/Yields.js';
const options = {
    autoEndOfTurn: true,
};
try {
    const notificationArea = document.getElementById('notification'), mainMenuElement = document.querySelector('#mainmenu'), actionArea = document.getElementById('actions'), gameArea = document.getElementById('game'), mapWrapper = document.getElementById('map'), mapPortal = mapWrapper.querySelector('canvas'), gameInfo = document.getElementById('gameDetails'), playerInfo = document.getElementById('playerDetails'), minimapCanvas = document.getElementById('minimap'), unitInfo = document.getElementById('unitInfo'), notifications = new Notifications(), actions = new Actions(actionArea), mainMenu = new MainMenu(mainMenuElement);
    const tilesToRender = [];
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
    [
        ['chooseCivilization', 'Choose your civilization'],
        ['chooseLeader', 'Choose your leader'],
    ].forEach(([channel, label]) => transport.receive(channel, (rawData) => {
        const { choices } = reconstituteData(rawData);
        new SelectionWindow(label, choices.map(({ _: choice }) => ({
            label: choice,
            value: choice,
        })), (choice) => transport.send(channel, choice), label, {
            displayAll: true,
        });
    }));
    transport.receiveOnce('gameData', (objectMap) => {
        const data = reconstituteData(objectMap);
        // TODO: use Intl.ListFormat if available
        new NotificationWindow('Welcome', e('div.welcome', e('p', t(`${data.player.civilization.leader.name}, you have risen to become leader of the ${data.player.civilization._}.`)), e('p', t(`Your people have knowledge of ${[
            'Irrigation',
            'Mining',
            'Roads',
            ...data.player.research.complete,
        ].join(', ')}`))));
        gameArea.classList.add('active');
        mapPortal.width = mapPortal.parentElement.offsetWidth;
        mapPortal.height = mapPortal.parentElement.offsetHeight;
        const world = new World(data.player.world);
        let activeUnit = null, activeUnits = [];
        const intervalHandler = new IntervalHandler(), eventHandler = new EventHandler(), landMap = new Land(world), irrigationMap = new Irrigation(world), terrainMap = new Terrain(world), improvementsMap = new Improvements(world), featureMap = new Feature(world), goodyHutsMap = new GoodyHuts(world), fogMap = new Fog(world), yieldsMap = new Yields(world), unitsMap = new Units(world), citiesMap = new Cities(world), cityNamesMap = new CityNames(world), activeUnitsMap = new ActiveUnit(world);
        yieldsMap.setVisible(false);
        const portal = new Portal(world, mapPortal, landMap, irrigationMap, terrainMap, improvementsMap, featureMap, goodyHutsMap, fogMap, yieldsMap, unitsMap, citiesMap, cityNamesMap, activeUnitsMap), minimap = new Minimap(minimapCanvas, world, portal, landMap, citiesMap);
        intervalHandler.on(() => {
            activeUnitsMap.setVisible(!activeUnitsMap.isVisible());
            portal.build(tilesToRender.splice(0));
            portal.render();
        });
        window.addEventListener('resize', () => {
            mapPortal.width = mapPortal.parentElement.offsetWidth;
            mapPortal.height = mapPortal.parentElement.offsetHeight;
        });
        // This needs wrapping.
        let lastTurn = 1, clearNextTurn = false;
        const handler = (objectMap) => {
            let orphanIds = clearNextTurn ? [] : null;
            const data = reconstituteData(objectMap, orphanIds);
            // A bit crude, I'd like to run this as as background job too
            if (orphanIds) {
                // clean up orphan data
                orphanIds.forEach((id) => delete objectMap.objects[id]);
                clearNextTurn = false;
            }
            document.dispatchEvent(new CustomEvent('dataupdated', {
                detail: {
                    data,
                },
            }));
            if (lastTurn !== data.turn.value) {
                clearNextTurn = true;
                lastTurn = data.turn.value;
            }
            actions.build(data.player.mandatoryActions);
            gameArea.append(actions.element());
            world.setTileData(data.player.world.tiles);
            const gameDetails = new GameDetails(gameInfo, data.turn, data.year);
            gameDetails.build();
            const playerDetails = new PlayerDetails(playerInfo, data.player);
            playerDetails.build();
            activeUnits = data.player.actions.filter((action) => action._ === 'ActiveUnit');
            // This prioritises units that are already on screen
            const [activeUnitAction] = activeUnits.sort(({ value: unitA }, { value: unitB }) => unitB === lastUnit
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
                unitsMap.update([
                    ...(lastUnit && lastUnit.tile ? [lastUnit.tile] : []),
                    activeUnit.tile,
                ]);
                lastUnit = activeUnit;
                unitsMap.setActiveUnit(activeUnit);
                activeUnitsMap.setActiveUnit(activeUnit);
                if (!portal.isVisible(activeUnit.tile.x, activeUnit.tile.y)) {
                    portal.setCenter(activeUnit.tile.x, activeUnit.tile.y);
                    portal.render();
                }
            }
            // ensure UI looks responsive
            portal.build(tilesToRender.splice(0));
            portal.render();
            minimap.update();
            if (options.autoEndOfTurn &&
                data.player.mandatoryActions.length === 1 &&
                data.player.mandatoryActions.every((action) => action._ === 'EndTurn')) {
                transport.send('action', {
                    name: 'EndTurn',
                });
                return;
            }
        };
        handler(objectMap);
        transport.receive('gameData', (data) => {
            console.log('gameData called again');
            handler(data);
        });
        const pathToParts = (path) => path.replace(/]/g, '').split(/[.[]/), getPenultimateObject = (object, path) => {
            const parts = pathToParts(path), lastPart = parts.pop();
            const tmpObj = parts.reduce((tmpObj, part) => {
                if (!tmpObj || !(part in tmpObj)) {
                    return null;
                }
                return tmpObj[part];
            }, object);
            return [tmpObj, lastPart];
        }, setObjectPath = (object, path, value) => {
            const [tmpObj, lastPart] = getPenultimateObject(object, path);
            if (!tmpObj || !lastPart) {
                console.warn(`unable to set ${path} of ${object} (${lastPart})`);
                return;
            }
            tmpObj[lastPart] = value;
        }, removeObjectPath = (object, path) => {
            const [tmpObj, lastPart] = getPenultimateObject(object, path);
            if (!tmpObj || !lastPart) {
                console.warn(`unable to set ${path} of ${object} (${lastPart})`);
                return;
            }
            delete tmpObj[lastPart];
        };
        transport.receive('gameDataPatch', (data) => {
            data.forEach((patch) => Object.entries(patch).forEach(([key, { type, index, value }]) => {
                if (type === 'add' || type === 'update') {
                    if (!value.hierarchy) {
                        console.error('No hierarchy');
                        console.error(value);
                        return;
                    }
                    if (index) {
                        setObjectPath(objectMap.objects[key], index, value.hierarchy);
                    }
                    else {
                        objectMap.objects[key] = value.hierarchy;
                    }
                    document.dispatchEvent(new CustomEvent('patchdatareceived', {
                        detail: {
                            value,
                        },
                    }));
                    Object.entries(value.objects).forEach(([key, value]) => {
                        objectMap.objects[key] = value;
                        if (value._ === 'Tile') {
                            // Since we only use tilesToRender for x and y this should be fine...
                            tilesToRender.push(value);
                        }
                    });
                }
                if (type === 'remove') {
                    if (index) {
                        removeObjectPath(objectMap.objects[key], index);
                        return;
                    }
                    delete objectMap.objects[key];
                }
            }));
            handler(objectMap);
        });
        transport.receive('gameNotification', (data) => notifications.receive(data));
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
                    new City(tile.city);
                }
                else if (tile.units.length) {
                    console.log(tile.units);
                }
                else {
                    portal.setCenter(tile.x, tile.y);
                    minimap.update();
                }
            }
        });
        const keyToActionsMap = {
            ' ': ['NoOrders'],
            b: ['FoundCity'],
            D: ['Disband'],
            f: ['Fortify', 'BuildFortress'],
            i: ['BuildIrrigation', 'ClearForest', 'ClearSwamp', 'ClearJungle'],
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
        }, directionKeyMapNumpad = {
            8: 'n',
            9: 'ne',
            6: 'e',
            3: 'se',
            2: 's',
            1: 'sw',
            4: 'w',
            7: 'nw',
        }, directionKeyTypeMap = {
            [KeyboardEvent.DOM_KEY_LOCATION_STANDARD]: directionKeyMap,
            [KeyboardEvent.DOM_KEY_LOCATION_NUMPAD]: directionKeyMapNumpad,
        };
        let lastKey = '';
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
                // if (event.key in directionKeyTypeMap[event.location]) {
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
                    name: 'EndTurn',
                });
                event.stopPropagation();
                event.preventDefault();
                return;
            }
            if (event.key === 'Tab') {
                const bottomAction = actionArea.querySelector('div.action:last-child button');
                if (bottomAction !== null) {
                    bottomAction.focus();
                }
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
                cityNamesMap.setVisible(!cityNamesMap.isVisible());
                activeUnitsMap.setVisible(!activeUnitsMap.isVisible());
                portal.render();
            }
            if (event.key === 'y') {
                yieldsMap.setVisible(!yieldsMap.isVisible());
                portal.render();
            }
            if (lastKey === '%' && event.key === '^') {
                transport.send('cheat', { name: 'RevealMap' });
            }
            lastKey = event.key;
        });
        document.addEventListener('keydown', (event) => eventHandler.handle('keydown', event));
    });
}
catch (e) {
    console.error(e);
}
//# sourceMappingURL=renderer.js.map