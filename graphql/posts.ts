import { gql } from "@apollo/client";

export const CREATE_POST = gql`
    mutation createPost($body: String = "", $description: String = "", $title: String = "", $user_id: Int = 10, $photo_url: String = "", $price: numeric = 0) {
        insert_posts_one(object: {body: $body, user_id: $user_id, photo_url: $photo_url, title: $title, description: $description, price: $price}) {
            id
        }
    }
`;

export const GET_POSTS = gql`
    query getPosts($_gte: Int = 0) {
        posts_connection(first: 10, order_by: {post_id: desc}, where: {post_id: {_gte: $_gte}}) {
            edges {
                node {
                    photo_url
                    title
                    description
                    price
                    created_at
                    id
                    body
                    post_id
                    updated_at
                }
            cursor
            }
        }
    }
`;

export const DELETE_POST = gql`
    mutation deletePost($post_id: Int = 1) {
        delete_posts_by_pk(post_id: $post_id) {
            id
        }
    }
`;

export const UPDATE_POST = gql`
    mutation updatePost($post_id: Int = 10, $body: String = "", $description: String = "", $photo_url: String = "", $price: numeric = 0, $title: String = "") {
        update_posts_by_pk(pk_columns: {post_id: $post_id}, _set: {body: $body, description: $description, photo_url: $photo_url, price: $price, title: $title}) {
            post_id
        }
    }
`;

export const GET_POST_BY_ID = gql`
    query getPostById($post_id: Int_comparison_exp = {_eq: 10}) {
        posts_connection(where: {post_id: $post_id}) {
            edges {
                node {
                    body
                    created_at
                    description
                    id
                    photo_url
                    post_id
                    price
                    title
                    updated_at
                }
            }
        }
    }
`;