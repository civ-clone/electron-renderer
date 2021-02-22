export const reconstituteData = ({ hierarchy, objects, }) => {
    const seenObjects = [];
    const getReferences = (value) => {
        if (seenObjects.includes(value)) {
            return value;
        }
        seenObjects.push(value);
        if (Array.isArray(value)) {
            return value.map((value) => getReferences(value));
        }
        if (value && value['#ref']) {
            return getReferences(objects[value['#ref']]);
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