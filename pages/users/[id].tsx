import type { NextPage } from "next";
import {
    GetUserByIdQuery, GetUserByIdQueryVariables,
} from "../../types/generated/graphql";
import { GET_USER_BY_ID } from "../../graphql/users";
import { Button } from "../../components/Button";
import { useStore } from "../../state/store";
import { useQuery } from "@apollo/client";

const User: NextPage = () => {
    const { session } = useStore()

    const { data } = useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(
        GET_USER_BY_ID,
        {
            variables: {
                _eq: session?.user_id
            },
        }
    );

    const user = data?.users_connection.edges[0].node

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
