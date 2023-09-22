import { NextApiRequest, NextApiResponse } from "next";
import { bigcommerceClient, getSession } from "../../../../lib/auth";

export default async function productImages(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    body,
    query: { pid },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const { accessToken, storeHash } = await getSession(req);
        // const bigcommerce = bigcommerceClient(accessToken, storeHash);

        // const { data } = await bigcommerce.get(`/catalog/products/${pid}`);
        // res.status(200).json(data);

        const url = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products/${pid}/images`;

        const options = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Auth-Token": accessToken,
          },
        };

        const result = await fetch(url, options);

        res.status(200).json(result);
      } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
        console.error(message);
      }
      break;
    case "PUT":
      try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash);

        const { data } = await bigcommerce.put(
          `/catalog/products/${pid}`,
          body
        );
        res.status(200).json(data);
      } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
        console.error(message);
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
