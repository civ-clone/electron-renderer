import {
  City,
  CityBuild,
  Entity,
  GameData,
  ITransport,
  Player,
  PlayerAction,
  PlayerResearch,
  Unit,
  Yield,
} from './types';
import { e, h, t } from './lib/html.js';
import { reconstituteData, ObjectMap } from './lib/reconstituteData.js';
import ActiveUnit from './components/Map/ActiveUnit.js';
import Full from './components/Map/Full.js';
import Notifications from './components/Notifications.js';
import World from './components/World.js';
import Cities from './components/Map/Cities.js';
import Units from './components/Map/Units.js';
import Yields from './components/Map/Yields.js';

// TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  ! Break this down and use a front-end framework. !
//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

declare var transport: ITransport;

const notificationArea = document.getElementById('notification') as HTMLElement,
  startButton = document.querySelector('button') as HTMLElement,
  actionArea = document.getElementById('actions') as HTMLElement,
  gameArea = document.getElementById('game') as HTMLElement,
  mapWrapper = document.getElementById('map') as HTMLElement,
  mapPortal = mapWrapper.querySelector('canvas') as HTMLCanvasElement,
  yearWrapper = document.getElementById('year') as HTMLElement,
  turnWrapper = document.getElementById('turn') as HTMLElement,
  playersWrapper = document.getElementById('players') as HTMLElement,
  minimap = document.getElementById('minimap') as HTMLCanvasElement,
  unitInfo = document.getElementById('unitInfo') as HTMLCanvasElement,
  notifications = new Notifications();

let globalNotificationTimer: number | undefined,
  showYields = false;

transport.receive('notification', (data): void => {
  notificationArea.innerHTML = data;

  if (globalNotificationTimer) {
    window.clearTimeout(globalNotificationTimer);
  }

  globalNotificationTimer = window.setTimeout((): void => {
    globalNotificationTimer = undefined;

    notificationArea.innerText = '';
  }, 4000);
});

const height: number = 60,
  width: number = 80,
  world = new World(height, width),
  center = {
    x: 0,
    y: 0,
  };

let activeUnit: Unit | null,
  activeUnits: PlayerAction[] = [];

window.addEventListener('resize', () => {
  mapPortal.width = mapPortal.offsetWidth;
  mapPortal.height = mapPortal.offsetHeight;
});

class IntervalHandler {
  #stack: (() => void)[] = [];

  constructor(tick: number = 500) {
    setInterval(() => this.check(), tick);
  }

  check(): void {
    this.#stack.forEach((item) => item());
  }

  clear(): void {
    this.#stack = [];
  }

  off(handler: () => void): void {
    this.#stack = this.#stack.filter((item) => item !== handler);
  }

  on(handler: () => void): void {
    this.#stack.push(handler);
  }
}

const intervalHandler = new IntervalHandler();

