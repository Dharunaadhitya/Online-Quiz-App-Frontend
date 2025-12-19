import { useState } from "react";
import { userAPI } from "../services/api";

function Login({ setRole }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!u || !p) return alert("Please fill all fields");
    
    setLoading(true);
    try {
      const response = await userAPI.login({ username: u, password: p });
      
      if (response.message) {
        alert(response.message);
        return;
      }

      localStorage.setItem("role", response.role);
      localStorage.setItem("username", response.username);
      localStorage.setItem("userId", response._id);
      setRole(response.role);
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    if (!u || !p) return alert("Please fill all fields");
    
    setLoading(true);
    try {
      const response = await userAPI.register({ username: u, password: p, role: "user" });
      
      if (response.message) {
        alert(response.message);
        return;
      }

      localStorage.setItem("role", response.role);
      localStorage.setItem("username", response.username);
      localStorage.setItem("userId", response._id);
      setRole(response.role);
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{isRegister ? "Register New User" : "Quiz App Login"}</h2>
        <div className="login-form">
          <input 
            className="input-field" 
            placeholder="Username" 
            value={u}
            onChange={e => setU(e.target.value)} 
          />
          <input 
            className="input-field" 
            type="password" 
            placeholder="Password" 
            value={p}
            onChange={e => setP(e.target.value)} 
          />
          {isRegister ? (
            <>
              <button className="btn btn-success" onClick={register} disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
              <button className="btn btn-secondary" onClick={() => setIsRegister(false)}>Back to Login</button>
            </>
          ) : (
            <>
              <button className="btn btn-black" onClick={login} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <button className="btn btn-primary" onClick={() => setIsRegister(true)}>Register as User</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
