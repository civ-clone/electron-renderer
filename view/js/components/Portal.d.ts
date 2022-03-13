import Map from './Map.js';
import { Coordinate, Tile } from '../types';
import World from './World.js';
export interface IPortal {
  build(updatedTiles: Tile[]): void;
  isVisible(x: number, y: number): boolean;
  render(): void;
  setCenter(x: number, y: number): void;
}
export declare class Portal implements IPortal {
  #private;
  constructor(
    world: World,
    canvas?: HTMLCanvasElement,
    scale?: number,
    ...layers: Map[]
  );
  build(updatedTiles: Tile[]): void;
  center(): Coordinate;
  visibleRange(): [Coordinate, Coordinate];
  isVisible(x: number, y: number): boolean;
  render(): void;
  scale(): number;
  setCenter(x: number, y: number): void;
}
export default Portal;
