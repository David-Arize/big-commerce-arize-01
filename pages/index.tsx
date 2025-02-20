// import { useEffect, useState } from "react";
// import { useSession } from "context/session";

import axios from 'axios';
import { useState } from 'react';
import useSWR from 'swr';
import ErrorMessage from '@components/shared/error';
import Loading from '@components/shared/loading';
// import { getSession } from "@lib/auth";
import { useSession } from 'context/session';

const Index = () => {
  const context = useSession()?.context;
  const params = new URLSearchParams({ context }).toString();
  const [token, setToken] = useState('');

  const { error } = useSWR(
    context ? `/api/platform/get-token?${params}` : null,

    async (url: string) => {
      if (token) return;
      const res = await axios.get(`${url}`);

      setToken(res.data?.token);
    }
  );

  if (!token && !error) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <iframe
      src={`/api/platform/get-url?token=${token}`}
      style={{
        display: 'block',
        border: 'solid 1px #9E9E9E',
        borderRadius: '20px',
        boxShadow: '0px 0px 5px 5px #0000001a',
        overflow: 'hidden',
        height: '100%',
        width: ' 100%',
        minHeight: '80vh',
      }}
    />
  );
};

export default Index;
