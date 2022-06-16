import { makeVar } from "@apollo/client";

export const accessTokenState = makeVar<string | undefined>(undefined)
