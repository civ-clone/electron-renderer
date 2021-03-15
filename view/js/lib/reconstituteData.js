export const reconstituteData = ({ hierarchy, objects, }) => {
    const seenObjects = [];
    const getReferences = (value) => {
        if (seenObjects.includes(value)) {
            return value;
        }
        seenObjects.push(value);
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return [];
            }
            const newValues = value.map((value) => getReferences(value));
            value.splice(0, value.length, ...newValues);
            // if (Object.prototype.hasOwnProperty.call(value[0], 'id')) {
            //   return value.reduce((object: { [key: string]: any }, value: any) => {
            //     object[value.id] = getReferences(value);
            //
            //     return object;
            //   }, {});
            // }
            return value;
        }
        if (value && value['#ref']) {
            Object.assign(value, getReferences(objects[value['#ref']]));
        }
        if (value instanceof Object) {
            Object.entries(value).forEach(([key, childValue]) => {
                value[key] = getReferences(childValue);
            });
        }
        return value;
    };
    return getReferences(hierarchy);
};
export default reconstituteData;
//# sourceMappingURL=reconstituteData.js.map