transport.receive('gameData', (objectMap: ObjectMap): void => {
  const data: GameData = reconstituteData(objectMap) as GameData;

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

  activeUnits = data.player.actions.filter(
    (action: PlayerAction): boolean => action._ === 'ActiveUnit'
  );

  const [activeUnitAction] = activeUnits;

  activeUnit = activeUnitAction ? (activeUnitAction.value as Unit) : null;

  if (activeUnit) {
    center.x = activeUnit.tile.x;
    center.y = activeUnit.tile.y;

    unitInfo.innerHTML = `
<p>${activeUnit.player.civilization._} ${activeUnit._}</p>
<p>${activeUnit.moves.value} / ${activeUnit.movement.value} moves</p>
<p>A: ${activeUnit.attack.value} / D: ${activeUnit.defence.value} / V: ${
      activeUnit.visibility.value
    }</p>
<p>${activeUnit.improvements.map((improvement) => improvement._).join('')}</p>
`;
  }

  try {
    const layers: HTMLCanvasElement[] = [],
      portalContext = mapPortal.getContext('2d') as CanvasRenderingContext2D,
      setCanvasSize = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
        canvas.height = height * fullMap.tileSize();
        canvas.width = width * fullMap.tileSize();
        canvas.setAttribute('height', (height * fullMap.tileSize()).toString());
        canvas.setAttribute('width', (width * fullMap.tileSize()).toString());

        return canvas;
      };

    mapPortal.width = mapPortal.offsetWidth;
    mapPortal.height = mapPortal.offsetHeight;

    const fullCanvas = e('canvas') as HTMLCanvasElement,
      fullMap = new Full(world, fullCanvas);

    setCanvasSize(fullCanvas);

    fullMap.render();
    layers.push(fullCanvas);

    const unitCanvas = e('canvas') as HTMLCanvasElement,
      unitMap = new Units(world, unitCanvas);

    setCanvasSize(unitCanvas);

    unitMap.render(world.tiles(), activeUnit);
    layers.push(unitCanvas);

    const citiesCanvas = e('canvas') as HTMLCanvasElement,
      citiesMap = new Cities(world, citiesCanvas);

    setCanvasSize(citiesCanvas);

    citiesMap.render();
    layers.push(citiesCanvas);

    const yieldsCanvas = e('canvas') as HTMLCanvasElement,
      yieldsMap = new Yields(world, yieldsCanvas);

    setCanvasSize(yieldsCanvas);

    if (showYields) {
      yieldsMap.render();
      layers.push(yieldsCanvas);
    }

    const activeUnitCanvas = e('canvas') as HTMLCanvasElement,
      activeUnitMap = new ActiveUnit(world, activeUnitCanvas);

    setCanvasSize(activeUnitCanvas);

    if (activeUnit) {
      activeUnitMap.render(activeUnit);

      layers.push(activeUnitCanvas);
    }

    const render = (skipActiveUnit: boolean) => {
      let tileSize = fullMap.tileSize(),
        layerWidth = width * tileSize,
        centerX = center.x * tileSize + Math.trunc(tileSize / 2),
        portalCenterX = Math.trunc(mapPortal.width / 2),
        layerHeight = height * tileSize,
        centerY = center.y * tileSize + Math.trunc(tileSize / 2),
        portalCenterY = Math.trunc(mapPortal.height / 2);

      let startX = portalCenterX - centerX,
        endX = portalCenterX + layerWidth,
        startY = portalCenterY - centerY,
        endY = portalCenterY + layerHeight;

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
      portalContext.fillRect(
        0,
        0,
        world.width() * tileSize,
        world.height() * tileSize
      );

      for (let x = startX; x < endX; x += layerWidth) {
        for (let y = startY; y < endY; y += layerHeight) {
          layers.forEach((layer) => {
            if (
              (skipActiveUnit && layer === activeUnitCanvas) ||
              (!showYields && layer === yieldsCanvas)
            ) {
              return;
            }

            portalContext.drawImage(
              layer,
              0,
              0,
              layer.width,
              layer.height,
              x,
              y,
              layer.width,
              layer.height
            );
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

    const minimapContext = minimap.getContext('2d') as CanvasRenderingContext2D;

    minimap.height = fullCanvas.height * (190 / fullCanvas.width);

    minimapContext.drawImage(fullCanvas, 0, 0, 190, minimap.height);
  } catch (e) {
    console.error(e);
  }

  const renderCity = (city: City) =>
      e(
        'div',
        e('h4', t(`${city.name} (${city.tile.x},${city.tile.y})`)),
        e('h5', t('Yields')),
        e(
          'dl',
          ...city.yields.flatMap((cityYield: Yield) => [
            e('dd', t(cityYield._)),
            e('dt', t(`${cityYield.value}`)),
          ])
        ),
        e(
          'ul',
          ...(city.improvements || [{ _: 'Missing improvements' }]).map((i) =>
            e('li', t(i ? i._ : '@'))
          )
        ),
        e(
          'dl',
          e('dd', t('Size:')),
          e(
            'dt',
            t(
              `${city.growth.size} (${city.growth.progress.value}/${city.growth.cost.value})`
            )
          ),
          e('dd', t('Building:')),
          e(
            'dt',
            t(
              `${
                city.build
                  ? city.build.building
                    ? city.build.building._
                    : 'Nothing'
                  : 'No CityBuild'
              } (${city.build.progress.value}/${city.build.cost.value})`
            )
          )
        )
      ),
    renderPlayer = (player: Player) =>
      e(
        'div',
        e(
          'h2',
          t(
            `${
              player.civilization && player.civilization.leader
                ? player.civilization.leader.name
                : '@'
            } of the ${
              player.civilization ? player.civilization._ : '@'
            } empire`
          )
        ),
        e(
          'div',
          e('h2', t(`Research`)),
          e(
            'p',
            t(
              `${
                player.research.researching
                  ? player.research.researching._
                  : 'Nothing'
              } (${player.research.progress.value}/${
                player.research.cost.value
              })`
            )
          ),
          e('ul', ...player.research.complete.map((a) => e('li', t(a._))))
        ),
        e(
          'div',
          e('h2', t(`Treasury`)),
          e('p', t(`${player.treasury ? player.treasury.value : '@'}`))
        ),
        e(
          'div',
          e('h2', t(`Government`)),
          e(
            'p',
            t(
              `${player.government.current ? player.government.current._ : '@'}`
            )
          )
        ),
        e(
          'h3',
          t(
            `Cities (${
              player.cities ? player.cities.length : 'Missing cities'
            })`
          )
        ),
        e('div', ...(player.cities || []).map((city) => renderCity(city)))
      ),
    renderEntityAction = (
      action: PlayerAction,
      entity: CityBuild | PlayerResearch,
      chosen: Entity
    ) =>
      h(e('button', t(chosen ? chosen._ : '@')), {
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
  } catch (e) {
    console.error(e);
  }

  // @ts-ignore
  [...actionArea.children].forEach((e) => e.remove());

  if (!data.player.mandatoryActions.length)
    actionArea.append(
      h(e('button', t('End Turn')), {
        click() {
          transport.send('action', {
            name: 'EndOfTurn',
          });
        },
      })
    );

  // TODO: Model this better
  (data.player.actions || []).forEach((action): void => {
    actionArea.append(e('h4', t(action ? action._ : '@')));

    if (action._ === 'CityBuild' || action._ === 'ChooseResearch') {
      const value = action.value as PlayerResearch | CityBuild;

      value.available.forEach((entity) =>
        actionArea.append(renderEntityAction(action, value, entity))
      );
    }
  });
});

transport.receive('gameNotification', (data): void => {
  notifications.receive(data);
});

document.addEventListener('DOMContentLoaded', (): void => {
  startButton.addEventListener('click', (): void => {
    transport.send('start');

    startButton.remove();
  });
});

document.addEventListener('click', (event) => {
  if (!event.target) {
    return;
  }

  const target = event.target as HTMLElement;

  if (target.matches('.notificationWindow button[data-action="close"]')) {
    const parent = target.parentElement;

    if (!parent) {
      return;
    }

    parent.remove();
  }
});

const keyToActionsMap: {
    [key: string]: string[];
  } = {
    b: ['FoundCity'],
    D: ['Disband'],
    f: ['Fortify', 'BuildFortress'],
    i: ['BuildIrrigation', 'ClearForest'],
    m: ['BuildMine', 'PlantForest'],
    P: ['Pillage'],
    r: ['BuildRoad', 'BuildRailroad'],
    s: ['Sleep'],
    w: ['Wait'],
  },
  directionKeyMap: { [key: string]: string } = {
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
        const actionName = actions.shift(),
          [unitAction] = activeUnit.actions.filter(
            (action): boolean => action._ === actionName
          );

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
      const [unitAction] = activeUnit.actionsForNeighbours[
        directionKeyMap[event.key]
      ];

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
