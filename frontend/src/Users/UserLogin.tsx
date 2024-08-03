import React, { FormEvent, useState } from "react";
import { User } from "../Security/User";
import { userModel } from "../Security/UserModel";
import { PrimaryButton } from "../components/PrimaryButton";
import { Card } from "../components/Card";
import styled from "styled-components";
import { AlertDanger } from "../components/AlertDanger";

export const Input = styled.input`
    line-height: 1.25rem;
    height: calc(3.5rem + 2px);
    width: 100%;

    &::placeholder {
        //color: transparent;
    }
`;

export function UserLogin() {
    const [isLoginError, setIsLoginError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();

        setIsLoginError(false);
        try {
            const result = await userModel().authenticate(new User(email, password));
            setIsLoginError(!result);
        } catch (err) {
            console.error("An unexpected error occurred logging in.", err);
            setIsLoginError(true);
        }
    }

    function LoginError() {
        return isLoginError ? <AlertDanger>There was an error logging in!</AlertDanger> : null;
    }

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <div>
                    <Input
                        id="email"
                        className="form-control"
                        type="text"
                        placeholder="E-mail"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div>
                    <Input
                        id="password"
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <p>
                    <PrimaryButton type="submit">Login</PrimaryButton>
                </p>
                <LoginError />
            </form>
        </Card>
    );
}
