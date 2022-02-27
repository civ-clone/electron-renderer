import TerrainAbstract from './TerrainAbstract.js';
export class Terrain extends TerrainAbstract {
    renderTile(tile) {
        super.renderTile(tile);
        if (tile.terrain._ === 'Unknown') {
            return;
        }
        const { x, y } = tile, hasIrrigation = tile.improvements.some((improvement) => improvement._ === 'Irrigation');
        if (!hasIrrigation) {
            return;
        }
        this.drawImage(`improvements/irrigation`, x, y);
    }
}
export default Terrain;
//# sourceMappingURL=Irrigation.js.map