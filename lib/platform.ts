import axios from "axios";
import { SessionProps } from "types/auth";
import { sendSlackMessage } from "./slack";

const { PLATFORM_URL, PLATFORM_KEY } = process.env;

export async function checkStore(session: SessionProps) {
  try {
    const storeAccessToken = session.access_token;
    const contextString = session?.context ?? session?.sub;
    const storeHash = contextString.split("/")[1] || "";

    console.log(session);

    let storeName = "";
    if (storeAccessToken)
      try {
        const { data: storeObject } = await axios.get(
          `https://api.bigcommerce.com/stores/${storeHash}/v2/store`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-Auth-Token": storeAccessToken,
            },
          }
        );
        storeName = storeObject.name;
      } catch (error) {
        console.error(error);
      }

    await axios.post(
      `${PLATFORM_URL}/third-party-providers/big-commerce/store/check-store`,
      {
        storeHash,
        storeOwnerEmail: session.owner?.email || session.user?.email,
        storeAccessToken,
        storeName,
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
export async function deactivateStore(session: SessionProps) {
  try {
    const storeAccessToken = session.access_token;
    const contextString = session?.context ?? session?.sub;
    const storeHash = contextString.split("/")[1] || "";
    await axios.post(
      `${PLATFORM_URL}/third-party-providers/big-commerce/store/deactivate-store`,
      {
        storeHash,
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
      `${PLATFORM_URL}/third-party-providers/big-commerce/store/get-store-token`,
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
