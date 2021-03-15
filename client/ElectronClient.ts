import {
  ChangeProduction,
  CityBuild as CityBuildAction,
} from '@civ-clone/core-city-build/PlayerActions';
import { Client, IClient } from '@civ-clone/core-civ-client/Client';
import { ActiveUnit } from '@civ-clone/civ1-unit/PlayerActions';
import Advance from '@civ-clone/core-science/Advance';
import BasicTile from './lib/BasicTile';
import ChooseResearch from '@civ-clone/civ1-science/PlayerActions/ChooseResearch';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import DataObject from '@civ-clone/core-data-object/DataObject';
import City from '@civ-clone/core-city/City';
import EnemyCity from './lib/EnemyCity';
import EnemyUnit from './lib/EnemyUnit';
import EnemyPlayer from './lib/EnemyPlayer';
import MandatoryPlayerAction from '@civ-clone/core-player/MandatoryPlayerAction';
import { ObjectMap } from '@civ-clone/core-data-object/DataObject';
import { PlainObject } from '@civ-clone/core-data-object/DataObject';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Tile from '@civ-clone/core-world/Tile';
import TransferObject from './TransferObject';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Unit from '@civ-clone/core-unit/Unit';
import UnitAction from '@civ-clone/core-unit/Action';
import Year from '@civ-clone/core-game-year/Year';
import Yield from '@civ-clone/core-yield/Yield';
import YieldValue from '@civ-clone/core-yield/YieldValue';
import * as EventEmitter from 'events';
import { diff } from 'deep-object-diff';
import { instance as cityBuildRegistryInstance } from '@civ-clone/core-city-build/CityBuildRegistry';
import { instance as cityGrowthRegistryInstance } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { instance as cityRegistryInstance } from '@civ-clone/core-city/CityRegistry';
import { instance as engineInstance } from '@civ-clone/core-engine/Engine';
import { instance as playerResearchRegistryInstance } from '@civ-clone/core-science/PlayerResearchRegistry';
import { instance as playerTreasuryRegistryInstance } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import { instance as playerWorldRegistryInstance } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { instance as turnInstance } from '@civ-clone/core-turn-based-game/Turn';
import { instance as unitRegistryInstance } from '@civ-clone/core-unit/UnitRegistry';
import { instance as yearInstance } from '@civ-clone/core-game-year/Year';
import reconstituteData from '@civ-clone/core-data-object/lib/reconstituteData';

declare type ObjectReference = {
  '#ref': string;
  [key: string]: any;
};

export class ElectronClient extends Client implements IClient {
  #eventEmitter: EventEmitter;
  #gameData: { [key: string]: any } = {};
  #patchData: { [key: string]: any } = {};
  #previousData: ObjectMap = { hierarchy: {}, objects: {} };
  #sender: (channel: string, payload: any) => void;
  #receiver: (channel: string, handler: (...args: any[]) => void) => void;

