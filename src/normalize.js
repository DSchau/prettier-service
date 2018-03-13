export const normalize = params =>
  Object.keys(params).reduce((normalized, key) => {
    let value = params[key];
    const mutations = ['true', 'false', value => /^\d+$/.test(value)];

    const shouldMutate = mutations.some(mutation => {
      if (typeof mutation === 'function') {
        return mutation(value);
      }
      return mutation === value;
    });

    if (shouldMutate) {
      value = JSON.parse(value);
    }

    normalized[key] = value;
    return normalized;
  }, {});
