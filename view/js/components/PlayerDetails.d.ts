import { Player } from '../types';
import Element from './Element.js';
export declare class PlayerDetails extends Element {
    #private;
    constructor(element: HTMLElement, player: Player);
    build(): void;
}
export default PlayerDetails;
