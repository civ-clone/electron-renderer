import TerrainAbstract from './TerrainAbstract.js';
export class Feature extends TerrainAbstract {
    renderTile(tile) {
        super.renderTile(tile);
        if (tile.terrain._ === 'Unknown') {
            return;
        }
        const { x, y } = tile;
        if (tile.terrain.features.length) {
            tile.terrain.features.forEach((feature) => this.drawImage(`terrain/${feature._.toLowerCase()}`, x, y));
        }
    }
}
export default Feature;
//# sourceMappingURL=Feature.js.map