// import { useEffect, useState } from "react";
// import { useSession } from "context/session";

import axios from "axios";
import useSWR from "swr";
import ErrorMessage from "@components/error";
import Loading from "@components/loading";
import { useSession } from "context/session";


const Index = () => {

    const context = useSession()?.context;
    const params = new URLSearchParams({ context }).toString();


    const { data, error } = useSWR(
        context ? `/api/platform/get-token?${params}` : null,

        async (url: string) => {
            const res = await axios.get(`${url}`);

            return res.data;
        }
    );



    if (!data && !error) return <Loading />;
    if (error) return <ErrorMessage error={error} />;



    return (



        <iframe src={`/api/platform/get-url?token=${data?.token}`} style={{
            display: 'block',
            border: 'solid 1px #9E9E9E',
            borderRadius: '20px',
            overflow: 'hidden',
            height: '100%',
            width: ' 100%',
            minHeight: '80vh'
        }}

        />

    );
};





export default Index;
