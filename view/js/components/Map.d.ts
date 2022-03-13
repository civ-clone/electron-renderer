import { NeighbourDirection, Tile } from '../types';
import World from './World.js';
export interface IMap {
  context(): CanvasRenderingContext2D;
  render(...args: any[]): void;
  scale(): number;
  tileSize(): number;
  world(): World;
}
export declare class Map implements IMap {
  #private;
  constructor(world: World, scale?: number, canvas?: HTMLCanvasElement);
  canvas(): HTMLCanvasElement;
  clear(): void;
  context(): CanvasRenderingContext2D;
  render(tiles?: Tile[]): void;
  renderTile({ x, y }: Tile): void;
  scale(): number;
  tileSize(): number;
  update(tilesToUpdate: Tile[]): void;
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
    directions?: NeighbourDirection[]
  ): NeighbourDirection[];
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
  protected setCanvasSize(): void;
  isVisible(): boolean;
  setVisible(visible: boolean): void;
}
export default Map;
