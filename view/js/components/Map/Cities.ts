import { Tile, Unit } from '../../types';
import { Map, IMap } from '../Map.js';

export class Cities extends Map implements IMap {
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

    tiles.forEach((tile: Tile): void => {
      const x = tile.x,
        y = tile.y,
        size = this.tileSize(),
        offsetX = x * size,
        offsetY = y * size;

      if (tile.city) {
        const city = tile.city,
          player = city.player,
          civilization = player.civilization,
          [colors] = civilization.attributes.filter(
            (attribute) => attribute.name === 'colors'
          );

        if (tile.units.length > 0) {
          this.context().fillStyle = '#000';
          this.context().fillRect(offsetX, offsetY, size, size);
        }

        this.context().fillStyle = colors.value[0];
        this.context().fillRect(
          offsetX + this.scale(),
          offsetY + this.scale(),
          size - this.scale() * 2,
          size - this.scale() * 2
        );

        this.drawImage(`map/city`, x, y, (image) =>
          this.replaceColors(image, ['#000'], [colors.value[1]])
        );

        const sizeOffsetX = this.tileSize() / 2,
          sizeOffsetY = this.tileSize() * 0.75,
          textOffsetX = this.tileSize() / 2,
          textOffsetY = this.tileSize() * 1.6;

        this.context().font = `bold ${8 * this.scale()}px sans-serif`;
        this.context().fillStyle = 'black';
        this.context().textAlign = 'center';
        this.context().fillText(
          city.growth.size.toString(),
          offsetX + sizeOffsetX + this.scale(),
          offsetY + sizeOffsetY
        );
        this.context().fillText(
          city.name,
          offsetX + textOffsetX + this.scale(),
          offsetY + textOffsetY
        );
        this.context().fillStyle = 'white';
        this.context().fillText(
          city.growth.size.toString(),
          offsetX + sizeOffsetX,
          offsetY + sizeOffsetY - this.scale()
        );
        this.context().fillText(
          city.name,
          offsetX + textOffsetX,
          offsetY + textOffsetY - this.scale()
        );
      }
    });
  }
}

export default Cities;
