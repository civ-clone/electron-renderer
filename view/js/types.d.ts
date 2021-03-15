import { ObjectMap } from './lib/reconstituteData.js';

export interface ITransport {
  receive(channel: string, handler: (...args: any[]) => void): void;
  receive(channel: 'gameData', handler: (data: ObjectMap) => void): void;
  receive(channel: 'notification', handler: (data: string) => void): void;
  receive(
    channel: 'gameNotification',
    handler: (data: Notification) => void
  ): void;
  receiveOnce(channel: string, handler: (...args: any[]) => void): void;
  receiveOnce(channel: 'gameData', handler: (data: ObjectMap) => void): void;
  receiveOnce(channel: 'notification', handler: (data: string) => void): void;
  receiveOnce(
    channel: 'gameNotification',
    handler: (data: Notification) => void
  ): void;
  send(channel: string, payload?: any): void;
}

export interface Entity {
  _: string;
}

export interface EntityInstance extends Entity {
  id: string;
}

export interface City extends EntityInstance {
  name: string;
  build: CityBuild;
  growth: CityGrowth;
  improvements: { [key: string]: EntityInstance };
  player: Player;
  tile: Tile;
  tiles: { [key: string]: Tile };
  tilesWorked: { [key: string]: Tile };
  yields: { [key: string]: Yield };
}

export interface CityGrowth extends EntityInstance {
  cost: Yield;
  progress: Yield;
  size: number;
}

export interface CityBuild extends EntityInstance {
  available: Entity[];
  building: Entity | null;
  city: City;
  cost: Yield;
  progress: Yield;
}

export interface Attribute extends EntityInstance {
  name: string;
  value: any;
}

export interface Civilization extends EntityInstance {
  attributes: { [key: string]: Attribute };
  leader: Leader;
}

export interface Leader extends EntityInstance {
  name: string;
}

export interface Player extends EntityInstance {
  actions: { [key: string]: PlayerAction };
  civilization: Civilization;
  cities: { [key: string]: City };
  government: PlayerGovernment;
  mandatoryActions: { [key: string]: PlayerAction };
  research: PlayerResearch;
  treasury: Yield;
  units: { [key: string]: Unit };
  world: World;
}

export interface PlayerAction extends EntityInstance {
  value: Unit | PlayerResearch | CityBuild;
}

export interface PlayerGovernment extends EntityInstance {
  current: EntityInstance;
}

export interface PlayerResearch extends EntityInstance {
  available: Entity[];
  complete: { [key: string]: EntityInstance };
  cost: Yield;
  progress: Yield;
  researching: Entity | null;
}

export interface Unit extends EntityInstance {
  actions: { [key: string]: UnitAction };
  actionsForNeighbours: {
    [key: string]: { [key: string]: UnitAction };
  };
  attack: Yield;
  defence: Yield;
  improvements: { [key: string]: EntityInstance };
  movement: Yield;
  moves: Yield;
  player: Player;
  status: EntityInstance;
  tile: Tile;
  visibility: Yield;
  yields: { [key: string]: Yield };
}

export interface UnitAction extends EntityInstance {
  from: Tile;
  to: Tile;
}

export interface Terrain extends EntityInstance {
  features: { [key: string]: EntityInstance };
}

export interface Tile extends EntityInstance {
  city: City | null;
  goodyHut: EntityInstance;
  improvements: { [key: string]: EntityInstance };
  isCoast: boolean;
  isLand: boolean;
  isWater: boolean;
  terrain: Terrain;
  units: { [key: string]: Unit };
  x: number;
  y: number;
  yields: { [key: string]: Yield };
}

export interface World extends EntityInstance {
  height: number;
  tiles: { [key: string]: Tile };
  width: number;
}

export interface Yield extends EntityInstance {
  value: number;
}

export interface GameData extends EntityInstance {
  player: Player;
  turn: Yield;
  year: Yield;
}

export interface Notification {
  message: string;
}
