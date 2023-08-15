import axios from "axios";
import { SessionProps } from "../types";
import { sendSlackMessage } from "./slack";

const { PLATFORM_URL, PLATFORM_KEY } = process.env;

export async function checkStore(session: SessionProps) {
  try {
    const storeAccessToken = session.access_token ?? session?.aud;
    const contextString = session?.context ?? session?.sub;
    const storeHash = contextString.split("/")[1] || "";

    await axios.post(
      `${PLATFORM_URL}/big-commerce/store/check-store`,
      {
        storeHash,
        storeOwnerEmail: session.owner?.email,
        storeAccessToken,
      },
      {
        headers: {
          "arize-token": PLATFORM_KEY,
        },
      }
    );
  } catch (error) {
    sendSlackMessage(error);
    console.error(error);
  }
}

export async function getStoreToken(storeHash: string): Promise<string> {
  try {
    const result = await axios.post(
      `${PLATFORM_URL}/big-commerce/store/get-store-token`,
      {
        storeHash,
      },
      {
        headers: {
          "arize-token": PLATFORM_KEY,
        },
      }
    );

    return result.data.token;
  } catch (error) {
    sendSlackMessage(error);
    console.error(error);
  }
}