  constructor(
    player: Player,
    sender: (channel: string, payload: any) => void,
    receiver: (channel: string, handler: (...args: any[]) => void) => void
  ) {
    super(player);

    this.#eventEmitter = new EventEmitter();
    this.#sender = sender;
    this.#receiver = receiver;

    this.#receiver('action', (...args): void => {
      this.#eventEmitter.emit('action', ...args);
    });

    engineInstance.on('player:visibility-changed', (tile: Tile, player) => {
      if (player !== this.player()) {
        return;
      }

      const playerWorld = playerWorldRegistryInstance.getByPlayer(
        this.player()
      );

      this.addPatchFor(tile as DataObject);

      if (!this.#previousData.objects[playerWorld.id()]) {
        this.addPatchFor(playerWorld as DataObject);
      }

      this.addPatch({
        [playerWorld.id()]: {
          tiles: {
            [this.#previousData.objects[playerWorld.id()].tiles.length]: {
              '#ref': tile.id(),
            },
          },
        },
      });
    });

    ['unit:created', 'unit:destroyed'].forEach((event) => {
      engineInstance.on(event, (unit: Unit) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        if (!playerWorld.includes(unit.tile())) {
          return;
        }
        console.log(event);
        console.log(unit.id());

        if (event === 'unit:created') {
          this.addPatchFor(unit as DataObject);

          this.addPatch({
            [unit.player().id()]: {
              units: {
                [unitRegistryInstance.getByPlayer(unit.player()).length]: {
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

        this.addPatchData(
          ...([unit.player().id(), unit.tile().id(), unit.city()?.id()].filter(
            (id) => id !== null
          ) as string[]).map((id) =>
            this.removeFromCollection(id, unit as DataObject, 'units')
          )
        );
      });
    });

    ['unit:moved'].forEach((event) => {
      engineInstance.on(event, (unit: Unit, action: UnitAction) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        // Don't care about anything that's entirely outside our World
        if (
          !playerWorld.includes(action.from()) &&
          !playerWorld.includes(action.to())
        ) {
          return;
        }

        this.addPatchFor(unit as DataObject);

        if (action.to() !== action.from()) {
          this.addPatchFor(action.from() as DataObject);
        }
      });
    });

    ['tile-improvement:built', 'tile-improvement:pillaged'].forEach((event) => {
      engineInstance.on(event, (tile) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        if (!playerWorld.includes(tile)) {
          return;
        }

        this.addPatchFor(tile as DataObject);
      });
    });

    ['city:created', 'city:destroyed'].forEach((event) => {
      engineInstance.on(event, (city) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        if (!playerWorld.includes(city.tile())) {
          return;
        }

        this.addPatchFor(city as DataObject);

        if (event === 'city:created') {
          this.addPatch({
            [city.player().id()]: {
              cities: {
                [cityRegistryInstance.getByPlayer(city.player())
                  .length]: this.referenceTo(city),
              },
            },
          });

          return;
        }

        this.addPatch(
          this.removeFromCollection(
            this.player().id(),
            city as DataObject,
            'cities'
          )
        );
      });
    });

    engineInstance.on('city:building-complete', (cityBuild, build) => {
      if (cityBuild.city().player() !== this.player()) {
        return;
      }

      this.sendNotification(
        `${cityBuild.city().name()} has completed work on ${
          build.constructor.name
        }!`
      );
    });

    engineInstance.on('player:research-complete', (playerResearch, advance) => {
      if (playerResearch.player() !== this.player()) {
        return;
      }

      this.sendNotification(
        `You have discovered the secrets of ${advance.constructor.name}!`
      );
    });

    const firstTurnHandler = (player: Player) => {
      if (player !== this.player()) {
        return;
      }

      this.sendInitialData();

      engineInstance.off('player:turn-start', firstTurnHandler);
    };

    engineInstance.on('player:turn-start', firstTurnHandler);

    engineInstance.on('turn:start', () => {
      cityRegistryInstance
        .getByPlayer(this.player())
        .forEach((city) =>
          this.addPatchFor(
            cityBuildRegistryInstance.getByCity(city) as DataObject,
            cityGrowthRegistryInstance.getByCity(city) as DataObject
          )
        );

      this.addPatchFor(
        playerResearchRegistryInstance.getByPlayer(player) as DataObject
      );
      this.addPatchFor(
        playerTreasuryRegistryInstance.getByPlayer(player) as DataObject
      );
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

  handleAction(...args: any[]): boolean {
    const [action] = args,
      player = this.player(),
      actions = player.actions(),
      mandatoryActions = actions.filter(
        (action: PlayerAction): boolean =>
          action instanceof MandatoryPlayerAction
      );

    const { name, id } = action;

    if (name === 'EndOfTurn') {
      return mandatoryActions.length === 0;
    }

    if (!name) {
      console.log('action not specified');

      return false;
    }

    const [playerAction] = actions.filter(
      (action: PlayerAction): boolean =>
        action.constructor.name === name &&
        id === (action.value() ? action.value().id() : undefined)
    );

    if (!playerAction) {
      console.log('action not specified');

      return false;
    }

    // TODO: other actions
    // TODO: make this better...
    if (playerAction instanceof ActiveUnit) {
      const { unitAction, target } = action,
        unit: Unit = playerAction.value(),
        allActions = [
          ...unit.actions(),
          ...Object.values(unit.actionsForNeighbours()),
        ].flat();
      let actions = allActions.filter(
        (action: UnitAction): boolean => action.constructor.name === unitAction
      );

      while (actions.length !== 1) {
        if (actions.length === 0) {
          console.log(`action not found: ${unitAction}`);

          return false;
        }

        actions = actions.filter(
          (action: UnitAction): boolean => action.to().id() === target
        );

        if (actions.length > 1) {
          if (!target) {
            console.log(
              `too many actions found: ${unitAction} (${actions.length})`
            );

            return false;
          }
        }
      }

      const [actionToPerform] = actions;

      actionToPerform.perform();

      return false;
    }

    if (
      playerAction instanceof CityBuildAction ||
      playerAction instanceof ChangeProduction
    ) {
      const cityBuild = playerAction.value(),
        { chosen } = action;

      if (!chosen) {
        console.log(`no build item specified`);

        return false;
      }

      const [BuildItem] = cityBuild
        .available()
        .filter(
          (BuildItem: typeof Unit | typeof CityImprovement) =>
            BuildItem.name === chosen
        );

      if (!BuildItem) {
        console.log(`build item not available: ${chosen}`);

        return false;
      }

      cityBuild.build(BuildItem);

      return false;
    }

    if (playerAction instanceof ChooseResearch) {
      const playerResearch = playerAction.value() as PlayerResearch,
        { chosen } = action;

      if (!chosen) {
        this.sendNotification(`no build item specified`);

        return false;
      }

      const [ChosenAdvance] = playerResearch
        .available()
        .filter((AdvanceType: typeof Advance) => AdvanceType.name === chosen);

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

  private toPlainObjectFilter(entity: DataObject): any {
    if (entity instanceof Player) {
      if (entity === this.player()) {
        return {
          '#ref': this.player().id(),
        };
      }

      return EnemyPlayer.get(entity);
    }

    if (entity instanceof Unit && entity.player() !== this.player()) {
      return EnemyUnit.get(entity);
    }

    if (entity instanceof City && entity.player() !== this.player()) {
      return EnemyCity.get(entity);
    }

    if (entity instanceof Tile) {
      return BasicTile.get(entity, this.player());
    }

    // Simplifying Yields instead of having them as `DataObject`s with an `id`... Save data transfer!
    //  Alternative is to create all the `Yield`s when the parent object is instantiated (`Tile`, `Unit`, etc) and have
    //  them update when the values change... Feels like it would be nicer, but might be a little more tricky...
    if (entity instanceof Yield) {
      return {
        _: entity.constructor.name,
        value: entity.value(),
        values: entity.values().map((yieldValue: YieldValue) => ({
          provider: yieldValue.provider(),
          value: yieldValue.value(),
        })),
      };
    }

    return entity;
  }

  private sendInitialData(): void {
    const rawData: {
      player: Player;
      turn: Turn;
      year: Year;
    } = {
      player: this.player(),
      turn: turnInstance,
      year: yearInstance,
    };

    const dataObject = new TransferObject(rawData).toPlainObject((entity) => {
      if (entity === this.player()) {
        return this.player();
      }

      return this.toPlainObjectFilter(entity);
    });

    this.#sender('initialData', dataObject);

    // console.log(dataObject);
    this.#previousData = dataObject;
    this.#gameData = reconstituteData(dataObject);
  }

  private sendGameData(): void {
    const actions = this.player().actions();

    this.addPatch({
      [this.player().id()]: {
        actions: [],
        mandatoryActions: [],
      },
    });

    actions.forEach((action, index) => {
      const { objects } = action.toPlainObject((entity) =>
        this.toPlainObjectFilter(entity)
      );

      this.addPatch(objects);
      this.addPatch({
        [this.player().id()]: {
          actions: {
            [index]: this.referenceTo(action as DataObject),
          },
        },
      });
    });

    this.addPatch({
      [this.player().id()]: {
        mandatoryActions: actions
          .filter((action) => action instanceof MandatoryPlayerAction)
          .map((action) => this.referenceTo(action as DataObject)),
      },
    });

    // const data = new TransferObject(this.#gameData).toPlainObject((entity) =>
    //     this.toPlainObjectFilter(entity)
    //   ),
    //   dataDiff = diff(this.#previousData, data);

    // console.log(this.#previousData);
    // console.log(data.constructor.name);
    // console.log(dataDiff);

    this.#sender('gameDataPatch', this.#patchData);

    this.#patchData = {};
    // this.#patchData = [];

    // this.#previousData = data;
    // this.#gameData = reconstituteData(data);
  }

  private sendNotification(message: string): void {
    this.#sender('gameNotification', {
      message: message,
    });
  }

  // Called externally
  takeTurn(): Promise<void> {
    return new Promise<void>((resolve, reject): void => {
      this.sendGameData();

      const listener = (...args: any[]): void => {
        try {
          if (this.handleAction(...args)) {
            this.#eventEmitter.off('action', listener);

            resolve();
          }

          this.sendGameData();
        } catch (e) {
          reject(e);
        }
      };

      this.#eventEmitter.on('action', listener);
    });
  }

  private addPatch(...patches: { [key: string]: any }[]): void {
    patches.forEach((patch) => {
      this.addPatchData(patch);

      this.applyPatch(patch);
    });
  }

  private addPatchFor(...dataObjects: DataObject[]): void {
    dataObjects.forEach((data) => {
      const { objects } = data.toPlainObject((entity) =>
        this.toPlainObjectFilter(entity)
      );

      Object.entries(objects)
        .filter(([key, value]): boolean => {
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
        .forEach(([key, value]): void => {
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

  private addPatchData(...patches: { [key: string]: any }[]): void {
    patches.forEach((patch) => this.applyPatch(patch, this.#patchData));
  }

  private applyPatch(
    patch: { [key: string]: any },
    to: { [key: string]: any } = this.#previousData.objects
  ): void {
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined) {
        delete to[key];

        return;
      }

      if (Array.isArray(value)) {
        to[key] = value;

        return;
      }

      if (
        to[key] !== null &&
        typeof to[key] === 'object' &&
        value !== null &&
        typeof value === 'object'
      ) {
        return this.applyPatch(value, to[key]);
      }

      to[key] = value;
    });
  }

  private referenceTo(data: DataObject): ObjectReference {
    return {
      '#ref': data.id(),
    };
  }

  private removeFromCollection(
    parentId: string,
    entity: DataObject,
    key: string
  ): PlainObject {
    const parentObject = this.#previousData.objects[parentId];

    if (!parentObject) {
      return {};
    }

    const current = parentObject[key] ?? [];

    if (parentObject[key] === undefined) {
      console.log('missing data for ' + key);
      console.log(parentObject);
    }

    this.#previousData.objects[parentId][key] = current.filter(
      (objectReference: ObjectReference): boolean =>
        objectReference['#ref'] !== entity.id()
    );

    return {
      [parentId]: {
        [key]: this.#previousData.objects[parentId][key],
      },
    };
  }
}

export default ElectronClient;
