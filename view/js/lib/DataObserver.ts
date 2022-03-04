import { PlainObject } from '../types';
import { ObjectMap } from './reconstituteData';

export type dataUpdatedEvent = CustomEvent<{ data: PlainObject }>;
export type dataUpdatedHandler = (data: PlainObject) => void;
export type patchDataReceivedEvent = CustomEvent<{ value: ObjectMap }>;

declare global {
  interface GlobalEventHandlersEventMap {
    dataupdated: dataUpdatedEvent;
    patchdatareceived: patchDataReceivedEvent;
  }
}

export class DataObserver {
  #handler: (event: patchDataReceivedEvent) => void;

  constructor(ids: string[], handler: dataUpdatedHandler) {
    this.#handler = (event) => {
      const { detail } = event,
        objects = detail.value.objects;

      if (!objects) {
        return;
      }

      if (ids.some((id) => id in objects)) {
        document.addEventListener(
          'dataupdated',
          (event) => handler(event.detail.data),
          {
            once: true,
          }
        );
      }
    };

    document.addEventListener('patchdatareceived', this.#handler);
  }

  dispose(): void {
    document.removeEventListener('patchdatareceived', this.#handler);
  }
}

export default DataObserver;
