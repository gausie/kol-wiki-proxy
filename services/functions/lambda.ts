import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import fetch from "node-fetch";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = Object.fromEntries(Object.entries(event.headers || {})
    .filter(([k, v]) => !["host", "origin"].includes(k.toLowerCase()) && v !== undefined)
    .map(i => i as [string, string]));

  const requestParams = Object.entries(event.queryStringParameters || {})
    .reduce((acc, param) => [...acc, param.join("=")], [] as string[])
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
        'content-type': res.headers.get("content-type") || "text/plain",
      },
      body,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: (error as Error).name,
    };;
  }
};
