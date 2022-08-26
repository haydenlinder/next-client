export type TokenPayload = {
    user_id: number;
    is_admin: boolean;
    iat: number,
    exp: number,
}