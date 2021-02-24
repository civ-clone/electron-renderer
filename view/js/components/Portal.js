var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _canvas, _center, _context, _layers, _world;
import { e } from '../lib/html.js';
export class Portal {
    constructor(world, canvas = e('canvas'), ...layers) {
        _canvas.set(this, void 0);
        _center.set(this, { x: 0, y: 0 });
        _context.set(this, void 0);
        _layers.set(this, []);
        _world.set(this, void 0);
        __classPrivateFieldSet(this, _world, world);
        __classPrivateFieldSet(this, _canvas, canvas);
        __classPrivateFieldGet(this, _layers).push(...layers);
        __classPrivateFieldSet(this, _context, canvas.getContext('2d'));
        this.build();
    }
    build() {
        __classPrivateFieldGet(this, _layers).forEach((layer) => layer.render());
    }
    render() {
        const tileSize = __classPrivateFieldGet(this, _layers)[0].tileSize(), layerWidth = __classPrivateFieldGet(this, _world).width() * tileSize, centerX = __classPrivateFieldGet(this, _center).x * tileSize + Math.trunc(tileSize / 2), portalCenterX = Math.trunc(__classPrivateFieldGet(this, _canvas).width / 2), layerHeight = __classPrivateFieldGet(this, _world).height() * tileSize, centerY = __classPrivateFieldGet(this, _center).y * tileSize + Math.trunc(tileSize / 2), portalCenterY = Math.trunc(__classPrivateFieldGet(this, _canvas).height / 2);
        let startX = portalCenterX - centerX, endX = portalCenterX + layerWidth, startY = portalCenterY - centerY, endY = portalCenterY + layerHeight;
        while (startX > 0) {
            startX -= layerWidth;
        }
        while (startY > 0) {
            startY -= layerHeight;
        }
        while (endX < __classPrivateFieldGet(this, _canvas).width) {
            endX += layerWidth;
        }
        while (endY < __classPrivateFieldGet(this, _canvas).height) {
            endY += layerHeight;
        }
        __classPrivateFieldGet(this, _context).fillStyle = '#000';
        __classPrivateFieldGet(this, _context).fillRect(0, 0, __classPrivateFieldGet(this, _world).width() * tileSize, __classPrivateFieldGet(this, _world).height() * tileSize);
        for (let x = startX; x < endX; x += layerWidth) {
            for (let y = startY; y < endY; y += layerHeight) {
                __classPrivateFieldGet(this, _layers).forEach((layer) => {
                    if (!layer.isVisible()) {
                        return;
                    }
                    const canvas = layer.canvas();
                    __classPrivateFieldGet(this, _context).drawImage(canvas, x, y, canvas.width, canvas.height);
                });
            }
        }
    }
    setCenter(x, y) {
        __classPrivateFieldGet(this, _center).x = x;
        __classPrivateFieldGet(this, _center).y = y;
    }
}
_canvas = new WeakMap(), _center = new WeakMap(), _context = new WeakMap(), _layers = new WeakMap(), _world = new WeakMap();
export default Portal;
//# sourceMappingURL=Portal.js.map