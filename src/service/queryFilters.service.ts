export function querySetFilter(filters: { [key: string]: unknown }): {
  [key: string]: unknown;
} {
  for (const key in filters) {
    if (filters.hasOwnProperty(key)) {
      const value = filters[key];
      if (Array.isArray(value)) {
        filters = {
          ...filters,
          [key]: { in: value },
        };
      } else {
        if (
          typeof value === 'string' &&
          (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')
        ) {
          filters = {
            ...filters,
            [key]: value === 'true',
          };
        }
      }
    }
  }
  return filters;
}

export function querySearchParam(query: { [key: string]: string }) {
  const filters = {};
  if (query && Object.keys(query).length > 0) {
    Object.keys(query)
      .filter((key) => key.startsWith('search_'))
      .forEach((key) => {
        const value = query[key];
        filters[key.replace('search_', '')] = value;
      });
  }
  return filters;
}
