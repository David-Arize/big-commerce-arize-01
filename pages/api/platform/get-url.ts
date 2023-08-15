import { NextApiRequest, NextApiResponse } from "next";

export default async function platformTiokje(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { PLATFORM_URL } = process.env;
    const params = new URLSearchParams(
      req.query as unknown as URLSearchParams
    ).toString();

    res.redirect(`${PLATFORM_URL}/big-commerce/get-platform-url?${params}`);
  } catch (error) {
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
    console.error(message);
  }
}
