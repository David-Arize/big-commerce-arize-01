import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@lib/auth";
import { sendSlackMessage } from "@lib/slack";

export default async function platformTiokje(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { PLATFORM_URL, PLATFORM_KEY } = process.env;
    const session = await getSession(req);

    const { data } = await axios.post(
      `${PLATFORM_URL}/third-party-providers/big-commerce/store/generate-token`,
      {
        storeHash: session.storeHash,
        storeAccessToken: session.accessToken,
      },
      {
        headers: {
          "arize-token": PLATFORM_KEY,
        },
      }
    );
    res.status(200).json(data);
  } catch (error) {
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
    console.error(message);
    sendSlackMessage(error);
  }
}
