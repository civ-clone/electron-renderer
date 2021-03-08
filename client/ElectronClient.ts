import { Client, IClient } from '@civ-clone/core-civ-client/Client';
import {
  Advance as FreeAdvance,
  City as FreeCity,
  Gold as FreeGold,
  Unit as FreeUnit,
} from '@civ-clone/civ1-goody-hut/GoodyHuts';
import { ActiveUnit } from '@civ-clone/civ1-unit/PlayerActions';
import Advance from '@civ-clone/core-science/Advance';
import ChooseResearch from '@civ-clone/civ1-science/PlayerActions/ChooseResearch';
import City from '@civ-clone/core-city/City';
import {
  ChangeProduction,
  CityBuild,
} from '@civ-clone/core-city-build/PlayerActions';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import MandatoryPlayerAction from '@civ-clone/core-player/MandatoryPlayerAction';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import TransferObject from './TransferObject';
import Tile from '@civ-clone/core-world/Tile';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Unit from '@civ-clone/core-unit/Unit';
import UnitAction from '@civ-clone/core-unit/Action';
import World from '@civ-clone/core-world/World';
import Year from '@civ-clone/core-game-year/Year';
import * as EventEmitter from 'events';
import { instance as engineInstance } from '@civ-clone/core-engine/Engine';
import { instance as turnInstance } from '@civ-clone/core-turn-based-game/Turn';
import { instance as yearInstance } from '@civ-clone/core-game-year/Year';
import { instance as cityRegistryInstance } from '@civ-clone/core-city/CityRegistry';
import { instance as unitRegistryInstance } from '@civ-clone/core-unit/UnitRegistry';
import { instance as playerWorldRegistryInstance } from '@civ-clone/core-player-world/PlayerWorldRegistry';

export class ElectronClient extends Client implements IClient {
  // #dataQueue: { unit?: Unit; city?: City; tile?: Tile }[] = [];
  #eventEmitter: EventEmitter;
  #hasSentData: boolean = false;
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

    // engineInstance.on('player:turn-end', (player: Player) => {
    //   if (player !== this.player()) {
    //     this.sendGameData();
    //   }
    // });
    //
    // engineInstance.on('player:visibility-changed', (tile, player) => {
    //   if (player !== this.player()) {
    //     return;
    //   }
    //
    //   this.#dataQueue.push({
    //     tile,
    //   });
    // });
    //
    // ['unit:created', 'unit:destroyed'].forEach((event) => {
    //   engineInstance.on(event, (unit) => {
    //     const playerWorld = playerWorldRegistryInstance.getByPlayer(
    //       this.player()
    //     );
    //
    //     if (!playerWorld.includes(unit.tile())) {
    //       return;
    //     }
    //
    //     this.#dataQueue.push({
    //       tile: unit.tile(),
    //     });
    //   });
    // });
    //
    // ['unit:moved'].forEach((event) => {
    //   engineInstance.on(event, (unit, action) => {
    //     const playerWorld = playerWorldRegistryInstance.getByPlayer(
    //       this.player()
    //     );
    //
    //     // TODO: filter unit details here - EnemyUnitStack.fromUnits(...unitRegistry.getByTile(unit.tile())) ?
    //     if (unit.player() !== this.player()) {
    //       if (playerWorld.includes(action.from())) {
    //         this.#dataQueue.push({
    //           tile: action.from(),
    //         });
    //       }
    //
    //       if (playerWorld.includes(action.to())) {
    //         this.#dataQueue.push({
    //           tile: action.to(),
    //         });
    //       }
    //
    //       return;
    //     }
    //
    //     this.#dataQueue.push({
    //       tile: unit.tile(),
    //       unit,
    //     });
    //
    //     if (action.from() !== action.to()) {
    //       this.#dataQueue.push({
    //         tile: action.from(),
    //       });
    //     }
    //   });
    // });
    //
    // ['tile-improvement:built', 'tile-improvement:pillaged'].forEach((event) => {
    //   engineInstance.on(event, (tile) => {
    //     this.#dataQueue.push({
    //       tile,
    //     });
    //   });
    // });
    //
    // [
    //   'city:created',
    //   'city:destroyed',
    //   'city:building-complete',
    //   'city:grow',
    //   'city:shrink',
    // ].forEach((event) => {
    //   engineInstance.on(event, (city) => {
    //     const playerWorld = playerWorldRegistryInstance.getByPlayer(
    //       this.player()
    //     );
    //
    //     if (city.player() !== this.player()) {
    //       if (event === 'city:created' || event === 'city:destroyed') {
    //         if (playerWorld.includes(city.tile())) {
    //           this.#dataQueue.push({
    //             // TODO: filter details here - EnemyCity.fromCity(city) ?
    //             city,
    //             tile: city.tile(),
    //           });
    //         }
    //       }
    //
    //       return;
    //     }
    //
    //     this.#dataQueue.push({
    //       city,
    //     });
    //   });
    // });
    //
    // engineInstance.on('turn:start', () => {
    //   cityRegistryInstance.getByPlayer(this.player()).forEach((city) => {
    //     this.#dataQueue.push({
    //       city,
    //     });
    //   });
    //
    //   unitRegistryInstance.getByPlayer(this.player()).forEach((unit) => {
    //     this.#dataQueue.push({
    //       unit,
    //     });
    //   });
    // });

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
      playerAction instanceof CityBuild ||
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

  private sendGameData(): void {
    // if (!this.#hasSentData) {
    const rawData: {
      player: Player;
      turn: Turn;
      year: Year;
    } = {
      player: this.player(),
      turn: turnInstance,
      year: yearInstance,
    };

    const dataObject = new TransferObject(rawData);

    this.#sender('gameData', dataObject.toPlainObject());

    this.#hasSentData = true;

    return;
    // }

    // const actions = this.player().actions(),
    //   patch: {
    //     [key: string]: any;
    //   } = {
    //     player: {
    //       actions: actions,
    //       cities: {},
    //       government: {},
    //       mandatoryActions: actions.filter(
    //         (action) => action instanceof MandatoryPlayerAction
    //       ),
    //       rates: {},
    //       research: {},
    //       treasury: {},
    //       units: {},
    //       world: {
    //         tiles: {},
    //       },
    //     },
    //   };
    //
    // this.#dataQueue.forEach(({ unit, city, tile }) => {
    //   if (unit !== undefined) {
    //     patch.player.units[unit.id()] = unit;
    //   }
    //
    //   if (city !== undefined) {
    //     patch.player.cities[city.id()] = city;
    //   }
    //
    //   if (tile !== undefined) {
    //     patch.player.world.tiles[tile.id()] = tile;
    //   }
    // });
    //
    // this.#sender('gameDataPatch', new TransferObject(patch).toPlainObject());
  }

  private sendNotification(message: string): void {
    this.#sender('gameNotification', {
      message: message,
    });
  }

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
}

export default ElectronClient;
