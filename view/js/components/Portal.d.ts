import Map from './Map.js';
import World from './World.js';
export declare type Coordinate = {
    x: number;
    y: number;
};
export interface IPortal {
    build(): void;
    render(): void;
    setCenter(x: number, y: number): void;
}
export declare class Portal implements IPortal {
    #private;
    constructor(world: World, canvas?: HTMLCanvasElement, ...layers: Map[]);
    build(): void;
    render(): void;
    setCenter(x: number, y: number): void;
}
export default Portal;
