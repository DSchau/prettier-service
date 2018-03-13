import prettier from 'prettier';

const normalizeParams = params =>
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

const getCodeAndParams = event => {
  if (event.httpMethod === 'POST') {
    return JSON.parse(event.body);
  }
  return event.queryStringParameters || {};
};

export const prettierHandler = (event, context, callback) => {
  try {
    const { code, ...rest } = getCodeAndParams(event);

    if (!code) {
      throw new Error('The query parameter `code` is required');
    }

    const formatted = prettier.format(code, {
      semi: true,
      singleQuote: true,
      ...normalizeParams(rest)
    });
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        code: formatted
      })
    };

    callback(null, response);
  } catch (err) {
    callback(err);
  }
};
