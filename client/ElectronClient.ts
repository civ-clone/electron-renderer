import {
  Advance as FreeAdvance,
  City as FreeCity,
  Gold as FreeGold,
  Unit as FreeUnit,
} from '@civ-clone/civ1-goody-hut/GoodyHuts';
import {
  ChangeProduction,
  CityBuild,
} from '@civ-clone/core-city-build/PlayerActions';
import { Client, IClient } from '@civ-clone/core-civ-client/Client';
import { ActiveUnit, InactiveUnit } from '@civ-clone/civ1-unit/PlayerActions';
import Advance from '@civ-clone/core-science/Advance';
import ChooseResearch from '@civ-clone/civ1-science/PlayerActions/ChooseResearch';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Civilization from '@civ-clone/core-civilization/Civilization';
import CompleteProduction from '@civ-clone/civ1-treasury/PlayerActions/CompleteProduction';
import DataObject from '@civ-clone/core-data-object/DataObject';
import DataQueue from './DataQueue';
import { EndTurn } from '@civ-clone/civ1-player/PlayerActions';
import GoodyHut from '@civ-clone/core-goody-hut/GoodyHut';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import MandatoryPlayerAction from '@civ-clone/core-player/MandatoryPlayerAction';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import Retryable from './Retryable';
import TransferObject from './TransferObject';
import Tile from '@civ-clone/core-world/Tile';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import UndiscoveredTile from '@civ-clone/core-player-world/UndiscoveredTile';
import Unit from '@civ-clone/core-unit/Unit';
import UnitAction from '@civ-clone/core-unit/Action';
import UnknownCity from '../UnknownObjects/City';
import UnknownPlayer from '../UnknownObjects/Player';
import UnknownUnit from '../UnknownObjects/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Year from '@civ-clone/core-game-year/Year';
import { instance as advanceRegistryInstance } from '@civ-clone/core-science/AdvanceRegistry';
import { instance as cityRegistryInstance } from '@civ-clone/core-city/CityRegistry';
import { instance as engineInstance } from '@civ-clone/core-engine/Engine';
import { instance as leaderRegistryInstance } from '@civ-clone/core-civilization/LeaderRegistry';
import { instance as playerResearchRegistryInstance } from '@civ-clone/core-science/PlayerResearchRegistry';
import { instance as playerTreasuryRegistryInstance } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import { instance as playerWorldRegistryInstance } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { instance as turnInstance } from '@civ-clone/core-turn-based-game/Turn';
import { instance as unitRegistryInstance } from '@civ-clone/core-unit/UnitRegistry';
import { instance as yearInstance } from '@civ-clone/core-game-year/Year';
import * as EventEmitter from 'events';

// const referenceObject = <T extends DataObject = DataObject>(object: T) => ({
const referenceObject = (object: { id(): string }) => ({
    '#ref': object.id(),
  }),
  filterToReference =
    (...types: (new (...args: any[]) => any)[]) =>
    (object: DataObject) =>
      types.some((Type) => object instanceof Type)
        ? referenceObject(object)
        : object,
  filterToReferenceAllExcept =
    (...types: (new (...args: any[]) => any)[]) =>
    (object: DataObject) =>
      types.some((Type) => object instanceof Type)
        ? object
        : referenceObject(object);

const unknownPlayers: Map<Player, UnknownPlayer> = new Map(),
  unknownUnits: Map<Unit, UnknownUnit> = new Map(),
  unknownCities: Map<City, UnknownCity> = new Map();

export class ElectronClient extends Client implements IClient {
  #dataFilter =
    (localFilter = (object: any) => object) =>
    (object: DataObject) => {
      if (object instanceof Player && object !== this.player()) {
        if (!unknownPlayers.has(object)) {
          unknownPlayers.set(object, UnknownPlayer.fromPlayer(object));
        }

        return unknownPlayers.get(object);
      }

      if (object instanceof Unit && object.player() !== this.player()) {
        if (!unknownUnits.has(object)) {
          unknownUnits.set(object, UnknownUnit.fromUnit(object));
        }

        return unknownUnits.get(object);
      }

      if (object instanceof City && object.player() !== this.player()) {
        if (!unknownCities.has(object)) {
          unknownCities.set(object, UnknownCity.fromCity(object));
        }

        return unknownCities.get(object);
      }

      if (object instanceof Tile) {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        if (!playerWorld.includes(object)) {
          return new UndiscoveredTile(object.x(), object.y(), object.map());
        }
      }

      return localFilter(object);
    };
  #dataQueue: DataQueue = new DataQueue();
  #eventEmitter: EventEmitter;
  #receiver: (channel: string, handler: (...args: any[]) => void) => void;
  #sender: (channel: string, payload: any) => void;
  #sentInitialData: boolean = false;

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

