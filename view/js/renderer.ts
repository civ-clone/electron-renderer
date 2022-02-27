import {
  DataPatch,
  GameData,
  ITransport,
  NeighbourDirection,
  PlainObject,
  PlayerAction,
  Tile,
  Unit,
} from './types';
import { reconstituteData, ObjectMap } from './lib/reconstituteData.js';
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
import Notifications from './components/Notifications.js';
import PlayerDetails from './components/PlayerDetails.js';
import Portal from './components/Portal.js';
import Terrain from './components/Map/Terrain.js';
import UnitDetails from './components/UnitDetails.js';
import Units from './components/Map/Units.js';
import World from './components/World.js';
import Yields from './components/Map/Yields.js';

// TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  ! Break this down and use a front-end framework? !
//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

declare var transport: ITransport;

const options = {
  autoEndOfTurn: true,
};

try {
  const notificationArea = document.getElementById(
      'notification'
    ) as HTMLElement,
    mainMenuElement = document.querySelector('#mainmenu') as HTMLElement,
    actionArea = document.getElementById('actions') as HTMLElement,
    gameArea = document.getElementById('game') as HTMLElement,
    mapWrapper = document.getElementById('map') as HTMLElement,
    mapPortal = mapWrapper.querySelector('canvas') as HTMLCanvasElement,
    gameInfo = document.getElementById('gameDetails') as HTMLElement,
    playerInfo = document.getElementById('playerDetails') as HTMLElement,
    minimapCanvas = document.getElementById('minimap') as HTMLCanvasElement,
    unitInfo = document.getElementById('unitInfo') as HTMLCanvasElement,
    notifications = new Notifications(),
    mainMenu = new MainMenu(mainMenuElement);

  const tilesToRender: Tile[] = [];

  let globalNotificationTimer: number | undefined, lastUnit: Unit;

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

  transport.receiveOnce('gameData', (objectMap: ObjectMap) => {
    const data: GameData = reconstituteData(objectMap) as GameData;

    gameArea.classList.add('active');

    mapPortal.width = (mapPortal.parentElement as HTMLElement).offsetWidth;
    mapPortal.height = (mapPortal.parentElement as HTMLElement).offsetHeight;

    const world = new World(data.player.world);

    let activeUnit: Unit | null = null,
      activeUnits: PlayerAction[] = [];

    const intervalHandler = new IntervalHandler(),
      eventHandler = new EventHandler(),
      landMap = new Land(world),
      irrigationMap = new Irrigation(world),
      terrainMap = new Terrain(world),
      improvementsMap = new Improvements(world),
      featureMap = new Feature(world),
      goodyHutsMap = new GoodyHuts(world),
      fogMap = new Fog(world),
      yieldsMap = new Yields(world),
      unitsMap = new Units(world),
      citiesMap = new Cities(world),
      cityNamesMap = new CityNames(world),
      activeUnitsMap = new ActiveUnit(world);

    yieldsMap.setVisible(false);

    const portal = new Portal(
        world,
        mapPortal,
        landMap,
        irrigationMap,
        terrainMap,
        improvementsMap,
        featureMap,
        goodyHutsMap,
        fogMap,
        yieldsMap,
        unitsMap,
        citiesMap,
        cityNamesMap,
        activeUnitsMap
      ),
      minimap = new Minimap(minimapCanvas, world, portal, landMap, citiesMap);

    intervalHandler.on(() => {
      activeUnitsMap.setVisible(!activeUnitsMap.isVisible());

      portal.build(tilesToRender.splice(0));
      portal.render();
    });

    window.addEventListener('resize', () => {
      mapPortal.width = (mapPortal.parentElement as HTMLElement).offsetWidth;
      mapPortal.height = (mapPortal.parentElement as HTMLElement).offsetHeight;
    });

    // This needs wrapping.
    let lastTurn = 1,
      clearNextTurn = false;

    const handler = (objectMap: ObjectMap): void => {
      let orphanIds: string[] | null = clearNextTurn ? [] : null;

      const data: GameData = reconstituteData(objectMap, orphanIds) as GameData;

      // A bit crude, I'd like to run this as as background job too
      if (orphanIds) {
        // clean up orphan data
        orphanIds.forEach((id) => delete objectMap.objects[id]);

        clearNextTurn = false;
      }

      if (lastTurn !== data.turn.value) {
        clearNextTurn = true;
        lastTurn = data.turn.value;
      }

      const actions = new Actions(data.player.mandatoryActions, actionArea);

      gameArea.append(actions.element());

      world.setTileData(data.player.world.tiles);

      const gameDetails = new GameDetails(gameInfo, data.turn, data.year);

      gameDetails.build();

      const playerDetails = new PlayerDetails(playerInfo, data.player);

      playerDetails.build();

      activeUnits = data.player.actions.filter(
        (action: PlayerAction): boolean => action._ === 'ActiveUnit'
      );

      // This prioritises units that are already on screen
      const [activeUnitAction] = activeUnits.sort(
        ({ value: unitA }, { value: unitB }): number =>
          unitB === lastUnit
            ? 1
            : unitA === lastUnit
            ? -1
            : (portal.isVisible((unitB as Unit).tile.x, (unitB as Unit).tile.y)
                ? 1
                : 0) -
              (portal.isVisible((unitA as Unit).tile.x, (unitA as Unit).tile.y)
                ? 1
                : 0)
      );

      activeUnit = activeUnitAction ? (activeUnitAction.value as Unit) : null;

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

      if (
        options.autoEndOfTurn &&
        data.player.mandatoryActions.length === 1 &&
        data.player.mandatoryActions.every((action) => action._ === 'EndTurn')
      ) {
        transport.send('action', {
          name: 'EndTurn',
        });

        return;
      }
    };

    handler(objectMap);

    transport.receive('gameData', handler);

    const pathToParts = (path: string) => path.replace(/]/g, '').split(/[.[]/),
      getPenultimateObject = (
        object: PlainObject,
        path: string
      ): [PlainObject, string | undefined] => {
        const parts = pathToParts(path),
          lastPart = parts.pop();

        const tmpObj = parts.reduce((tmpObj, part) => {
          if (!tmpObj || !(part in tmpObj)) {
            return null;
          }

          return tmpObj[part];
        }, object);

        return [tmpObj, lastPart];
      },
      setObjectPath = (object: PlainObject, path: string, value: any): void => {
        const [tmpObj, lastPart] = getPenultimateObject(object, path);

        if (!tmpObj || !lastPart) {
          console.warn(`unable to set ${path} of ${object} (${lastPart})`);
          return;
        }

        tmpObj[lastPart] = value;
      },
      removeObjectPath = (object: PlainObject, path: string): void => {
        const [tmpObj, lastPart] = getPenultimateObject(object, path);

        if (!tmpObj || !lastPart) {
          console.warn(`unable to set ${path} of ${object} (${lastPart})`);
          return;
        }

        delete tmpObj[lastPart];
      };

    transport.receive('gameDataPatch', (data: DataPatch[]) => {
      data.forEach((patch) =>
        Object.entries(patch).forEach(([key, { type, index, value }]) => {
          if (type === 'add' || type === 'update') {
            if (!value!.hierarchy) {
              console.error('No hierarchy');
              console.error(value);

              return;
            }

            if (index) {
              setObjectPath(objectMap.objects[key], index, value!.hierarchy);
            } else {
              objectMap.objects[key] = value!.hierarchy;
            }

            Object.entries(value!.objects as PlainObject).forEach(
              ([key, value]) => {
                objectMap.objects[key] = value;

                if (value._ === 'Tile') {
                  // Since we only use tilesToRender for x and y this should be fine...
                  tilesToRender.push(value);
                }
              }
            );
          }

          if (type === 'remove') {
            if (index) {
              removeObjectPath(objectMap.objects[key], index);

              return;
            }

            delete objectMap.objects[key];
          }
        })
      );

      handler(objectMap);
    });

    transport.receive('gameNotification', (data): void =>
      notifications.receive(data)
    );

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

      if (event.target === mapPortal) {
        const tileSize = terrainMap.tileSize(),
          currentCenter = portal.center();

        let x = event.offsetX,
          y = event.offsetY;

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
        } else if (tile.units.length) {
          console.log(tile.units);
        } else {
          portal.setCenter(tile.x, tile.y);

          minimap.update();
        }
      }
    });

    const keyToActionsMap: {
        [key: string]: string[];
      } = {
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
      },
      directionKeyMap: { [key: string]: NeighbourDirection } = {
        ArrowUp: 'n',
        PageUp: 'ne',
        ArrowRight: 'e',
        PageDown: 'se',
        ArrowDown: 's',
        End: 'sw',
        ArrowLeft: 'w',
        Home: 'nw',
      },
      directionKeyMapNumpad: { [key: string]: NeighbourDirection } = {
        8: 'n',
        9: 'ne',
        6: 'e',
        3: 'se',
        2: 's',
        1: 'sw',
        4: 'w',
        7: 'nw',
      },
      directionKeyTypeMap: { [key: string]: { [key: string]: string } } = {
        [KeyboardEvent.DOM_KEY_LOCATION_STANDARD]: directionKeyMap,
        [KeyboardEvent.DOM_KEY_LOCATION_NUMPAD]: directionKeyMapNumpad,
      };

    let lastKey = '';

    eventHandler.on('keydown', (event: KeyboardEvent) => {
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

        // if (event.key in directionKeyTypeMap[event.location]) {
        if (event.key in directionKeyMap) {
          const [unitAction] =
            activeUnit.actionsForNeighbours[directionKeyMap[event.key]];

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
        const bottomAction = actionArea.querySelector(
          'div.action:last-child button'
        ) as HTMLButtonElement | null;

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
        transport.send('cheat', 'RevealMap');
      }

      lastKey = event.key;
    });

    document.addEventListener('keydown', (event) =>
      eventHandler.handle('keydown', event)
    );
  });
} catch (e) {
  console.error(e);
}
