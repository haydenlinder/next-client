import type { GetServerSideProps, NextPage } from "next";
import {
    GetUserByIdQuery, GetUserByIdQueryVariables,
} from "../../types/generated/graphql";
import { GET_USER_BY_ID } from "../../graphql/users";
import { useRouter } from "next/router";
import { serverClient } from "../api/apollo-client";
import { refresh } from "../api/next-client";

type Props = { user: GetUserByIdQuery['users_connection']['edges'][0]['node'] }

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const response = await refresh(req?.headers.cookie);
    const accessToken = response?.data?.access_token;
    const user_id = response?.data?.user_id;

    let user: GetUserByIdQuery['users_connection']['edges'][0]['node'] | undefined

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
    const { query } = useRouter()

    if (!user) return <div>User Not Found</div>

    return (
        <section>
            <h1>username: {user.username}</h1>
            <div>email: {user.email}</div>
            <div>joined: {user.created_at}</div>
        </section>
    );
};

export default User;
