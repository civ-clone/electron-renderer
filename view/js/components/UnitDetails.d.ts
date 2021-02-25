import { Unit } from '../types';
export declare class UnitDetails {
    #private;
    constructor(element: HTMLElement, activeUnit: Unit | null);
    build(): void;
    element(): HTMLElement;
}
