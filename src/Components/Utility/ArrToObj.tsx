type Element = {
  name: string;
  [key: string]: any;
};

export function ArrayToObject(
  arr: Element[],
  key: string
): Record<string, any> {
  const result: Record<string, any> = {};

  if (arr) {
    arr.forEach((element) => {
      const elementName = element.name ? element.name : 'api-name';
      const elementKey = elementName.toLowerCase().replace(/\s+/g, '-');
      const { name, ...fields } = element;
      result[elementKey] = fields;
    });
  }

  return { [key]: result };
}
