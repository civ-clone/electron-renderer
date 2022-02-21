import { Tile, Unit } from '../../types';
import { Map, IMap } from '../Map.js';

export class Units extends Map implements IMap {
  #activeUnit: Unit | null = null;

  render(tiles: Tile[] = this.world().tiles()): void {
    this.clear();

    tiles.forEach(({ x, y }: Tile) => {
      const tile = this.world().get(x, y),
        size = this.tileSize(),
        offsetX = x * size,
        offsetY = y * size;

      if (
        tile.units.length > 0 &&
        (this.#activeUnit !== null
          ? this.#activeUnit.tile.id !== tile.id
          : true)
      ) {
        const [unit] = tile.units.sort(
            (a: Unit, b: Unit): number => b.defence?.value - a.defence?.value
          ),
          player = unit.player,
          civilization = player.civilization,
          [colors] = civilization.attributes.filter(
            (attribute) => attribute.name === 'colors'
          ),
          image = this.replaceColors(
            this.getPreloadedImage(`units/${unit._.toLowerCase()}`),
            // To come from theme manifest
            ['#60E064', '#2C7800'],
            colors.value
          );

        if (tile.units.length > 1) {
          this.putImage(image, offsetX - this.scale(), offsetY - this.scale());
        }

        this.putImage(image, offsetX, offsetY);

        if (
          unit.improvements?.some(
            (improvement) => improvement._ === 'Fortified'
          )
        ) {
          this.drawImage('map/fortify', x, y);
        }
      }
    });
  }

  setActiveUnit(unit: Unit | null): void {
    this.#activeUnit = unit;
  }

  protected activeUnit(): Unit | null {
    return this.#activeUnit;
  }
}

export default Units;
