import TerrainAbstract from './TerrainAbstract.js';
import { Tile } from '../../types';

export class Feature extends TerrainAbstract {
  renderTile(tile: Tile): void {
    super.renderTile(tile);

    if (tile.terrain._ === 'Unknown') {
      return;
    }

    const { x, y } = tile;

    if (tile.terrain.features.length) {
      tile.terrain.features.forEach((feature) =>
        this.drawImage(`terrain/${feature._.toLowerCase()}`, x, y)
      );
    }
  }
}

export default Feature;
