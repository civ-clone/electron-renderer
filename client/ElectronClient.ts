import {
  AdditionalDataRegistry,
  instance as additionalDataRegistryInstance,
} from '@civ-clone/core-data-object/AdditionalDataRegistry';
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
import {
  ChangeProduction,
  CityBuild,
} from '@civ-clone/core-city-build/PlayerActions';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import GoodyHut from '@civ-clone/core-goody-hut/GoodyHut';
import MandatoryPlayerAction from '@civ-clone/core-player/MandatoryPlayerAction';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import TransferObject from './TransferObject';
import Tile from '@civ-clone/core-world/Tile';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Unit from '@civ-clone/core-unit/Unit';
import UnitAction from '@civ-clone/core-unit/Action';
import UnknownCity from '../UnknownObjects/City';
import UnknownPlayer from '../UnknownObjects/Player';
import UnknownUnit from '../UnknownObjects/Unit';
import Year from '@civ-clone/core-game-year/Year';
import * as EventEmitter from 'events';
import { instance as engineInstance } from '@civ-clone/core-engine/Engine';
import { instance as turnInstance } from '@civ-clone/core-turn-based-game/Turn';
import { instance as yearInstance } from '@civ-clone/core-game-year/Year';
import { instance as cityRegistryInstance } from '@civ-clone/core-city/CityRegistry';
import { instance as unitRegistryInstance } from '@civ-clone/core-unit/UnitRegistry';
import { instance as playerResearchRegistryInstance } from '@civ-clone/core-science/PlayerResearchRegistry';
import { instance as playerWorldRegistryInstance } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { instance as playerTreasuryRegistryInstance } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import { instance as playerTradeRatesRegistryInstance } from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import { instance as playerGovernmentRegistryInstance } from '@civ-clone/core-government/PlayerGovernmentRegistry';
import City from '@civ-clone/core-city/City';

export class ElectronClient extends Client implements IClient {
  #dataQueue: Set<Tile> = new Set();
  #eventEmitter: EventEmitter;
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

    this.#receiver('cheat', (code: string): void => {
      if (code === 'RevealMap') {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        // A bit nasty... I wonder how slow this data transfer will be...
        playerWorld
          .entries()[0]
          .map()
          .entries()
          .forEach((tile) => playerWorld.register(tile));
      }
    });

    engineInstance.on('player:visibility-changed', (tile, player) => {
      if (player !== this.player()) {
        return;
      }

      this.#dataQueue.add(tile);
    });

    ['unit:created', 'unit:destroyed'].forEach((event) => {
      engineInstance.on(event, (unit) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        if (!playerWorld.includes(unit.tile())) {
          return;
        }

        this.#dataQueue.add(unit.tile());
      });
    });

    ['unit:moved'].forEach((event) => {
      engineInstance.on(event, (unit, action) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        // TODO: filter unit details here - EnemyUnitStack.fromUnits(...unitRegistry.getByTile(unit.tile())) ?
        if (unit.player() !== this.player()) {
          if (playerWorld.includes(action.from())) {
            this.#dataQueue.add(action.from());
          }

          if (playerWorld.includes(action.to())) {
            this.#dataQueue.add(action.to());
          }

          return;
        }

        this.#dataQueue.add(unit.tile());

        if (action.from() !== action.to()) {
          this.#dataQueue.add(action.from());
        }
      });
    });

    ['tile-improvement:built', 'tile-improvement:pillaged'].forEach((event) => {
      engineInstance.on(event, (tile) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        if (playerWorld.includes(tile)) {
          this.#dataQueue.add(tile);
        }
      });
    });

    ['city:created', 'city:destroyed'].forEach((event) => {
      engineInstance.on(event, (city) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        if (city.player() !== this.player()) {
          if (event === 'city:created' || event === 'city:destroyed') {
            if (playerWorld.includes(city.tile())) {
              this.#dataQueue.add(city.tile());
            }
          }

          return;
        }
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

    engineInstance.on(
      'goody-hut:action-performed',
      (goodyHut: GoodyHut, action) => {
        const tile = goodyHut.tile(),
          units = unitRegistryInstance.getByTile(tile);

        if (!units.some((unit: Unit) => unit.player() === this.player())) {
          return;
        }

        if (action instanceof FreeAdvance) {
          this.sendNotification(
            'You have discovered scrolls of ancient wisdom...'
          );

          return;
        }

        if (action instanceof FreeCity) {
          this.sendNotification('You have discovered an advanced tribe...');

          return;
        }

        if (action instanceof FreeGold) {
          this.sendNotification('You have discovered valuable treasure...');

          return;
        }

        if (action instanceof FreeUnit) {
          this.sendNotification(
            'You have discovered a friendly tribe of skilled mercenaries...'
          );

          return;
        }
      }
    );

    engineInstance.on('goody-hut:discovered', (goodyHut, unit) => {
      if (unit.player() !== this.player()) {
        return;
      }
    });
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

    const dataObject = new TransferObject(rawData);

    this.#sender(
      'gameData',
      dataObject.toPlainObject((object) => {
        if (object instanceof Player && object !== this.player()) {
          return UnknownPlayer.fromPlayer(object);
        }

        if (object instanceof Unit && object.player() !== this.player()) {
          return UnknownUnit.fromUnit(object);
        }

        if (object instanceof City && object.player() !== this.player()) {
          return UnknownCity.fromCity(object);
        }

        return object;
      })
    );
  }

  private sendGameData(): void {
    const actions = this.player().actions(),
      patch: {
        [key: string]: any;
      } = {
        player: {
          actions: actions,
          cities: cityRegistryInstance.getByPlayer(this.player()),
          government: playerGovernmentRegistryInstance.getByPlayer(
            this.player()
          ),
          mandatoryActions: actions.filter(
            (action) => action instanceof MandatoryPlayerAction
          ),
          rates: playerTradeRatesRegistryInstance.getByPlayer(this.player()),
          research: playerResearchRegistryInstance.getByPlayer(this.player()),
          treasury: playerTreasuryRegistryInstance.getByPlayer(this.player()),
          units: unitRegistryInstance.getByPlayer(this.player()),
          world: {
            tiles: [...this.#dataQueue],
          },
        },
      };

    this.#sender('gameDataPatch', new TransferObject(patch).toPlainObject());

    this.#dataQueue.clear();
  }

  private sendNotification(message: string): void {
    this.#sender('gameNotification', {
      message: message,
    });
  }

  takeTurn(): Promise<void> {
    return new Promise<void>((resolve, reject): void => {
      this.sendInitialData();

      const listener = (...args: any[]): void => {
        try {
          if (this.handleAction(...args)) {
            this.#eventEmitter.off('action', listener);

            resolve();
          }

          this.sendInitialData();
        } catch (e) {
          reject(e);
        }
      };

      this.#eventEmitter.on('action', listener);
    });
  }
}

export default ElectronClient;
