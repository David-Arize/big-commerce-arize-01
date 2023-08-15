import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@lib/auth";

export default async function platformTiokje(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { PLATFORM_URL } = process.env;
    const session = await getSession(req);

    const { data } = await axios.post(
      `${PLATFORM_URL}/big-commerce/generate-token`,
      {
        storeHash: session.storeHash,
        storeAccessToken: session.accessToken,
      },
      {
        headers: {
          "arize-token": "arize-bc-xkey-x128Re5758321-cus365",
        },
      }
    );
    res.status(200).json(data);
  } catch (error) {
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
    console.error(message);
  }
}
