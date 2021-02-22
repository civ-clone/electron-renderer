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
