import type { ADT } from 'ts-adt';
import type { z } from 'zod';
import { ZodError } from 'zod';

export type APIError = ADT<{
  DECODE_ERROR: {
    message: string;
    error?: ZodError;
  };
  UNKNOWN_ERROR: {
    message: string;
    error?: Error;
  };
  FETCH_ERROR: {
    message: string;
    error?: TypeError | Response | unknown;
    status?: number;
  };
  AUTH_ERROR: {
    message: string;
    error?: unknown;
  };
}>;

export interface FetchConfig extends RequestInit {
  url: string;
  params?: Record<string, string | number>;
}

type Fetcher = <TSchema extends z.ZodTypeAny>(
  config: FetchConfig,
  schema: TSchema,
) => Promise<z.infer<typeof schema>>;

export const fetcher: Fetcher = (config, schema) => {
  const { url, params, ...init } = config;

  // Convert params to string values for URLSearchParams
  const stringParams = params
    ? Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)]),
      )
    : null;

  // Build URL with query parameters
  const queryParams = stringParams ? new URLSearchParams(stringParams) : null;
  const urlWithParams = queryParams ? `${url}?${queryParams.toString()}` : url;

  return new Promise((resolve, reject) => {
    fetch(urlWithParams, init)
      .then(async (response) => {
        if (!response.ok) {
          reject({
            _type: 'FETCH_ERROR',
            message: await response.text(),
            status: response.status,
            error: response,
          });
          return;
        }

        const data = await response.json();
        const validated = schema.parse(data);
        resolve(validated);
      })
      .catch((err) => {
        if (err instanceof ZodError) {
          reject({
            _type: 'DECODE_ERROR',
            message: JSON.stringify(err.message),
            error: err,
          });
          return;
        }
        if (err instanceof TypeError) {
          reject({
            _type: 'FETCH_ERROR',
            message: err.message,
            error: err,
          });
          return;
        }
        if (err._type === 'FETCH_ERROR') {
          reject(err);
          return;
        }
        reject({
          _type: 'UNKNOWN_ERROR',
          message: 'Unknown error',
          error: err,
        });
      });
  });
};
