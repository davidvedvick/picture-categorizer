import {FormEvent, useState} from "react";
import {instance as auth} from "../Security/AuthorizationService";
import {User} from "../Security/User";

export interface UserLoginProperties {
    onLoggedIn: () => void;
}

export function UserLogin({ onLoggedIn }: UserLoginProperties) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();

        const result = await auth().authenticate(new User(email, password));
        if (result)
            onLoggedIn();
    }

    return (
        <div className="col-sm-12">
            <div className="card card-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input id="email" className="form-control" type="text" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} value={email}/>
                        <label htmlFor="email">E-mail</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input id="password" className="form-control" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                        <label htmlFor="password">Password</label>
                    </div>
                    <p><button type="submit" className="btn btn-primary mb-3">Login</button></p>
                </form>
            </div>
        </div>
    );
}