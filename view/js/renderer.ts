import {
  City,
  CityBuild,
  Entity,
  EntityInstance,
  GameData,
  ITransport,
  Notification,
  Player,
  PlayerAction,
  PlayerResearch,
  Tile,
  Unit,
  UnitAction,
  Yield,
} from './types';

// TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  ! Break this down and use a front-end framework. !
//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

declare var transport: ITransport;

const notificationArea = document.getElementById('notification') as HTMLElement,
  dataArea = document.getElementById('data') as HTMLElement,
  startButton = document.querySelector('button') as HTMLElement,
  actionArea = document.getElementById('actions') as HTMLElement,
  gameArea = document.getElementById('game') as HTMLElement,
  yearWrapper = document.getElementById('year') as HTMLElement,
  turnWrapper = document.getElementById('turn') as HTMLElement,
  playersWrapper = document.getElementById('players') as HTMLElement,
  notifications: Notification[] = [];

class World {
  #data: Tile[] = [];

  setCityData(cities: City[]): void {
    cities.forEach((city: City) => {
      const tile = this.get(city.tile.x, city.tile.y);

      tile.city = city;
    });
  }

  get(x: number, y: number): Tile {
    return (
      this.#data.filter((tile: Tile) => tile.x === x && tile.y === y)[0] || {
        improvements: [],
        terrain: {
          _: 'Unknown',
        },
        units: [],
        x,
        y,
        yields: [],
      }
    );
  }

  getSurrounding(x: number, y: number, radius: number = 1): Tile[] {
    const tiles = [];

    for (
      let surroundingX = x - radius;
      surroundingX <= x + radius;
      surroundingX++
    ) {
      for (
        let surroundingY = y - radius;
        surroundingY <= y + radius;
        surroundingY++
      ) {
        tiles.push(this.get(surroundingX, surroundingY));
      }
    }

    return tiles;
  }

  setTileData(tiles: Tile[]): void {
    this.#data = tiles;
  }

  setUnitData(units: Unit[]): void {
    units.forEach((unit: Unit) => {
      const tile = this.get(unit.tile.x, unit.tile.y);

      if (!tile.units) {
        tile.units = [];
      }

      (tile.units as Unit[]).push(unit);
    });
  }
}

const t = (s: string) => document.createTextNode(s);
const e = (t: string, ...nodes: Node[]) => {
  const e = document.createElement(t);

  e.append(...nodes);

  return e;
};
const a = (e: HTMLElement, a: { [key: string]: string }) => {
  Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v));

  return e;
};
const h = (e: HTMLElement, h: { [key: string]: () => void }) => {
  Object.entries(h).forEach(([n, h]) => e.addEventListener(n, h));

  return e;
};

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

const world = new World();

