import { Tile, Unit } from '../../types';
import { Map, IMap } from '../Map.js';

export class Units extends Map implements IMap {
  render(
    tiles: Tile[] = this.world().tiles(),
    activeUnit: Unit | null = null
  ): void {
    this.context().clearRect(
      0,
      0,
      this.world().width() * this.tileSize(),
      this.world().height() * this.tileSize()
    );

    tiles.forEach((tile: Tile) => {
      const x = tile.x,
        y = tile.y,
        size = this.tileSize(),
        offsetX = x * size,
        offsetY = y * size;

      if (
        tile.units.length > 0 &&
        (activeUnit !== null ? activeUnit.tile.id !== tile.id : true)
      ) {
        const [unit] = tile.units.sort(
            (a: Unit, b: Unit): number => b.defence.value - a.defence.value
          ),
          player = unit.player,
          civilization = player.civilization,
          [colors] = civilization.attributes.filter(
            (attribute) => attribute.name === 'colors'
          ),
          image = this.replaceColors(
            this.getPreloadedImage(`units/${unit._.toLowerCase()}`),
            ['#61e365', '#2c7900'],
            colors.value
          );

        if (tile.units.length > 1) {
          this.putImage(image, offsetX - this.scale(), offsetY - this.scale());
        }

        this.putImage(image, offsetX, offsetY);
      }
    });
  }
}

export default Units;
