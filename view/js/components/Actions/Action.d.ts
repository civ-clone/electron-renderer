import { CityBuild, PlayerAction, PlayerResearch, Unit } from '../../types';
export interface IAction {
    build(): void;
    complete(): void;
    element(): HTMLElement;
    value(): CityBuild | PlayerResearch | Unit;
}
export declare class Action implements IAction {
    #private;
    constructor(action: PlayerAction);
    build(): void;
    complete(): void;
    element(): HTMLElement;
    value(): CityBuild | PlayerResearch | Unit;
}
export default Action;
