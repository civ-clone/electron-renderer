import { PlayerAction } from '../types';
export interface IActions {
    build(): void;
    element(): HTMLElement;
}
export declare class Actions implements IActions {
    #private;
    constructor(actions: PlayerAction[], container?: HTMLElement);
    build(): void;
    element(): HTMLElement;
}
export default Actions;
