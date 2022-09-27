import type { NextPage } from "next";
import {
    DeleteUserMutation,
    DeleteUserMutationVariables,
    GetUserByIdQuery, GetUserByIdQueryVariables,
} from "../../types/generated/graphql";
import { DELETE_USER, GET_USER_BY_ID } from "../../graphql/users";
import { Button } from "../../components/Button";
import { useStore } from "../../state/store";
import { useMutation, useQuery } from "@apollo/client";
import { logout } from "../api/session_functions";

const User: NextPage = () => {
    const { session, setSession, setAccessToken } = useStore()

    const { data } = useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(
        GET_USER_BY_ID,
        {
            variables: {
                _eq: session?.user_id
            },
        }
    );
    
    const [deleteUser, { loading: deleting }] = useMutation<DeleteUserMutation, DeleteUserMutationVariables>(
        DELETE_USER,
        {
            variables: {
                user_id: session?.user_id
            }
        }
    )

    const handleDelete = async () => {
        await deleteUser();
        logout({ setAccessToken, setSession })
    }

    const user = data?.users_connection.edges[0]?.node

    if (!user) return <div>User Not Found</div>

    return (
        <section className="pt-36 container flex flex-col items-center">
            <div className="bg-white rounded p-6">
                <h1>username: {user.username}</h1>
                <div>email: {user.email}</div>
                <div>joined: {user.created_at}</div>
                <Button className="mt-6">Edit</Button>
                <Button onClick={handleDelete} className="mt-36" secondary>{deleting ? "Deleting..." : "Delete Acount"}</Button>
            </div>
        </section>
    );
};

export default User;
