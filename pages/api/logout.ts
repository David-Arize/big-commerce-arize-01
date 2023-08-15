import { NextApiRequest, NextApiResponse } from "next";

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const session = await getSession(req);

    res.status(200).end();
  } catch (error) {
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
    console.error(message);
  }
}
