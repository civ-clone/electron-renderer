import Map from './components/Map.js';
import Notifications from './components/Notifications.js';
import World from './components/World.js';
import { e, h, t } from './lib/html.js';
import { reconstituteData } from './lib/reconstituteData.js';
const notificationArea = document.getElementById('notification'), startButton = document.querySelector('button'), actionArea = document.getElementById('actions'), gameArea = document.getElementById('game'), mapWrapper = document.getElementById('map'), mapPortal = mapWrapper.querySelector('canvas'), yearWrapper = document.getElementById('year'), turnWrapper = document.getElementById('turn'), playersWrapper = document.getElementById('players'), notifications = new Notifications();
let globalNotificationTimer;
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
const height = 60, width = 80, world = new World(height, width), center = {
    x: 0,
    y: 0,
};
let activeUnit;
transport.receive('gameData', (objectMap) => {
    const data = reconstituteData(objectMap);
    gameArea.classList.add('active');
    turnWrapper.innerText = data.turn.value + '';
    yearWrapper.innerText = ((year) => {
        if (year < 0) {
            return Math.abs(year) + ' BCE';
        }
        if (year === 0) {
            return '1 CE';
        }
        return year + ' CE';
    })(data.year.value);
    world.setTileData(data.player.world);
    const [activeUnitAction] = data.player.actions.filter((action) => action._ === 'ActiveUnit');
    activeUnit = activeUnitAction && activeUnitAction.value;
    if (activeUnit) {
        center.x = activeUnit.tile.x;
        center.y = activeUnit.tile.y;
    }
    try {
        const offscreenMap = e('canvas'), map = new Map(world, offscreenMap), portalContext = mapPortal.getContext('2d'), sourceX = center.x * (map.tileSize() * map.scale()) -
            mapPortal.offsetWidth / 2 -
            (map.tileSize() * map.scale()) / 2, sourceY = center.y * (map.tileSize() * map.scale()) -
            mapPortal.offsetHeight / 2 -
            (map.tileSize() * map.scale()) / 2;
        offscreenMap.height = height * map.tileSize();
        offscreenMap.width = width * map.tileSize();
        offscreenMap.setAttribute('height', (height * map.tileSize() * map.scale()).toString());
        offscreenMap.setAttribute('width', (width * map.tileSize() * map.scale()).toString());
        map.render();
        // TODO: render the map around for map edges
        portalContext.drawImage(offscreenMap, sourceX, sourceY, mapPortal.width, mapPortal.height, 0, 0, mapPortal.width, mapPortal.height);
    }
    catch (e) {
        console.error(e);
    }
    const renderCity = (city) => e('div', e('h4', t(`${city.name} (${city.tile.x},${city.tile.y})`)), e('h5', t('Yields')), e('dl', ...city.yields.flatMap((cityYield) => [
        e('dd', t(cityYield._)),
        e('dt', t(`${cityYield.value}`)),
    ])), e('ul', ...(city.improvements || [{ _: 'Missing improvements' }]).map((i) => e('li', t(i ? i._ : '@')))), e('dl', e('dd', t('Size:')), e('dt', t(`${city.growth.size} (${city.growth.progress.value}/${city.growth.cost.value})`)), e('dd', t('Building:')), e('dt', t(`${city.build
        ? city.build.building
            ? city.build.building._
            : 'Nothing'
        : 'No CityBuild'} (${city.build.progress.value}/${city.build.cost.value})`)))), renderPlayer = (player) => e('div', e('h2', t(`${player.civilization && player.civilization.leader
        ? player.civilization.leader.name
        : '@'} of the ${player.civilization ? player.civilization._ : '@'} empire`)), e('div', e('h2', t(`Research`)), e('p', t(`${player.research.researching
        ? player.research.researching._
        : 'Nothing'} (${player.research.progress.value}/${player.research.cost.value})`)), e('ul', ...player.research.complete.map((a) => e('li', t(a._))))), e('div', e('h2', t(`Treasury`)), e('p', t(`${player.treasury ? player.treasury.value : '@'}`))), e('div', e('h2', t(`Government`)), e('p', t(`${player.government.current ? player.government.current._ : '@'}`))), e('h3', t(`Cities (${player.cities ? player.cities.length : 'Missing cities'})`)), e('div', ...(player.cities || []).map((city) => renderCity(city)))), renderEntityAction = (action, entity, chosen) => h(e('button', t(chosen ? chosen._ : '@')), {
        click() {
            transport.send('action', {
                name: action._,
                id: entity.id,
                chosen: chosen ? chosen._ : '@',
            });
        },
    });
    try {
        // @ts-ignore
        [...playersWrapper.children].forEach((e) => e.remove());
        playersWrapper.append(renderPlayer(data.player));
    }
    catch (e) {
        console.error(e);
    }
    // @ts-ignore
    [...actionArea.children].forEach((e) => e.remove());
    if (!data.player.mandatoryActions.length)
        actionArea.append(h(e('button', t('End Turn')), {
            click() {
                transport.send('action', {
                    name: 'EndOfTurn',
                });
            },
        }));
    // TODO: Model this better
    (data.player.actions || []).forEach((action) => {
        actionArea.append(e('h4', t(action ? action._ : '@')));
        if (action._ === 'CityBuild' || action._ === 'ChooseResearch') {
            const value = action.value;
            value.available.forEach((entity) => actionArea.append(renderEntityAction(action, value, entity)));
        }
    });
});
transport.receive('gameNotification', (data) => {
    notifications.receive(data);
});
document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', () => {
        transport.send('start');
        startButton.remove();
    });
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
});
const keyToActionsMap = {
    b: ['FoundCity'],
    D: ['Disband'],
    f: ['Fortify', 'BuildFortress'],
    i: ['BuildIrrigation', 'ClearForest'],
    m: ['BuildMine', 'PlantForest'],
    P: ['Pillage'],
    r: ['BuildRoad', 'BuildRailroad'],
    s: ['Sleep'],
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
document.addEventListener('keydown', (event) => {
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
});
//# sourceMappingURL=renderer.js.map