var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _stack;
import { e, h, t } from './lib/html.js';
import { reconstituteData } from './lib/reconstituteData.js';
import ActiveUnit from './components/Map/ActiveUnit.js';
import Full from './components/Map/Full.js';
import Notifications from './components/Notifications.js';
import World from './components/World.js';
import Cities from './components/Map/Cities.js';
import Units from './components/Map/Units.js';
import Yields from './components/Map/Yields.js';
const notificationArea = document.getElementById('notification'), startButton = document.querySelector('button'), actionArea = document.getElementById('actions'), gameArea = document.getElementById('game'), mapWrapper = document.getElementById('map'), mapPortal = mapWrapper.querySelector('canvas'), yearWrapper = document.getElementById('year'), turnWrapper = document.getElementById('turn'), playersWrapper = document.getElementById('players'), minimap = document.getElementById('minimap'), unitInfo = document.getElementById('unitInfo'), notifications = new Notifications();
let globalNotificationTimer, showYields = false;
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
let activeUnit, activeUnits = [];
window.addEventListener('resize', () => {
    mapPortal.width = mapPortal.offsetWidth;
    mapPortal.height = mapPortal.offsetHeight;
});
class IntervalHandler {
    constructor(tick = 500) {
        _stack.set(this, []);
        setInterval(() => this.check(), tick);
    }
    check() {
        __classPrivateFieldGet(this, _stack).forEach((item) => item());
    }
    clear() {
        __classPrivateFieldSet(this, _stack, []);
    }
    off(handler) {
        __classPrivateFieldSet(this, _stack, __classPrivateFieldGet(this, _stack).filter((item) => item !== handler));
    }
    on(handler) {
        __classPrivateFieldGet(this, _stack).push(handler);
    }
}
_stack = new WeakMap();
const intervalHandler = new IntervalHandler();
transport.receive('gameData', (objectMap) => {
    const data = reconstituteData(objectMap);
    intervalHandler.clear();
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
    activeUnits = data.player.actions.filter((action) => action._ === 'ActiveUnit');
    const [activeUnitAction] = activeUnits;
    activeUnit = activeUnitAction ? activeUnitAction.value : null;
    if (activeUnit) {
        center.x = activeUnit.tile.x;
        center.y = activeUnit.tile.y;
        unitInfo.innerHTML = `
<p>${activeUnit.player.civilization._} ${activeUnit._}</p>
<p>${activeUnit.moves.value} / ${activeUnit.movement.value} moves</p>
<p>A: ${activeUnit.attack.value} / D: ${activeUnit.defence.value} / V: ${activeUnit.visibility.value}</p>
<p>${activeUnit.improvements.map((improvement) => improvement._).join('')}</p>
`;
    }
    try {
        const layers = [], portalContext = mapPortal.getContext('2d'), setCanvasSize = (canvas) => {
            canvas.height = height * fullMap.tileSize();
            canvas.width = width * fullMap.tileSize();
            canvas.setAttribute('height', (height * fullMap.tileSize()).toString());
            canvas.setAttribute('width', (width * fullMap.tileSize()).toString());
            return canvas;
        };
        mapPortal.width = mapPortal.offsetWidth;
        mapPortal.height = mapPortal.offsetHeight;
        const fullCanvas = e('canvas'), fullMap = new Full(world, fullCanvas);
        setCanvasSize(fullCanvas);
        fullMap.render();
        layers.push(fullCanvas);
        const unitCanvas = e('canvas'), unitMap = new Units(world, unitCanvas);
        setCanvasSize(unitCanvas);
        unitMap.render(world.tiles(), activeUnit);
        layers.push(unitCanvas);
        const citiesCanvas = e('canvas'), citiesMap = new Cities(world, citiesCanvas);
        setCanvasSize(citiesCanvas);
        citiesMap.render();
        layers.push(citiesCanvas);
        const yieldsCanvas = e('canvas'), yieldsMap = new Yields(world, yieldsCanvas);
        setCanvasSize(yieldsCanvas);
        if (showYields) {
            yieldsMap.render();
            layers.push(yieldsCanvas);
        }
        const activeUnitCanvas = e('canvas'), activeUnitMap = new ActiveUnit(world, activeUnitCanvas);
        setCanvasSize(activeUnitCanvas);
        if (activeUnit) {
            activeUnitMap.render(activeUnit);
            layers.push(activeUnitCanvas);
        }
        const render = (skipActiveUnit) => {
            let tileSize = fullMap.tileSize(), layerWidth = width * tileSize, centerX = center.x * tileSize + Math.trunc(tileSize / 2), portalCenterX = Math.trunc(mapPortal.width / 2), layerHeight = height * tileSize, centerY = center.y * tileSize + Math.trunc(tileSize / 2), portalCenterY = Math.trunc(mapPortal.height / 2);
            let startX = portalCenterX - centerX, endX = portalCenterX + layerWidth, startY = portalCenterY - centerY, endY = portalCenterY + layerHeight;
            while (startX > 0) {
                startX -= layerWidth;
            }
            while (startY > 0) {
                startY -= layerHeight;
            }
            while (endX < mapPortal.width) {
                endX += layerWidth;
            }
            while (endY < mapPortal.height) {
                endY += layerHeight;
            }
            portalContext.fillStyle = '#000';
            portalContext.fillRect(0, 0, world.width() * tileSize, world.height() * tileSize);
            for (let x = startX; x < endX; x += layerWidth) {
                for (let y = startY; y < endY; y += layerHeight) {
                    layers.forEach((layer) => {
                        if ((skipActiveUnit && layer === activeUnitCanvas) ||
                            (!showYields && layer === yieldsCanvas)) {
                            return;
                        }
                        portalContext.drawImage(layer, 0, 0, layer.width, layer.height, x, y, layer.width, layer.height);
                    });
                }
            }
        };
        render(false);
        let skipActiveUnit = true;
        intervalHandler.on(() => {
            render(skipActiveUnit);
            skipActiveUnit = !skipActiveUnit;
        });
        const minimapContext = minimap.getContext('2d');
        minimap.height = fullCanvas.height * (190 / fullCanvas.width);
        minimapContext.drawImage(fullCanvas, 0, 0, 190, minimap.height);
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
mapPortal.addEventListener('click', (e) => {
    console.log(e);
});
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
    if (event.key === 'y') {
        showYields = !showYields;
        return;
    }
});
//# sourceMappingURL=renderer.js.map