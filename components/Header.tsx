import { useQuery, useReactiveVar } from "@apollo/client"
import Link from "next/link"
import Router from "next/router";
import { GET_USER_BY_ID } from "../graphql/users";
import { accessTokenState, currentUserIdState } from "../token"
import { GetUserByIdQuery, GetUserByIdQueryVariables } from "../types/generated/graphql";

const logout = async () => {
    const response = await fetch('/api/session/logout', { method: 'POST' });
    await response.json();
    accessTokenState(undefined)
    currentUserIdState(undefined)
    Router.replace('/login')
}

export const Header = () => {
    const accessToken = useReactiveVar(accessTokenState);
    const currentUserId = useReactiveVar(currentUserIdState);

    const { data, error, loading } = useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GET_USER_BY_ID, { 
        variables: {
          _eq: currentUserId
        }
    });

    if (error) {
        console.log({error})
    }

    if (loading) return <div>Loading</div>

    const user = data?.users_connection.edges[0]?.node

    return (
        <header className="p-4 bg-black text-white mb-3 absolute w-full top-0">
            <nav className="container">
                <Link passHref href="/">
                    <a className="mr-2">
                        Home
                    </a>
                </Link>
                {Boolean(accessToken) && <button className="mr-2" onClick={e => logout()}>Logout</button>}
                {Boolean(accessToken) && 
                    <Link passHref href={`/users/${user?.user_id}`}>
                    <a className="mr-2">
                        {user?.username || "Profile"}
                    </a>
                    </Link>
                }
            </nav>
        </header>
    )
}