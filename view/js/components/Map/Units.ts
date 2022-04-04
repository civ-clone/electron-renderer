import { Tile, Unit } from '../../types';
import { Map, IMap } from '../Map.js';

const busyLookup: { [key: string]: string } = {
  BuildingIrrigation: 'I',
  BuildingMine: 'M',
  BuildingRoad: 'R',
  BuildingRailroad: 'RR',
  // 'ClearingForest': 'CF',
  // 'ClearingJungle': 'CJ',
  // 'ClearingSwamp': 'CS',
  // 'Fortifying': 'F',
  // 'Sleeping': 'S',
  // 'PlantingForest': 'PF',
};

export class Units extends Map implements IMap {
  #activeUnit: Unit | null = null;

  renderTile(tile: Tile): void {
    super.renderTile(tile);

    const { x, y } = tile,
      size = this.tileSize(),
      offsetX = x * size,
      offsetY = y * size;

    if (
      tile.units.length > 0 &&
      (this.#activeUnit !== null ? this.#activeUnit.tile.id !== tile.id : true)
    ) {
      const [unit] = tile.units.sort(
          (a: Unit, b: Unit): number => b.defence?.value - a.defence?.value
        ),
        image = this.renderUnit(unit);

      if (tile.units.length > 1) {
        this.putImage(image, offsetX - this.scale(), offsetY - this.scale());
      }

      this.putImage(image, offsetX, offsetY);

      if (
        unit.improvements?.some((improvement) => improvement._ === 'Fortified')
      ) {
        this.drawImage('map/fortify', x, y);
      }

      if (unit.busy) {
        // if (unit.busy._ === 'Sleeping') {} // TODO: fade the unit like in Civ 1
        const sizeOffsetX = this.tileSize() / 2,
          sizeOffsetY = this.tileSize() * 0.75,
          identifier =
            busyLookup[unit.busy._] ?? unit.busy._.replace(/[a-z]+/g, '');

        this.context().font = `bold ${8 * this.scale()}px sans-serif`;
        this.context().fillStyle = 'black';
        this.context().textAlign = 'center';
        this.context().fillText(
          identifier,
          offsetX + sizeOffsetX + this.scale(),
          offsetY + sizeOffsetY + this.scale()
        );
        this.context().fillStyle = 'white';
        this.context().fillText(
          identifier,
          offsetX + sizeOffsetX,
          offsetY + sizeOffsetY
        );
      }
    }
  }

  protected renderUnit(unit: Unit): CanvasImageSource {
    const player = unit.player,
      civilization = player.civilization,
      [colors] = civilization.attributes.filter(
        (attribute) => attribute.name === 'colors'
      );

    return this.replaceColors(
      this.getPreloadedImage(`units/${unit._.toLowerCase()}`),
      // To come from theme manifest
      ['#60E064', '#2C7800'],
      colors.value
    );
  }

  setActiveUnit(unit: Unit | null): void {
    this.#activeUnit = unit;
  }

  protected activeUnit(): Unit | null {
    return this.#activeUnit;
  }
}

export default Units;
