import { Map } from '../Map.js';
export class Cities extends Map {
    renderTile(tile) {
        super.renderTile(tile);
        const { x, y } = tile, size = this.tileSize(), offsetX = x * size, offsetY = y * size;
        if (tile.city) {
            const city = tile.city, player = city.player, civilization = player.civilization, [colors] = civilization.attributes.filter((attribute) => attribute.name === 'colors');
            if (tile.units.length > 0) {
                this.context().fillStyle = '#000';
                this.context().fillRect(offsetX, offsetY, size, size);
            }
            this.context().fillStyle = colors.value[0];
            this.context().fillRect(offsetX + this.scale(), offsetY + this.scale(), size - this.scale() * 2, size - this.scale() * 2);
            this.drawImage(`map/city`, x, y, {
                augment: (image) => this.replaceColors(image, 
                // To come from theme manifest
                ['#000'], [colors.value[1]]),
                offsetX: this.scale(),
                offsetY: this.scale(),
            });
        }
    }
}
export default Cities;
//# sourceMappingURL=Cities.js.map