import TerrainAbstract from './TerrainAbstract.js';
export class Feature extends TerrainAbstract {
    renderTile(tile) {
        super.renderTile(tile);
        if (tile.terrain._ === 'Unknown') {
            return;
        }
        const { x, y } = tile;
        if (tile.terrain.features.length) {
            tile.terrain.features.forEach((feature) => feature._ === 'Shield'
                ? this.drawImage(`terrain/${feature._.toLowerCase()}`, x, y, {
                    offsetX: 4 * this.scale(),
                    offsetY: 4 * this.scale(),
                })
                : this.drawImage(`terrain/${feature._.toLowerCase()}`, x, y));
        }
    }
}
export default Feature;
//# sourceMappingURL=Feature.js.map