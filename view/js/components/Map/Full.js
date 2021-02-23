import { Map } from '../Map.js';
export class Full extends Map {
    render(tiles = this.world().tiles()) {
        this.context().fillStyle = '#000';
        this.context().fillRect(0, 0, this.world().width() * this.tileSize(), this.world().height() * this.tileSize());
        tiles.forEach((tile) => {
            const x = tile.x, y = tile.y, size = this.tileSize(), offsetX = x * size, offsetY = y * size;
            if (tile.terrain._ === 'Unknown') {
                return;
            }
            if (tile.isLand) {
                this.drawImage('terrain/land', x, y);
            }
            else if (tile.isWater) {
                this.drawImage('terrain/ocean', x, y);
                const sprite = this.getPreloadedImage('terrain/coast_sprite'), 
                // formula from: http://forums.civfanatics.com/showpost.php?p=13507808&postcount=40
                // Build a bit mask of all 8 surrounding tiles, setting the bit if the tile is not an
                // ocean tile. Starting with the tile to the left as the least significant bit and
                // going clockwise
                bitmask = (!this.world().getNeighbour(tile, 'w').isWater ? 1 : 0) |
                    (!this.world().getNeighbour(tile, 'nw').isWater ? 2 : 0) |
                    (!this.world().getNeighbour(tile, 'n').isWater ? 4 : 0) |
                    (!this.world().getNeighbour(tile, 'nw').isWater ? 8 : 0) |
                    (!this.world().getNeighbour(tile, 'e').isWater ? 16 : 0) |
                    (!this.world().getNeighbour(tile, 'se').isWater ? 32 : 0) |
                    (!this.world().getNeighbour(tile, 's').isWater ? 64 : 0) |
                    (!this.world().getNeighbour(tile, 'sw').isWater ? 128 : 0);
                if (bitmask > 0) {
                    // There are at least one surrounding tile that is not ocean, so we need to render
                    // coast. We divide the tile into four 8x8 subtiles and for each of these we want
                    // a 3 bit bitmask of the surrounding tiles. We do this by looking at the 3 least
                    // significant bits for the top left subtile and shift the mask to the right as we
                    // are going around the tile. This way we are "rotating" our bitmask. The result
                    // are our x offsets into ter257.pic
                    let topLeftSubtileOffset = bitmask & 7, topRightSubtileOffset = (bitmask >> 2) & 7, bottomRightSubtileOffset = (bitmask >> 4) & 7, bottomLeftSubtileOffset = ((bitmask >> 6) & 7) | ((bitmask & 1) << 2);
                    this.context().drawImage(sprite, topLeftSubtileOffset << 4, 0, 8, 8, offsetX, offsetY, 8 * this.scale(), 8 * this.scale());
                    this.context().drawImage(sprite, (topRightSubtileOffset << 4) + 8, 0, 8, 8, offsetX + 8 * this.scale(), offsetY, 8, 8);
                    this.context().drawImage(sprite, (bottomRightSubtileOffset << 4) + 8, 8, 8, 8, offsetX + 8 * this.scale(), offsetY + 8 * this.scale(), 8 * this.scale(), 8 * this.scale());
                    this.context().drawImage(sprite, bottomLeftSubtileOffset << 4, 8, 8, 8, offsetX + 8 * this.scale(), offsetY, 8 * this.scale(), 8 * this.scale());
                }
                this.filterNeighbours(tile, (tile) => tile.terrain._ === 'River').forEach((direction) => this.drawImage(`terrain/river_mouth_${direction}`, x, y));
            }
            const improvements = tile.improvements.reduce((state, improvement) => {
                state[improvement._] = true;
                return state;
            }, {
                Irrigation: false,
                Mine: false,
                Road: false,
                Railroad: false,
                Pollution: false,
            });
            if (improvements.Irrigation) {
                this.drawImage('improvements/irrigation', x, y);
            }
            const adjoining = this.filterNeighbours(tile, (adjoiningTile) => (tile.terrain._ === 'River' && adjoiningTile.isWater) ||
                tile.terrain._ === adjoiningTile.terrain._).join('');
            // Ocean is covered with the land/ocean stuff above and if we re-do here, we lose the coastline
            if (tile.terrain._ !== 'Ocean') {
                if (adjoining) {
                    this.drawImage(`terrain/${tile.terrain._.toLowerCase()}_${adjoining}`, x, y);
                }
                else {
                    this.drawImage(`terrain/${tile.terrain._.toLowerCase()}`, x, y);
                }
            }
            if (tile.terrain.features.length) {
                tile.terrain.features.forEach((feature) => this.drawImage(`terrain/${feature._.toLowerCase()}`, x, y));
            }
            ['Mine', 'Pollution'].forEach((improvementName) => {
                if (improvements[improvementName]) {
                    this.drawImage(`improvements/${improvementName.toLowerCase()}`, x, y);
                }
            });
            if (improvements.Road) {
                const neighbouringRoad = this.filterNeighbours(tile, (adjoiningTile) => adjoiningTile.improvements.some((improvement) => improvement._ === 'Road'), ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']), neighbouringRailroad = this.filterNeighbours(tile, (adjoiningTile) => adjoiningTile.improvements.some((improvement) => improvement._ === 'Railroad'), ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']);
                neighbouringRoad.forEach((direction) => {
                    if (improvements.Railroad &&
                        !neighbouringRailroad.includes(direction)) {
                        this.drawImage(`improvements/road_${direction}`, x, y);
                    }
                });
                neighbouringRailroad.forEach((direction) => this.drawImage(`improvements/railroad_${direction}`, x, y));
                // TODO: render a dot or something like civ
            }
            this.filterNeighbours(tile, (tile) => tile.terrain._ === 'Unknown').forEach((direction) => this.drawImage(`map/fog_${direction}`, x, y));
        });
    }
}
export default Full;
//# sourceMappingURL=Full.js.map