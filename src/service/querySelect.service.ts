export function querySetSelect(select: string[]): { [key: string]: boolean } {
  const newSelect = {
    ...select.reduce((acc, item) => {
      acc[item] = true;
      return acc;
    }, {}),
  };
  return newSelect;
}
