var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _DataObserver_handler, _DataObserver_ids;
export class DataObserver {
    constructor(ids, handler) {
        _DataObserver_handler.set(this, void 0);
        _DataObserver_ids.set(this, []);
        this.setIds(ids);
        __classPrivateFieldSet(this, _DataObserver_handler, (event) => {
            const { detail } = event, objects = detail.value.objects;
            if (!objects) {
                return;
            }
            if (__classPrivateFieldGet(this, _DataObserver_ids, "f").some((id) => id in objects)) {
                document.addEventListener('dataupdated', (event) => handler(event.detail.data), {
                    once: true,
                });
            }
        }, "f");
        document.addEventListener('patchdatareceived', __classPrivateFieldGet(this, _DataObserver_handler, "f"));
    }
    dispose() {
        document.removeEventListener('patchdatareceived', __classPrivateFieldGet(this, _DataObserver_handler, "f"));
    }
    setIds(ids) {
        __classPrivateFieldGet(this, _DataObserver_ids, "f").splice(0, __classPrivateFieldGet(this, _DataObserver_ids, "f").length, ...ids);
    }
}
_DataObserver_handler = new WeakMap(), _DataObserver_ids = new WeakMap();
export default DataObserver;
//# sourceMappingURL=DataObserver.js.map