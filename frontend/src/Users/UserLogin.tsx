import {FormEvent, useState} from "react";

export function UserLogin() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")

    async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();

        await fetch(
            "/api/users",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        userName: username,
                        password: password
                    }
                )
            });
    }

    return (
        <>
            <div className="sm container-fluid">
                <div className="sm">
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input id="user" className="form-control" type="text" placeholder="User Name" onChange={(e) => setUsername(e.target.value)} value={username}/>
                            <label htmlFor="user">User Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input id="password" className="form-control" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                            <label htmlFor="password">Password</label>
                        </div>
                        <p><button type="submit" className="btn btn-primary mb-3">Login</button></p>
                    </form>
                </div>
            </div>
        </>
    );
}