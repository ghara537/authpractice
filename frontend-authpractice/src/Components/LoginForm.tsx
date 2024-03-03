import { useState } from "react";

export default function LoginForm() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = () => {
        //check the username and password against the db
        setUsername("");
        setPassword("");
    }

    return (
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <div>
            <label>UserName</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    );
}