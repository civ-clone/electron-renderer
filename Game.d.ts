export interface IGame {
  start(): Promise<void>;
}
export declare class Game implements IGame {
  #private;
  constructor();
  createWindow(): void;
  private bindEvents;
  private configure;
  private sendData;
  start(): Promise<void>;
}
export default Game;
