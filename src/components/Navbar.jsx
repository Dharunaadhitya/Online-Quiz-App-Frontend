function Navbar({ logout }) {
  const role = localStorage.getItem("role");
  
  return (
    <div className="navbar">
      <h3>Quiz App</h3>
      <div className="navbar-right">
        <div className="role-badge">{role}</div>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
