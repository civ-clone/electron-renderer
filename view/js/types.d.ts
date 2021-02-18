export interface ITransport {
  receive(channel: string, handler: (...args: any[]) => void): void;
  receive(channel: 'gameData', handler: (data: GameData) => void): void;
  receive(channel: 'notification', handler: (data: string) => void): void;
  receive(
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
  improvements: EntityInstance[];
  tile: Tile;
}

export interface CityGrowth extends EntityInstance {
  cost: Yield;
  progress: Yield;
  size: number;
}

export interface CityBuild extends EntityInstance {
  available: Entity[];
  building: Entity | null;
  cost: Yield;
  progress: Yield;
}

export interface Civilization extends EntityInstance {
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
  units: Unit[];
  world: Tile[];
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
  improvements: EntityInstance[];
  tile: Tile;
}

export interface UnitAction extends EntityInstance {
  from: Tile;
  to: Tile;
}

export interface Tile extends EntityInstance {
  x: number;
  y: number;
  yields: Yield[];
}

export interface Yield extends EntityInstance {
  value: number;
}

export interface GameData extends EntityInstance {
  player: Player;
  players: Player[];
  turn: Yield;
  year: Yield;
}

export interface Notification {
  message: string;
}
