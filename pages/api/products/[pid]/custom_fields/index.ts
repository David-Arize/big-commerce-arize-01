import { NextApiRequest, NextApiResponse } from "next";
import { bigcommerceClient, getSession } from "../../../../../lib/auth";

export default async function products(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { pid },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash);

        const { data } = await bigcommerce.get(
          `/catalog/products/${pid}/custom-fields`
        );
        res.status(200).json(data);
      } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
        console.error(message);
      }
      break;
    case "PUT":
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
