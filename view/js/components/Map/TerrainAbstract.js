import { Map } from '../Map.js';
export class TerrainAbstract extends Map {
    update(tilesToUpdate) {
        // we need to redraw the surrounding tiles to prevent the hidden terrain showing up incorrectly.
        const extendedTilesToUpdate = [...tilesToUpdate];
        tilesToUpdate.forEach((tile) => {
            ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].forEach((direction) => {
                const target = this.world().getNeighbour(tile, direction);
                if (extendedTilesToUpdate.includes(target)) {
                    return;
                }
                extendedTilesToUpdate.push(target);
            });
        });
        return super.update(extendedTilesToUpdate);
    }
}
export default TerrainAbstract;
//# sourceMappingURL=TerrainAbstract.js.map