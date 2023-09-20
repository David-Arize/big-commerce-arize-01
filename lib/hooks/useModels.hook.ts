import axios from "axios";
import useSWR from "swr";
import { useSession } from "context/session";

export function useModels() {
  const { context } = useSession();
  const params = new URLSearchParams({ context }).toString();

  //   if (list?.length) {
  //     product = list.find((item) => item.id === pid);
  //   }

  // Conditionally fetch product if it doesn't exist in the list (e.g. deep linking)
  const { data: models, error: error } = useSWR(
    context ? [`/api/platform/models`, params] : null,
    async (url: string, query: string) => {
      const res = await axios.get(`${url}?${query}`);

      return res.data;
    }
  );

  return {
    models,
    isLoading: models ? false : !models && !error,
    error: error,
  };
}
