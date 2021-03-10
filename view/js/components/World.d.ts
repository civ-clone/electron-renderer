import { Tile, World as WorldData } from '../types';
export declare class World {
    #private;
    constructor(world: WorldData);
    get(x: number, y: number): Tile;
    getNeighbour(tile: Tile, direction: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'): Tile;
    height(): number;
    tiles(): Tile[];
    width(): number;
    setTileData(tiles: Tile[]): void;
}
export default World;
