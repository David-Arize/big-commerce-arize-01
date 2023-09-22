import { NextApiRequest, NextApiResponse } from "next";
import { sendSlackMessage } from "@lib/slack";

export default async function platformTiokje(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { PLATFORM_URL } = process.env;
    const params = new URLSearchParams(
      req.query as unknown as URLSearchParams
    ).toString();

    res.redirect(
      `${PLATFORM_URL}/third-party-providers/big-commerce/store/get-platform-url?${params}`
    );
  } catch (error) {
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
    console.error(message);
    sendSlackMessage(error);
  }
}
