import { useState } from "react";
import "./App.css";
import Login from "./components/login";
import Admin from "./components/Admin";
import User from "./components/User";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import Navbar from "./components/Navbar";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [page, setPage] = useState("home");
  const [score, setScore] = useState(0);
  const [selectedTest, setSelectedTest] = useState(null);

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setRole(null);
    setPage("home");
  };

  if (!role) return <Login setRole={setRole} />;

  return (
    <>
      <Navbar logout={logout} />

      {role === "admin" && <Admin />}
      {role === "user" && page === "home" && (
        <User 
          start={() => setPage("quiz")} 
          setSelectedTest={setSelectedTest}
        />
      )}
      {page === "quiz" && (
        <Quiz 
          finish={(s) => { setScore(s); setPage("result"); }}
          testTitle={selectedTest?.title}
        />
      )}
      {page === "result" && (
        <Result 
          score={score} 
          testTitle={selectedTest?.title}
          selectedTest={selectedTest}
          goHome={() => setPage("home")}
        />
      )}
    </>
  );
}

export default App;
