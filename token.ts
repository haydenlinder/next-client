import { makeVar } from "@apollo/client";

export const accessTokenState = makeVar<string | undefined>(undefined)
export const currentUserIdState = makeVar<number | undefined>(undefined)
