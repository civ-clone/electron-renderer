import { Client, IClient } from '@civ-clone/core-civ-client/Client';
import { ActiveUnit } from '@civ-clone/civ1-unit/PlayerActions';
import Advance from '@civ-clone/core-science/Advance';
import ChooseResearch from '@civ-clone/civ1-science/PlayerActions/ChooseResearch';
import { CityBuild } from '@civ-clone/core-city-build/PlayerActions';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import MandatoryPlayerAction from '@civ-clone/core-player/MandatoryPlayerAction';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import TransferObject from './TransferObject';
import Unit from '@civ-clone/core-unit/Unit';
import UnitAction from '@civ-clone/core-unit/Action';
import * as EventEmitter from 'events';
import { instance as engineInstance } from '@civ-clone/core-engine/Engine';
import { instance as playerRegistryInstance } from '@civ-clone/core-player/PlayerRegistry';
import { instance as turnInstance } from '@civ-clone/core-turn-based-game/Turn';
import { instance as yearInstance } from '@civ-clone/core-game-year/Year';

export class ElectronClient extends Client implements IClient {
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

    engineInstance.on('player:turn-end', (player: Player) => {
      if (player !== this.player()) {
        this.sendGameData();
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

    // {
    //   name: 'ActiveUnit',
    //   data: {
    //     id: '...',
    //     action: {
    //       name: 'FoundCity',
    //       target: {
    //         id: '...'
    //       }
    //     }
    //   }
    // }
    // {
    //   name: 'CityBuild',
    //   data: {
    //     id: '...',
    //     target: {
    //       name: 'Spearman'
    //     }
    //   }
    // }

    const { name, id } = action;

    if (name === 'EndOfTurn') {
      return mandatoryActions.length === 0;
    }

    if (!name) {
      // this.sendNotification('action not specified');
      console.log('action not specified');

      return false;
    }

    const [playerAction] = actions.filter(
      (action: PlayerAction): boolean =>
        action.constructor.name === name &&
        id === (action.value() ? action.value().id() : undefined)
    );

    if (!playerAction) {
      // this.sendNotification(`action not found: ${name}`);
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
          // this.sendNotification(`action not found: ${unitAction}`);
          console.log(`action not found: ${unitAction}`);

          return false;
        }

        actions = actions.filter(
          (action: UnitAction): boolean => action.to().id() === target
        );

        if (actions.length > 1) {
          if (!target) {
            // this.sendNotification(
            //   `too many actions found: ${unitAction} (${actions.length})`
            // );
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

    if (playerAction instanceof CityBuild) {
      const cityBuild = playerAction.value(),
        { chosen } = action;

      if (!chosen) {
        // this.sendNotification(`no build item specified`);
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
        // this.sendNotification(`build item not available: ${chosen}`);
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
        // this.sendNotification(`build item not available: ${chosen}`);
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
    const dataObject = new TransferObject({
      player: this.player(),
      turn: turnInstance,
      year: yearInstance,
    });

    this.#sender('gameData', dataObject.toPlainObject());
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
