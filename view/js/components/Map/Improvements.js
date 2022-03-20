import TerrainAbstract from './TerrainAbstract.js';
export class Terrain extends TerrainAbstract {
    renderTile(tile) {
        super.renderTile(tile);
        if (tile.terrain._ === 'Unknown') {
            return;
        }
        const { x, y } = tile;
        const improvements = tile.improvements.reduce((state, improvement) => {
            const improvementType = improvement._;
            if (!(improvementType in state)) {
                return state;
            }
            state[improvementType] = true;
            return state;
        }, {
            Mine: false,
            Road: false,
            Railroad: false,
            Pollution: false,
        });
        ['Mine', 'Pollution'].forEach((improvementName) => {
            if (improvements[improvementName]) {
                this.drawImage(`improvements/${improvementName.toLowerCase()}`, x, y);
            }
        });
        // Can't have Railroad without Road!
        if (improvements.Road) {
            const neighbouringRoad = this.filterNeighbours(tile, (adjoiningTile) => adjoiningTile.improvements.some((improvement) => improvement._ === 'Road'), ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']), neighbouringRailroad = this.filterNeighbours(tile, (adjoiningTile) => !!adjoiningTile.city ||
                adjoiningTile.improvements.some((improvement) => improvement._ === 'Railroad'), ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']);
            neighbouringRoad.forEach((direction) => {
                if (!improvements.Railroad ||
                    !neighbouringRailroad.includes(direction)) {
                    this.drawImage(`improvements/road_${direction}`, x, y);
                }
            });
            if (improvements.Railroad) {
                neighbouringRailroad.forEach((direction) => this.drawImage(`improvements/railroad_${direction}`, x, y));
            }
            if (neighbouringRoad.length === 0 && neighbouringRailroad.length === 0) {
                const size = this.tileSize(), offsetX = x * size, offsetY = y * size, center = Math.floor(this.tileSize() / 2) - this.scale();
                this.context().fillStyle = improvements.Railroad ? '#000' : '#8c5828';
                this.context().rect(offsetX + center, offsetY + center, this.scale() * 2, this.scale() * 2);
                this.context().fill();
            }
        }
    }
}
export default Terrain;
//# sourceMappingURL=Improvements.js.map