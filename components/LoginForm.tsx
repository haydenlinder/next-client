
import Router from "next/router";
import React, { FormEventHandler, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { RefreshResponse } from "../pages/api/session/refresh";
import { SignupResponse } from "../pages/api/session/signup";
import { useStore } from "../state/store";

type Props = {
    isNewUser?: boolean
    heading?: (isNewUser: boolean) => JSX.Element | null
    onSuccess?: () => void
}

const LoginForm = ({ isNewUser: isNew, onSuccess = () => null, heading = () => null}: Props) => {
    const { setSession, setAccessToken } = useStore()
    const [isNewUser, setIsNewUser] = useState<boolean>(isNew || true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<undefined | string>(undefined);
    const [loading, setLoading] = useState(false);

    const signup = async () => {
        try {
            setError(undefined)
            const response = await fetch("/api/session/signup", { method: "POST", body: JSON.stringify({ email, password }) });
            const data: SignupResponse = await response.json();
            if (response.status !== 200) setError(data.errors)
            return data
        } catch (e) {
            setError("Unexpected error")
            console.error("SIGNUP ERROR: ", e)
        }
    };

    const login = async () => {
        setError(undefined)
        const response = await fetch("/api/session/login", { method: "POST", body: JSON.stringify({ email, password }) });
        const data: RefreshResponse = await response.json();

        if (response.status !== 200) throw setError(data.errors);
        setSession(data.data?.session)
        setAccessToken(data.data?.access_token)
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setLoading(true);
        await (
            isNewUser ? 
            signup().then(r => r && setError(r.data?.message || r.errors)) : 
            login().then(() => !error && onSuccess())
        ).catch(e => console.log(e))
        setLoading(false)
    }

    const handleSwitch = () => {
        setError(undefined)
        setIsNewUser(bool => !bool)
    }

    return (
        <div className="w-96">
            {heading(isNewUser)}
            {isNewUser && <p className="text-center text-2xl">Delete your account any time</p>}
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-96">
                <p className="text-center m-4 font-bold text-red-600">{error}</p>
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

                    {loading ? "loading" : isNewUser ? "Get Started" : "Log In"}
                </Button>
            </form>
            <Button
                secondary
                onClick={handleSwitch}
            >
                Switch to {isNewUser ? `Login` : `Signup`}
            </Button>
        </div>
    );
};

export default LoginForm;
