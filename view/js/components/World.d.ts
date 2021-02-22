import { City, Tile, Unit } from '../types';
export declare class World {
    #private;
    constructor(height?: number, width?: number);
    get(x: number, y: number): Tile;
    getNeighbour(tile: Tile, direction: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'): Tile;
    getSurrounding(x: number, y: number, radius?: number): Tile[];
    getRows(): Tile[][];
    height(): number;
    width(): number;
    setCityData(cities: City[]): void;
    setTileData(tiles: Tile[]): void;
    setUnitData(units: Unit[]): void;
}
export default World;
