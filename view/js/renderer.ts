import {
  City,
  CityBuild,
  Entity,
  GameData,
  ITransport,
  Player,
  PlayerAction,
  PlayerResearch,
  Tile,
  Unit,
  UnitAction,
  Yield,
} from './types';
import Map from './components/Map.js';
import Notifications from './components/Notifications.js';
import World from './components/World.js';
import { a, e, h, t } from './lib/html.js';
import { reconstituteData, ObjectMap } from './lib/reconstituteData.js';

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
  notifications = new Notifications();

let globalNotificationTimer: number | undefined;

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

let activeUnit: Unit;

transport.receive('gameData', (objectMap: ObjectMap): void => {
  const data: GameData = reconstituteData(objectMap) as GameData;

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

  const [activeUnitAction] = data.player.actions.filter(
    (action: PlayerAction): boolean => action._ === 'ActiveUnit'
  );

  activeUnit = activeUnitAction && (activeUnitAction.value as Unit);

  if (activeUnit) {
    center.x = activeUnit.tile.x;
    center.y = activeUnit.tile.y;
  }

  try {
    const offscreenMap = e('canvas') as HTMLCanvasElement,
      map = new Map(world, offscreenMap),
      portalContext = mapPortal.getContext('2d') as CanvasRenderingContext2D,
      sourceX =
        center.x * (map.tileSize() * map.scale()) -
        mapPortal.offsetWidth / 2 -
        (map.tileSize() * map.scale()) / 2,
      sourceY =
        center.y * (map.tileSize() * map.scale()) -
        mapPortal.offsetHeight / 2 -
        (map.tileSize() * map.scale()) / 2;

    offscreenMap.height = height * map.tileSize();
    offscreenMap.width = width * map.tileSize();
    offscreenMap.setAttribute(
      'height',
      (height * map.tileSize() * map.scale()).toString()
    );
    offscreenMap.setAttribute(
      'width',
      (width * map.tileSize() * map.scale()).toString()
    );

    map.render();

    // TODO: render the map around for map edges
    portalContext.drawImage(
      offscreenMap,
      sourceX,
      sourceY,
      mapPortal.width,
      mapPortal.height,
      0,
      0,
      mapPortal.width,
      mapPortal.height
    );
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
});
