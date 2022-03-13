var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Portal_canvas, _Portal_center, _Portal_context, _Portal_layers, _Portal_scale, _Portal_world;
import { e } from '../lib/html.js';
export class Portal {
    constructor(world, canvas = e('canvas'), scale = 2, ...layers) {
        _Portal_canvas.set(this, void 0);
        _Portal_center.set(this, { x: 0, y: 0 });
        _Portal_context.set(this, void 0);
        _Portal_layers.set(this, []);
        _Portal_scale.set(this, void 0);
        _Portal_world.set(this, void 0);
        __classPrivateFieldSet(this, _Portal_world, world, "f");
        __classPrivateFieldSet(this, _Portal_canvas, canvas, "f");
        __classPrivateFieldSet(this, _Portal_scale, scale, "f");
        __classPrivateFieldGet(this, _Portal_layers, "f").push(...layers);
        __classPrivateFieldSet(this, _Portal_context, canvas.getContext('2d'), "f");
    }
    build(updatedTiles) {
        __classPrivateFieldGet(this, _Portal_layers, "f").forEach((layer) => layer.update(updatedTiles));
    }
    center() {
        return __classPrivateFieldGet(this, _Portal_center, "f");
    }
    visibleRange() {
        const xRange = Math.floor(__classPrivateFieldGet(this, _Portal_canvas, "f").width / __classPrivateFieldGet(this, _Portal_layers, "f")[0].tileSize() / __classPrivateFieldGet(this, _Portal_scale, "f")), yRange = Math.floor(__classPrivateFieldGet(this, _Portal_canvas, "f").height / __classPrivateFieldGet(this, _Portal_layers, "f")[0].tileSize() / __classPrivateFieldGet(this, _Portal_scale, "f"));
        return [
            { x: __classPrivateFieldGet(this, _Portal_center, "f").x - xRange, y: __classPrivateFieldGet(this, _Portal_center, "f").y - yRange },
            { x: __classPrivateFieldGet(this, _Portal_center, "f").x + xRange, y: __classPrivateFieldGet(this, _Portal_center, "f").y + yRange },
        ];
    }
    isVisible(x, y) {
        const xRange = Math.floor(__classPrivateFieldGet(this, _Portal_canvas, "f").width / __classPrivateFieldGet(this, _Portal_layers, "f")[0].tileSize() / __classPrivateFieldGet(this, _Portal_scale, "f")), yRange = Math.floor(__classPrivateFieldGet(this, _Portal_canvas, "f").height / __classPrivateFieldGet(this, _Portal_layers, "f")[0].tileSize() / __classPrivateFieldGet(this, _Portal_scale, "f"));
        return (x < __classPrivateFieldGet(this, _Portal_center, "f").x + xRange &&
            x > __classPrivateFieldGet(this, _Portal_center, "f").x - xRange &&
            y < __classPrivateFieldGet(this, _Portal_center, "f").y + yRange &&
            y > __classPrivateFieldGet(this, _Portal_center, "f").y - yRange);
    }
    render() {
        // TODO: replace `2` with the scale
        const tileSize = __classPrivateFieldGet(this, _Portal_layers, "f")[0].tileSize(), layerWidth = __classPrivateFieldGet(this, _Portal_world, "f").width() * tileSize, centerX = __classPrivateFieldGet(this, _Portal_center, "f").x * tileSize + Math.trunc(tileSize / 2), portalCenterX = Math.trunc(__classPrivateFieldGet(this, _Portal_canvas, "f").width / 2), layerHeight = __classPrivateFieldGet(this, _Portal_world, "f").height() * tileSize, centerY = __classPrivateFieldGet(this, _Portal_center, "f").y * tileSize + Math.trunc(tileSize / 2), portalCenterY = Math.trunc(__classPrivateFieldGet(this, _Portal_canvas, "f").height / 2);
        let startX = portalCenterX - centerX, endX = portalCenterX + layerWidth, startY = portalCenterY - centerY, endY = portalCenterY + layerHeight;
        while (startX > 0) {
            startX -= layerWidth;
        }
        while (startY > 0) {
            startY -= layerHeight;
        }
        while (endX < __classPrivateFieldGet(this, _Portal_canvas, "f").width) {
            endX += layerWidth;
        }
        while (endY < __classPrivateFieldGet(this, _Portal_canvas, "f").height) {
            endY += layerHeight;
        }
        __classPrivateFieldGet(this, _Portal_context, "f").fillStyle = '#000';
        __classPrivateFieldGet(this, _Portal_context, "f").fillRect(0, 0, __classPrivateFieldGet(this, _Portal_world, "f").width() * tileSize, __classPrivateFieldGet(this, _Portal_world, "f").height() * tileSize);
        for (let x = startX; x < endX; x += layerWidth) {
            for (let y = startY; y < endY; y += layerHeight) {
                __classPrivateFieldGet(this, _Portal_layers, "f").forEach((layer) => {
                    if (!layer.isVisible()) {
                        return;
                    }
                    const canvas = layer.canvas();
                    __classPrivateFieldGet(this, _Portal_context, "f").drawImage(canvas, x, y, canvas.width, canvas.height);
                });
            }
        }
    }
    scale() {
        return __classPrivateFieldGet(this, _Portal_scale, "f");
    }
    setCenter(x, y) {
        __classPrivateFieldGet(this, _Portal_center, "f").x = x;
        __classPrivateFieldGet(this, _Portal_center, "f").y = y;
        this.render();
    }
}
_Portal_canvas = new WeakMap(), _Portal_center = new WeakMap(), _Portal_context = new WeakMap(), _Portal_layers = new WeakMap(), _Portal_scale = new WeakMap(), _Portal_world = new WeakMap();
export default Portal;
//# sourceMappingURL=Portal.js.map