import Units from './Units.js';
export class ActiveUnit extends Units {
    render() {
        const activeUnit = this.activeUnit();
        this.context().clearRect(0, 0, this.world().width() * this.tileSize(), this.world().height() * this.tileSize());
        if (activeUnit === null) {
            return;
        }
        const tile = activeUnit.tile, x = tile.x, y = tile.y, size = this.tileSize(), offsetX = x * size, offsetY = y * size;
        if (tile.units.length > 0) {
            const player = activeUnit.player, civilization = player.civilization, [colors] = civilization.attributes.filter((attribute) => attribute.name === 'colors'), image = this.replaceColors(this.getPreloadedImage(`units/${activeUnit._.toLowerCase()}`), ['#61e365', '#2c7900'], colors.value);
            if (tile.units.length > 1) {
                this.putImage(image, offsetX - this.scale(), offsetY - this.scale());
            }
            this.putImage(image, offsetX, offsetY);
        }
    }
}
export default ActiveUnit;
//# sourceMappingURL=ActiveUnit.js.map