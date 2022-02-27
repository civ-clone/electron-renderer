import TerrainAbstract from './TerrainAbstract.js';
export class Terrain extends TerrainAbstract {
    renderTile(tile) {
        super.renderTile(tile);
        if (tile.terrain._ === 'Unknown') {
            return;
        }
        const { x, y } = tile;
        if (tile.goodyHut !== null) {
            this.drawImage('map/hut', x, y);
        }
    }
}
export default Terrain;
//# sourceMappingURL=GoodyHuts.js.map