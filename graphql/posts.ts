import { gql } from "@apollo/client";

export const CREATE_POST = gql`
    mutation createPost($body: String = "", $user_id: Int = 10) {
        insert_posts_one(object: {body: $body, user_id: $user_id}) {
            id
            post_id
        }
    }
`;

export const GET_POSTS = gql`
    query getPosts($_gte: Int = 0) {
        posts_connection(first: 10, order_by: {post_id: desc}, where: {post_id: {_gte: $_gte}}) {
            edges {
                node {
                    body
                    created_at
                    id
                    post_id
                    updated_at
                    user_id
                    user {
                        id
                        user_id
                        username
                    }
                }
            cursor
            }
        }
    }
`