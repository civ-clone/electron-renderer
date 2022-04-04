import Map from './Map.js';
import { Coordinate, Tile } from '../types';
import World from './World.js';
export interface IPortal {
  build(updatedTiles: Tile[]): void;
  center(): Coordinate;
  isVisible(x: number, y: number): boolean;
  render(): void;
  scale(): number;
  setCenter(x: number, y: number): void;
  visibleBounds(): [number, number, number, number];
  visibleRange(): [Coordinate, Coordinate];
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
  isVisible(x: number, y: number): boolean;
  render(): void;
  scale(): number;
  setCenter(x: number, y: number): void;
  visibleBounds(): [number, number, number, number];
  visibleRange(): [Coordinate, Coordinate];
}
export default Portal;
