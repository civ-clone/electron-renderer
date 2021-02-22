import { Tile, Unit } from '../types';
import World from './World.js';
export declare class Map {
    #private;
    constructor(world: World, canvas: HTMLCanvasElement, activeUnit?: Unit | null, scale?: number);
    getPreloadedImage(path: string): CanvasImageSource;
    render(rows?: Tile[][]): void;
    replaceColors(image: CanvasImageSource, source: string[], replacement: string[]): HTMLCanvasElement;
    scale(): number;
    tileSize(): number;
}
export default Map;