    // TODO: These could be `HiddenAction`s. Need to add a `perform` method to actions too...
    this.#receiver(
      'cheat',
      ({ name, value }: { name: string; value: any }): void => {
        if (name === 'RevealMap') {
          const playerWorld = playerWorldRegistryInstance.getByPlayer(
            this.player()
          );

          // A bit nasty... I wonder how slow this data transfer will be...
          const [tile] = playerWorld.entries();

          tile
            .map()
            .entries()
            .forEach((tile) => {
              if (playerWorld.includes(tile)) {
                return;
              }

              playerWorld.register(tile);

              this.#dataQueue.add(
                playerWorld.id(),
                () => tile.toPlainObject(this.#dataFilter()),
                `entries[${playerWorld.entries().indexOf(tile)}]`
              );
            });
        }

        if (name === 'GrantAdvance') {
          const [Advance] = advanceRegistryInstance.filter(
              (Advance) => Advance.name === value
            ),
            playerResearch = playerResearchRegistryInstance.getByPlayer(
              this.player()
            );

          if (!Advance) {
            return;
          }

          if (playerResearch.completed(Advance)) {
            return;
          }

          playerResearch.addAdvance(Advance);
        }

        if (name === 'GrantGold') {
          const playerTreasury = playerTreasuryRegistryInstance.getByPlayer(
            this.player()
          );

          playerTreasury.add(value);
        }

        this.sendPatchData();
      }
    );

    engineInstance.on('player:visibility-changed', (tile, player) => {
      if (player !== this.player()) {
        return;
      }

      const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        ),
        index = playerWorld.entries().indexOf(tile);

      if (index === -1) {
        console.log('using a Retryable');
        new Retryable(
          () => {
            const index = playerWorld.entries().indexOf(tile);

            if (index === -1) {
              return false;
            }

            this.#dataQueue.add(
              playerWorld.id(),
              () =>
                tile.toPlainObject(this.#dataFilter(filterToReference(Player))),
              `tiles[${index}]`
            );

            return true;
          },
          2,
          20
        );

        return;
      }

      this.#dataQueue.add(
        playerWorld.id(),
        () => tile.toPlainObject(this.#dataFilter(filterToReference(Player))),
        `tiles[${index}]`
      );
    });

    ['unit:created', 'unit:destroyed'].forEach((event) => {
      engineInstance.on(event, (unit) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        if (!playerWorld.includes(unit.tile())) {
          return;
        }

        // TODO: check if this is another player first and if there's already another unit there, use an unknown unit
        //  Need to update Units renderer if this happens
        this.#dataQueue.update(unit.tile().id(), () =>
          unit.tile().toPlainObject(
            this.#dataFilter(
              // filterToReferenceAllExcept(Tile, Unit, UnknownPlayer, Yield)
              filterToReference(Player)
            )
          )
        );

        if (unit.player() !== this.player()) {
          return;
        }

        if (event === 'unit:created') {
          const playerUnits = unitRegistryInstance.getByPlayer(this.player()),
            playerIndex = playerUnits.indexOf(unit),
            cityUnits = unitRegistryInstance.getByCity(unit.city()),
            cityIndex = cityUnits.indexOf(unit),
            tileUnits = unitRegistryInstance.getByTile(unit.tile()),
            tileIndex = tileUnits.indexOf(unit);

          this.#dataQueue.add(
            player.id(),
            () =>
              unit.toPlainObject(
                this.#dataFilter(filterToReference(Tile, Player, City))
              ),
            `units[${playerIndex}]`
          );
          this.#dataQueue.add(
            unit.tile().id(),
            () => unit.toPlainObject(this.#dataFilter(filterToReference(Unit))),
            `units[${tileIndex}]`
          );

          if (unit.city() !== null) {
            this.#dataQueue.add(
              unit.city().id(),
              () =>
                unit.toPlainObject(this.#dataFilter(filterToReference(Unit))),
              `units[${cityIndex}]`
            );
          }

          return;
        }

        this.#dataQueue.update(this.player().id(), () =>
          this.player().toPlainObject(
            this.#dataFilter(filterToReferenceAllExcept(Player, Unit))
          )
        );
      });
    });

    ['unit:moved'].forEach((event) => {
      engineInstance.on(event, (unit, action) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        if (
          !playerWorld.includes(action.from()) &&
          !playerWorld.includes(action.to())
        ) {
          return;
        }

        if (playerWorld.includes(action.from())) {
          this.#dataQueue.update(action.from().id(), () =>
            action
              .from()
              .toPlainObject(this.#dataFilter(filterToReference(Player, City)))
          );
        }

        if (playerWorld.includes(action.to())) {
          this.#dataQueue.update(action.to().id(), () =>
            action
              .to()
              .toPlainObject(this.#dataFilter(filterToReference(Player, City)))
          );
        }
      });
    });

    ['tile-improvement:built', 'tile-improvement:pillaged'].forEach((event) => {
      engineInstance.on(event, (tile) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        if (playerWorld.includes(tile)) {
          this.#dataQueue.update(tile.id(), () =>
            tile.toPlainObject(
              this.#dataFilter(filterToReference(Player, City))
            )
          );
        }
      });
    });

    engineInstance.on(
      'city:captured',
      (city: City, capturingPlayer: Player, originalPlayer: Player) => {
        if (originalPlayer === this.player()) {
          const playerCities = cityRegistryInstance.getByPlayer(this.player()),
            cityIndex = playerCities.indexOf(city);

          if (cityIndex !== -1) {
            this.#dataQueue.update(this.player().id(), () =>
              this.player().toPlainObject(
                this.#dataFilter(filterToReferenceAllExcept(Player))
              )
            );
            // this.#dataQueue.remove(this.player().id(), `cities[${cityIndex}]`);
          }

          this.sendNotification(
            `${capturingPlayer
              .civilization()
              .name()} have captured our city ${city.name()}!`
          );

          return;
        }

        if (capturingPlayer === this.player()) {
          this.sendNotification(
            `We have captured ${city.name()} from ${capturingPlayer
              .civilization()
              .name()}!`
          );

          return;
        }
      }
    );

    ['city:created', 'city:captured', 'city:destroyed'].forEach((event) => {
      engineInstance.on(event, (city) => {
        const playerWorld = playerWorldRegistryInstance.getByPlayer(
          this.player()
        );

        if (!playerWorld.includes(city.tile())) {
          return;
        }

        this.#dataQueue.update(city.tile().id(), () =>
          city.tile().toPlainObject(this.#dataFilter(filterToReference(Player)))
        );
      });
    });

    engineInstance.on('city:building-complete', (cityBuild, build) => {
      const playerWorld = playerWorldRegistryInstance.getByPlayer(
        this.player()
      );

      if (
        cityBuild.city().player() !== this.player() &&
        build instanceof Wonder
      ) {
        this.sendNotification(
          `${
            playerWorld.includes(cityBuild.city().tile())
              ? cityBuild.city().name()
              : 'A faraway city'
          } has completed work on ${build.constructor.name}!`
        );

        return;
      }

      if (
        cityBuild.city().player() !== this.player() &&
        !(build instanceof Wonder)
      ) {
        return;
      }

      this.#dataQueue.update(cityBuild.id(), () =>
        cityBuild.toPlainObject(
          this.#dataFilter(filterToReference(Tile, Unit, Player))
        )
      );

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

      this.#dataQueue.update(playerResearch.id(), () =>
        playerResearch.toPlainObject(
          this.#dataFilter(filterToReference(Player))
        )
      );

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

    engineInstance.on('player:defeated', (player: Player) =>
      this.sendNotification(
        `${player.civilization().name()} destroyed by ${player
          .civilization()
          .name()}`
      )
    );

    engineInstance.on('city:civil-disorder', (city: City) => {
      if (city.player() === this.player()) {
        this.sendNotification(`Civil disorder in ${city.name()}!`);
      }
    });
  }

  chooseCivilization(Civilizations: typeof Civilization[]): Promise<void> {
    const makeChoice = (ChosenCivilization: typeof Civilization) => {
      this.player().setCivilization(new ChosenCivilization());

      return this.chooseLeader(this.player().civilization());
    };

    return new Promise((resolve, reject) => {
      if (Civilizations.length === 1) {
        const [Civilization] = Civilizations;

        makeChoice(Civilization).then(() => resolve());

        return;
      }

      this.#sender(
        'chooseCivilization',
        new TransferObject({ choices: Civilizations }).toPlainObject()
      );

      this.#receiver('chooseCivilization', (choice) => {
        const [Civilization] = Civilizations.filter(
          (Civilization) => Civilization.name === choice
        );

        if (!Civilization) {
          reject(
            `Invalid civilization ${choice} (options: ${Civilizations.map(
              (Civilization) => Civilization.name
            ).join(', ')})`
          );

          return;
        }

        makeChoice(Civilization).then(() => resolve());
      });
    });
  }

  chooseLeader(civilization: Civilization): Promise<void> {
    return new Promise((resolve, reject) => {
      const Leaders = leaderRegistryInstance.getByCivilization(
        civilization.constructor as IConstructor<Civilization>
      );

      if (Leaders.length === 1) {
        const [Leader] = Leaders;

        civilization.setLeader(new Leader());

        resolve();

        return;
      }

      this.#sender(
        'chooseLeader',
        new TransferObject({ choices: Leaders }).toPlainObject()
      );

      this.#receiver('chooseLeader', (choice) => {
        const [Leader] = Leaders.filter((Leader) => Leader.name === choice);

        if (!Leader) {
          reject(
            `Invalid civilization ${choice} (options: ${Leaders.map(
              (Leader) => Leader.name
            ).join(', ')})`
          );

          return;
        }

        civilization.setLeader(new Leader());

        resolve();
      });
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

    if (name === 'EndTurn') {
      return (
        mandatoryActions.length === 1 &&
        mandatoryActions.every((action) => action instanceof EndTurn)
      );
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

    if (playerAction instanceof InactiveUnit) {
      const unit: Unit = playerAction.value();

      unit.activate();

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

    if (playerAction instanceof CompleteProduction) {
      const city = playerAction.value(),
        playerTreasury = playerTreasuryRegistryInstance.getByPlayer(
          this.player()
        );

      playerTreasury.buy(city);

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

    this.#sender('gameData', dataObject.toPlainObject(this.#dataFilter()));

    this.#sentInitialData = true;
  }

  private sendPatchData(): void {
    this.#sender('gameDataPatch', this.#dataQueue.transferData());

    this.#dataQueue.clear();
  }

  private sendNotification(message: string): void {
    this.#sender('gameNotification', {
      message: message,
    });
  }

  takeTurn(): Promise<void> {
    return new Promise<void>((resolve, reject): void => {
      if (!this.#sentInitialData) {
        this.sendInitialData();
      }

      setTimeout(() => {
        this.#dataQueue.update(turnInstance.id(), () =>
          turnInstance.toPlainObject()
        );
        this.#dataQueue.update(yearInstance.id(), () =>
          yearInstance.toPlainObject()
        );
        this.#dataQueue.add(this.player().id(), () =>
          this.player().toPlainObject(
            this.#dataFilter(filterToReference(Tile, Civilization))
          )
        );

        this.sendPatchData();
      }, 1);

      const listener = (...args: any[]): void => {
        try {
          if (this.handleAction(...args)) {
            this.#eventEmitter.off('action', listener);

            this.sendPatchData();

            setTimeout(() => resolve(), 100);

            return;
          }

          this.#dataQueue.update(this.player().id(), () =>
            this.player().toPlainObject(
              this.#dataFilter(filterToReference(PlayerWorld, Tile, City))
            )
          );

          this.sendPatchData();
        } catch (e) {
          reject(e);
        }
      };

      this.#eventEmitter.on('action', listener);
    });
  }
}

export default ElectronClient;
