import { ITransport, Unit } from '../types';
import City from './City';
import Portal from './Portal';
import SelectionWindow from './SelectionWindow';

declare var transport: ITransport;

export class GamePortal extends Portal {
  protected bindEvents(): void {
    this.canvas().addEventListener('click', (event) => {
      const currentCenter = this.center();

      let x = event.offsetX,
        y = event.offsetY;

      x =
        (x - (this.canvas().width / 2 - this.tileSize())) /
          (this.tileSize() * this.scale()) +
        currentCenter.x;
      y =
        (y - (this.canvas().height / 2 - this.tileSize())) /
          (this.tileSize() * this.scale()) +
        currentCenter.y;

      while (x < 0) {
        x += this.world().width();
      }

      while (y < 0) {
        y += this.world().height();
      }

      while (x > this.world().width()) {
        x -= this.world().width();
      }

      while (y > this.world().height()) {
        y -= this.world().height();
      }

      const tile = this.world().get(Math.trunc(x), Math.trunc(y)),
        playerTileUnits = tile.units.filter(
          (unit: Unit) => unit.player.id === this.playerId()
        );

      if (tile.city) {
        new City(tile.city, this);
      } else if (playerTileUnits.length) {
        new SelectionWindow(
          'Activate unit',
          playerTileUnits.map((unit: Unit) => ({
            label: unit._ + (unit.busy ? ` (${unit.busy!._})` : ''),
            value: unit.id,
          })),
          (selection: string) => {
            const [unit] = playerTileUnits.filter(
              (tileUnit) => tileUnit.id === selection
            );

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

            this.emit('activate-unit', unit);
          },
          null
        );

        return;
      }

      this.setCenter(tile.x, tile.y);
    });
  }
}

export default GamePortal;
