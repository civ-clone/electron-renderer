import { Client, IClient } from '@civ-clone/core-civ-client/Client';
import Player from '@civ-clone/core-player/Player';
export declare class ElectronClient extends Client implements IClient {
    #private;
    constructor(player: Player, sender: (channel: string, payload: any) => void, receiver: (channel: string, handler: (...args: any[]) => void) => void);
    private sendGameData;
    takeTurn(): Promise<void>;
}
export default ElectronClient;
