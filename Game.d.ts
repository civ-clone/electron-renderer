export interface IGame {
    start(): void;
}
export declare class Game implements IGame {
    #private;
    constructor();
    private createWindow;
    private bindEvents;
    private configure;
    private sendData;
    start(): void;
}
export default Game;
