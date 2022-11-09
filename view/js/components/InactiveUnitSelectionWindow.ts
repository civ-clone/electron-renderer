import { ITransport, Unit } from '../types';
import SelectionWindow from './SelectionWindow';

declare var transport: ITransport;

export class InactiveUnitSelectionWindow extends SelectionWindow {
  constructor(units: Unit[], onComplete: (unit: Unit) => void = () => {}) {
    super(
      // TODO: i18n
      'Activate unit',
      units.map((unit: Unit) => ({
        label:
          unit._ +
          ' [' +
          (unit.city?.name ?? 'NONE') +
          ']' +
          (unit.busy ? ` (${unit.busy!._})` : ''),
        value: unit.id,
      })),
      (selection: string) => {
        const [unit] = units.filter((tileUnit) => tileUnit.id === selection);

        if (!unit) {
          return;
        }

        if (!unit.active) {
          transport.send('action', {
            name: 'InactiveUnit',
            id: selection,
          });

          return;
        }

        onComplete(unit);
      },
      null
    );
  }
}

export default InactiveUnitSelectionWindow;
