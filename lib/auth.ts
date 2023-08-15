import * as jwt from "jsonwebtoken";
import { NextApiRequest } from "next";
import * as BigCommerce from "node-bigcommerce";
import { ApiConfig, QueryParams, SessionProps } from "../types";
import { checkStore, getStoreToken } from "./platform";

const { API_URL, AUTH_CALLBACK, CLIENT_ID, CLIENT_SECRET, JWT_KEY, LOGIN_URL } =
  process.env;

// Used for internal configuration; 3rd party apps may remove
const apiConfig: ApiConfig = {};
if (API_URL && LOGIN_URL) {
  apiConfig.apiUrl = API_URL;
  apiConfig.loginUrl = LOGIN_URL;
}

// Create BigCommerce instance
// https://github.com/bigcommerce/node-bigcommerce/
const bigcommerce = new BigCommerce({
  logLevel: "info",
  clientId: CLIENT_ID,
  secret: CLIENT_SECRET,
  callback: AUTH_CALLBACK,
  responseType: "json",
  headers: { "Accept-Encoding": "*" },
  apiVersion: "v3",
  ...apiConfig,
});

const bigcommerceSigned = new BigCommerce({
  secret: CLIENT_SECRET,
  responseType: "json",
});

export function bigcommerceClient(
  accessToken: string,
  storeHash: string,
  apiVersion = "v3"
) {
  return new BigCommerce({
    clientId: CLIENT_ID,
    accessToken,
    storeHash,
    responseType: "json",
    apiVersion,
    ...apiConfig,
  });
}

// Authorizes app on install
export function getBCAuth(query: QueryParams) {
  return bigcommerce.authorize(query);
}
// Verifies app on load/ uninstall
export function getBCVerify({ signed_payload_jwt }: QueryParams) {
  return bigcommerceSigned.verifyJWT(signed_payload_jwt);
}

export async function setSession(session: SessionProps) {
  await checkStore(session);
}

export async function getSession({ query: { context = "" } }: NextApiRequest) {
  if (typeof context !== "string") return;
  const { context: storeHash, user } = decodePayload(context);
  const accessToken = await getStoreToken(storeHash);

  return { accessToken, storeHash, user };
}

// JWT functions to sign/ verify 'context' query param from /api/auth||load
export function encodePayload({ user, owner, ...session }: SessionProps) {
  const contextString = session?.context ?? session?.sub;
  const context = contextString.split("/")[1] || "";

  return jwt.sign({ context, user, owner }, JWT_KEY, { expiresIn: "24h" });
}
// Verifies JWT for getSession (product APIs)
export function decodePayload(encodedContext: string) {
  return jwt.verify(encodedContext, JWT_KEY);
}

// Removes store and storeUser on uninstall
export async function removeDataStore(session: SessionProps) {
  console.error(session);

  // Deactivate Store In Platform
}
