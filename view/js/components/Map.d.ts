import { Tile, Unit } from '../types';
import World from './World.js';
export declare type Adjacent = 'n' | 'e' | 's' | 'w';
export declare type Neighbouring = Adjacent | 'ne' | 'se' | 'sw' | 'nw';
export interface IMap {
  context(): CanvasRenderingContext2D;
  render(...args: any[]): void;
  scale(): number;
  tileSize(): number;
  world(): World;
}
export declare class Map implements IMap {
  #private;
  constructor(
    world: World,
    canvas: HTMLCanvasElement,
    activeUnit?: Unit | null,
    scale?: number
  );
  context(): CanvasRenderingContext2D;
  render(...args: any[]): void;
  scale(): number;
  tileSize(): number;
  world(): World;
  protected drawImage(
    path: string,
    x: number,
    y: number,
    augment?: (image: CanvasImageSource) => CanvasImageSource
  ): void;
  protected filterNeighbours(
    tile: Tile,
    filter: (tile: Tile) => boolean,
    directions?: Neighbouring[]
  ): Neighbouring[];
  protected getPreloadedImage(path: string): CanvasImageSource;
  protected putImage(
    image: CanvasImageSource,
    offsetX: number,
    offsetY: number
  ): void;
  protected replaceColors(
    image: CanvasImageSource,
    source: string[],
    replacement: string[]
  ): HTMLCanvasElement;
}
export default Map;
