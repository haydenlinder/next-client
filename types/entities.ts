import { GetPostsQuery, GetUserByIdQuery } from "./generated/graphql";

export type User = GetUserByIdQuery['users_connection']['edges'][0]['node'] | undefined

export type Post = GetPostsQuery['posts_connection']['edges'][0]['node'][];