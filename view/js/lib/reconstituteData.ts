export type PlainObject = {
  [key: string]: any;
};

export type ObjectStore = {
  [key: string]: PlainObject;
};

export type ObjectMap = {
  hierarchy: PlainObject;
  objects: ObjectStore;
};

export const reconstituteData = ({
  hierarchy,
  objects,
}: ObjectMap): PlainObject => {
  const seenObjects: PlainObject[] = [];

  const getReferences = (value: any): PlainObject => {
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
