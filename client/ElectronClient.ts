import { Client, IClient } from '@civ-clone/core-civ-client/Client';
import Player from '@civ-clone/core-player/Player';
import TransferObject from './TransferObject';

export class ElectronClient extends Client implements IClient {
  #sender: (channel: string, payload: any) => void;
  #receiver: (channel: string, handler: (...args: any[]) => void) => void;

  constructor(
    player: Player,
    sender: (channel: string, payload: any) => void,
    receiver: (channel: string, handler: (...args: any[]) => void) => void
  ) {
    super(player);

    this.#sender = sender;
    this.#receiver = receiver;
  }

  private sendGameData(): void {
    this.#sender('gameData', new TransferObject(this.player()).toPlainObject());
  }

  takeTurn(): Promise<void> {
    return new Promise<void>((resolve, reject): void => {
      this.sendGameData();

      this.#receiver('move', (...args): void => {
        console.log(...args);

        this.sendGameData();
      });
    });
  }
}

export default ElectronClient;
