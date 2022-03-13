import { PlainObject } from '../types';
import { ObjectMap } from './reconstituteData';
export declare type dataUpdatedEvent = CustomEvent<{
  data: PlainObject;
}>;
export declare type dataUpdatedHandler = (data: PlainObject) => void;
export declare type patchDataReceivedEvent = CustomEvent<{
  value: ObjectMap;
}>;
declare global {
  interface GlobalEventHandlersEventMap {
    dataupdated: dataUpdatedEvent;
    patchdatareceived: patchDataReceivedEvent;
  }
}
export declare class DataObserver {
  #private;
  constructor(ids: string[], handler: dataUpdatedHandler);
  dispose(): void;
  setIds(ids: string[]): void;
}
export default DataObserver;
