import prettier from 'prettier';

import { normalize as normalizeParams } from './normalize';

const getCodeAndParams = event => {
  if (event.httpMethod === 'POST') {
    return JSON.parse(event.body || '{}');
  }
  return event.queryStringParameters || {};
};

export const prettierHandler = (event, context, callback) => {
  if (event.source === 'serverless-plugin-warmup') {
    return callback(null, 'Keeping myself warm, ya dig');
  }
  try {
    const { code, ...rest } = getCodeAndParams(event);

    if (!code) {
      throw new Error('The query parameter `code` is required');
    }

    const formatted = prettier.format(decodeURIComponent(code), {
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
    callback(
      JSON.stringify({
        errorType: 'Error',
        httpStatus: 500,
        message: err.message
      })
    );
  }
};
