import axios, { AxiosRequestConfig } from "axios";

const { PLATFORM_KEY } = process.env;

export function axGet(
  url: string,
  config?: AxiosRequestConfig<any>,
  session?: {
    storeHash: string;
    storeToken: string;
  }
) {
  return axios.get(url, {
    ...config,
    headers: {
      ...config?.headers,
      "arize-token": PLATFORM_KEY,
      ...(session
        ? {
            "store-hash": session.storeHash,
            "store-token": session.storeToken,
          }
        : {}),
    },
  });
}

export function axPost(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any>,
  session?: {
    storeHash: string;
    storeToken: string;
  }
) {
  return axios.post(url, data, {
    ...config,
    headers: {
      ...config?.headers,
      "arize-token": PLATFORM_KEY,
      ...(session
        ? {
            "store-hash": session.storeHash,
            "store-token": session.storeToken,
          }
        : {}),
    },
  });
}
