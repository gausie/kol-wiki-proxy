import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import fetch from "node-fetch";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { Host, host, Origin, origin, ...headers } = event.headers || {};

  const requestParams = Object.entries(event.queryStringParameters || {})
    .reduce((acc, param) => [...acc, param.join("=")], [])
    .join('&');

  const url = `https://kol.coldfront.net/thekolwiki/api.php?${requestParams}`;

  try {
    const res = await fetch(url, { headers });
    const body = await res.text();
    return {
      statusCode: res.status,
      headers: {
        // Required for CORS support to work
        'Access-Control-Allow-Origin': '*',
        // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Credentials': true,
        'content-type': res.headers['content-type'],
      },
      body,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.name,
    };;
  }
};
