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
var _Minimap_context, _Minimap_element, _Minimap_layers, _Minimap_portal, _Minimap_world;
export class Minimap {
    constructor(element, world, portal, ...layers) {
        _Minimap_context.set(this, void 0);
        _Minimap_element.set(this, void 0);
        _Minimap_layers.set(this, void 0);
        _Minimap_portal.set(this, void 0);
        _Minimap_world.set(this, void 0);
        __classPrivateFieldSet(this, _Minimap_element, element, "f");
        __classPrivateFieldSet(this, _Minimap_world, world, "f");
        __classPrivateFieldSet(this, _Minimap_portal, portal, "f");
        __classPrivateFieldSet(this, _Minimap_layers, layers, "f");
        __classPrivateFieldSet(this, _Minimap_context, __classPrivateFieldGet(this, _Minimap_element, "f").getContext('2d'), "f");
        __classPrivateFieldGet(this, _Minimap_element, "f").addEventListener('click', (event) => {
            const x = event.offsetX - __classPrivateFieldGet(this, _Minimap_element, "f").offsetLeft, y = event.offsetY - __classPrivateFieldGet(this, _Minimap_element, "f").offsetTop, tileX = Math.ceil((x / __classPrivateFieldGet(this, _Minimap_element, "f").offsetWidth) * __classPrivateFieldGet(this, _Minimap_world, "f").width()), tileY = Math.ceil((y / __classPrivateFieldGet(this, _Minimap_element, "f").offsetHeight) * __classPrivateFieldGet(this, _Minimap_world, "f").height());
            __classPrivateFieldGet(this, _Minimap_portal, "f").setCenter(tileX, tileY);
            this.update();
        });
    }
    update() {
        const targetHeight = __classPrivateFieldGet(this, _Minimap_layers, "f")[0].canvas().height * (190 / __classPrivateFieldGet(this, _Minimap_layers, "f")[0].canvas().width);
        __classPrivateFieldGet(this, _Minimap_element, "f").height = targetHeight;
        __classPrivateFieldGet(this, _Minimap_context, "f").clearRect(0, 0, 190, targetHeight);
        __classPrivateFieldGet(this, _Minimap_layers, "f").forEach((layer) => __classPrivateFieldGet(this, _Minimap_context, "f").drawImage(layer.canvas(), 0, 0, 190, targetHeight));
        const [start, end] = __classPrivateFieldGet(this, _Minimap_portal, "f").visibleRange();
        // TODO: draw the rectangle replicated when close to the sides
        __classPrivateFieldGet(this, _Minimap_context, "f").lineWidth = 1;
        __classPrivateFieldGet(this, _Minimap_context, "f").strokeStyle = '#fff';
        __classPrivateFieldGet(this, _Minimap_context, "f").fillStyle = 'rgba(255, 255, 255, .2)';
        __classPrivateFieldGet(this, _Minimap_context, "f").rect(Math.floor((190 / __classPrivateFieldGet(this, _Minimap_world, "f").width()) * start.x), Math.floor((targetHeight / __classPrivateFieldGet(this, _Minimap_world, "f").height()) * start.y), Math.floor((190 / __classPrivateFieldGet(this, _Minimap_world, "f").width()) * (end.x - start.x)), Math.floor((targetHeight / __classPrivateFieldGet(this, _Minimap_world, "f").height()) * (end.y - start.y)));
        __classPrivateFieldGet(this, _Minimap_context, "f").stroke();
        __classPrivateFieldGet(this, _Minimap_context, "f").fill();
    }
}
_Minimap_context = new WeakMap(), _Minimap_element = new WeakMap(), _Minimap_layers = new WeakMap(), _Minimap_portal = new WeakMap(), _Minimap_world = new WeakMap();
export default Minimap;
//# sourceMappingURL=Minimap.js.map