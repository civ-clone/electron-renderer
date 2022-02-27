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

export type PlainObject = {
  [key: string]: any;
};

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
  improvements: EntityInstance[];
  player: Player;
  tile: Tile;
  tiles: Tile[];
  tilesWorked: Tile[];
  yields: Yield[];
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
  attributes: Attribute[];
  leader: Leader;
}

export interface Leader extends EntityInstance {
  name: string;
}

export interface Player extends EntityInstance {
  actions: PlayerAction[];
  civilization: Civilization;
  cities: City[];
  government: PlayerGovernment;
  mandatoryActions: PlayerAction[];
  research: PlayerResearch;
  treasury: Yield;
  units: Unit[];
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
  complete: EntityInstance[];
  cost: Yield;
  progress: Yield;
  researching: Entity | null;
}

export interface Unit extends EntityInstance {
  actions: UnitAction[];
  actionsForNeighbours: {
    [key: string]: UnitAction[];
  };
  attack: Yield;
  city: City;
  defence: Yield;
  improvements: EntityInstance[];
  movement: Yield;
  moves: Yield;
  player: Player;
  status: EntityInstance;
  tile: Tile;
  visibility: Yield;
  yields: Yield[];
}

export interface UnitAction extends EntityInstance {
  from: Tile;
  to: Tile;
}

export interface Terrain extends EntityInstance {
  features: EntityInstance[];
}

export interface Tile extends EntityInstance {
  city: City | null;
  goodyHut: EntityInstance;
  improvements: EntityInstance[];
  isCoast: boolean;
  isLand: boolean;
  isWater: boolean;
  terrain: Terrain;
  units: Unit[];
  x: number;
  y: number;
  yields: Yield[];
}

export type AdjacentNeighbour = 'n' | 'e' | 's' | 'w';
export type NeighbourDirection = AdjacentNeighbour | 'ne' | 'se' | 'sw' | 'nw';

export interface World extends EntityInstance {
  height: number;
  tiles: Tile[];
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

type DataPatchType = 'add' | 'remove' | 'update';

type DataPatchContents = {
  type: DataPatchType;
  index?: string | null;
  value?: ObjectMap | PlainObject;
};

export type DataPatch = {
  [id: string]: DataPatchContents;
};