transport.receive('gameData', (data: GameData): void => {
  gameArea.classList.add('active');

  turnWrapper.innerText = data.turn.value + '';
  yearWrapper.innerText = ((year) => {
    if (year < 0) {
      return Math.abs(year) + ' BC';
    }

    return year + ' AD';
  })(data.year.value);

  world.setTileData(data.player.world);
  world.setCityData(data.player.cities);
  world.setUnitData(data.player.units);

  const renderTile = (tile: Tile) => {
      if (!tile) {
        tile = {
          _: 'Tile',
          id: '0',
          improvements: [],
          terrain: {
            _: 'Unknown',
            id: '0',
          },
          x: NaN,
          y: NaN,
          yields: [],
        };
      }

      return a(
        e(
          'div',
          a(e('div'), {
            class: 'city' + (tile.city ? '' : ' hidden'),
          }),
          a(e('div'), {
            class:
              'unit ' +
              (tile.units?.length ? tile.units[0]._ : 'hidden') +
              ((tile.units?.length ?? 0) > 1 ? ' multiple' : ''),
          })
        ),
        {
          class: 'tile ' + tile.terrain._,
        }
      );
    },
    renderMap = (tiles: Tile[]) => {
      const n = Math.sqrt(tiles.length);

      return e(
        'table',
        ...new Array(n)
          .fill(0)
          .map((_, x) =>
            e(
              'tr',
              ...new Array(n)
                .fill(0)
                .map((_, y) => e('td', renderTile(tiles[x * n + y])))
            )
          )
      );
    },
    renderCity = (city: City, includeMap: boolean = false) =>
      e(
        'div',
        e('h4', t(`${city.name} (${city.tile.x},${city.tile.y})`)),
        ...(includeMap ? [
          e('h5', t('Map')),
          e('div', renderMap(world.getSurrounding(city.tile.x, city.tile.y, 2)))
        ] : []),
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
    renderUnit = (unit: Unit, includeMap: boolean = false) =>
      e(
        'div',
        e('h4', t(unit ? unit._ : '@')),
        ...(includeMap ? [
          e('h5', t('Map')),
          e('div', renderMap(world.getSurrounding(unit.tile.x, unit.tile.y, unit.visibility ? unit.visibility.value : 1)))
        ] : []),
        e('h5', t('Yields')),
        e(
          'dl',
          ...(['attack', 'defence', 'movement', 'moves', 'visibility'] as (
            | 'attack'
            | 'defence'
            | 'movement'
            | 'moves'
            | 'visibility'
          )[]).flatMap(
            (
              yieldName:
                | 'attack'
                | 'defence'
                | 'movement'
                | 'moves'
                | 'visibility'
            ) => [
              e('dd', t(yieldName)),
              e('dt', t(`${unit[yieldName] ? unit[yieldName].value : '@'}`)),
            ]
          )
        ),
        e('h5', t('Improvements')),
        e(
          'ul',
          ...(unit.improvements || [{ _: 'Missing improvements' }]).map((i) =>
            e('li', t(i ? i._ : '@'))
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
        e('div', ...(player.cities || []).map((city) => renderCity(city))),
        e(
          'h3',
          t(`Units (${player.units ? player.units.length : 'Missing units'})`)
        ),
        e('div', ...(player.units || []).map((unit) => renderUnit(unit)))
      ),
    renderUnitAction = (
      action: PlayerAction,
      unit: Unit,
      unitAction: UnitAction,
      labelSuffix: string | undefined = undefined
    ) =>
      h(
        e('button', t(unitAction._ + (labelSuffix ? ` (${labelSuffix})` : ''))),
        {
          click() {
            transport.send('action', {
              name: action._,
              id: unit.id,
              unitAction: unitAction._,
              target: unitAction.to.id,
            });
          },
        }
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

  dataArea.innerHTML = JSON.stringify(data);

  try {
    // @ts-ignore
    [...playersWrapper.children].forEach((e) => e.remove());
    playersWrapper.append(...[data.player, ...data.players].map(renderPlayer));
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

    if (action._ === 'ActiveUnit') {
      const unit = action.value as Unit;

      actionArea.append(
        e('h5', t(unit ? unit._ : '@')),
        e('h5', t('Map')),
        e(
          'div',
          renderUnit(unit, true)
        )
      );

      unit.actions.forEach((unitAction) =>
        actionArea.append(renderUnitAction(action, unit, unitAction))
      );

      Object.entries(
        unit.actionsForNeighbours
      ).forEach(([label, unitActions]: [string, UnitAction[]]) =>
        unitActions.forEach((unitAction) =>
          actionArea.append(renderUnitAction(action, unit, unitAction, label))
        )
      );
    }

    if (action._ === 'CityBuild' || action._ === 'ChooseResearch') {
      const value = action.value as PlayerResearch | CityBuild;

      value.available.forEach((entity) =>
        actionArea.append(renderEntityAction(action, value, entity))
      );
    }
  });
});

transport.receive('gameNotification', (data): void => {
  notifications.push(data);
});

document.addEventListener('DOMContentLoaded', (): void => {
  startButton.addEventListener('click', (): void => {
    transport.send('start');

    startButton.remove();
  });
});

window.setInterval((): void => {
  const active = document.querySelector('.notificationWindow');

  if (!notifications.length || active) {
    return;
  }

  const notification = notifications.shift() as Notification;

  document.body.append(
    a(
      e(
        'div',
        e('header', e('h3', t('Notification'))),
        e('p', t(notification.message)),
        a(e('button', t('Close')), {
          'data-action': 'close',
        })
      ),
      {
        class: 'notificationWindow',
      }
    )
  );
}, 500);

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
