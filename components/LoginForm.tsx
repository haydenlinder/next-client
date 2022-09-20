
import Router from "next/router";
import React, { FormEventHandler, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { RefreshResponse } from "../pages/api/session/refresh";

type Props = {
    isNewUser?: boolean
    heading?: (isNewUser: boolean) => JSX.Element | null
    onSuccess?: () => void
}

const LoginForm = ({ isNewUser: isNew, onSuccess = () => null, heading = () => null}: Props) => {
    const [isNewUser, setIsNewUser] = useState(isNew || false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<undefined | string>(undefined);

    const signup = async () => {
        try {
            setError(undefined)
            const response = await fetch("/api/session/signup", { method: "POST", body: JSON.stringify({ email, password }) });
            const data = await response.json();
            if (response.status !== 200) return setError(data.errors)
        } catch (e) {
            console.error("SIGNUP ERROR: ", e)
        }
    };

    const login = async () => {
        try {
            setError(undefined)
            const response = await fetch("/api/session/login", { method: "POST", body: JSON.stringify({ email, password }) });
            const data: RefreshResponse = await response.json();

            if (response.status !== 200) return setError(data.errors);

        } catch (e) {
            console.error("LOGIN ERROR: ", e)
        }
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        (
            isNewUser ? 
            signup() : 
            login()
        ).then(() => !error && onSuccess())
    }

    return (
        <div className="w-96">
            {heading(isNewUser)}
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
            <Button
                secondary
                onClick={() => setIsNewUser(bool => !bool)}
            >
                Switch to {isNewUser ? `Login` : `Signup`}
            </Button>
        </div>
    );
};

export default LoginForm;
