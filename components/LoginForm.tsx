
import type { NextPage } from "next";
import Router from "next/router";
import React, { FormEventHandler, useState } from "react";
import { Button } from "../components/Button";
import { H1 } from "../components/H1";
import { Input } from "../components/Input";
import { RefreshResponse } from "../pages/api/session/refresh";

type Props = {
    isNewUser?: boolean
}

const LoginForm = ({ isNewUser }: Props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<undefined | string>(undefined);

    const signup = async () => {
        try {
            const response = await fetch("/api/session/signup", { method: "POST", body: JSON.stringify({ email, password }) });
            const data = await response.json();
            if (response.status !== 200) return setError(data.errors)
        } catch (e) {
            console.error("SIGNUP ERROR: ", e)
        }
    };

    const login = async () => {
        try {
            const response = await fetch("/api/session/login", { method: "POST", body: JSON.stringify({ email, password }) });
            const data: RefreshResponse = await response.json();

            if (response.status !== 200) return setError(data.errors);

        } catch (e) {
            console.error("LOGIN ERROR: ", e)
        }
        Router.replace('/courses')
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        isNewUser ? signup() : login()
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-96">
            <p className="h-4 m-4 font-bold text-red-600">{error}</p>
            <Input
                required
                className="border border-solid rounded mb-4"
                placeholder="email"
                type="email"
                onChange={e => setEmail(e.target.value)}
            />
            <Input
                required
                className="border border-solid rounded"
                placeholder="password"
                type="password"
                onChange={e => setPassword(e.target.value)}
            />
            <Button className="my-4">
                {isNewUser ? "Get Started" : "Log In"}
            </Button>
        </form>
    );
};

export default LoginForm;
