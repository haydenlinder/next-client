module.exports = {
    schema: [
        {
            'http://localhost:8080/v1beta1/relay': {
                headers: {
                    "x-hasura-admin-secret": "1234",
                },
            },
        },
    ],
    documents: ['./graphql/**/*.ts', './graphql/**/*.ts'],
    overwrite: true,
    generates: {
        './types/generated/graphql.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
            config: {
                skipTypename: false,
                withHooks: false,
                withHOC: false,
                withComponent: false,
            },
        },
    },
};