import { TransferObject } from './TransferObject';

export interface ITransport {
  receive(channel: string, handler: (...args: any[]) => void): void;
  send(channel: string, payload: TransferObject): void;
}

export default ITransport;
