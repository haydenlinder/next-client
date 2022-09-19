import type { GetServerSideProps, NextPage } from "next";
import {
    GetUserByIdQuery, GetUserByIdQueryVariables,
} from "../../types/generated/graphql";
import { GET_USER_BY_ID } from "../../graphql/users";
import { serverClient } from "../api/apollo-client";
import { Button } from "../../components/Button";
import { getCookieParser } from "next/dist/server/api-utils";
import { SessionData } from "../api/session/types";
import jwt from 'jsonwebtoken'
import { User } from "../../types/entities";

type Props = { user: User }

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const cookies = getCookieParser(req.headers)()
    const accessToken = cookies.access_token
    
    let session: SessionData | undefined;
    try {
        session = jwt.verify(accessToken, process.env.ACCESS_SECRET!) as SessionData;
    } catch (e) {
        console.error("auth error: ", e)
    }
    const user_id = session?.user_id;
    
    let user: User;
    if (accessToken) {
        const { data } = await serverClient.query<GetUserByIdQuery, GetUserByIdQueryVariables>({
            query: GET_USER_BY_ID,
            variables: {
                _eq: user_id
            },
            context: { headers: { authorization: `Bearer ${accessToken}` } }
        });
        user = data.users_connection.edges[0].node
    }

    return ({
        props: {
            user
        }
    })
}


const User: NextPage<Props> = ({ user }) => {

    if (!user) return <div>User Not Found</div>

    return (
        <section className="pt-36 container flex flex-col items-center">
            <div className="bg-white rounded p-6">
                <h1>username: {user.username}</h1>
                <div>email: {user.email}</div>
                <div>joined: {user.created_at}</div>
                <Button className="mt-6">Edit</Button>
                <Button className="mt-36" secondary>Delete Acount</Button>
            </div>

        </section>
    );
};

export default User;
