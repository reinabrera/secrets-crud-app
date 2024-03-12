import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logout from "../components/Logout/Logout";

export default function Secrets() {
  const [ secret, setSecret] = useState("");
  const token = localStorage.getItem("token");


  const fetchSecret = () => {
    fetch("/api/secrets", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.auth) {
          setSecret(data.secret);
        }
      })
  }

  useEffect(() => {
    fetchSecret();
  }, [token]);


  const handleClick = () => {
    fetchSecret();
  }

  return (
    <div className="jumbotron text-center">
      <div className="container">
        <i className="fas fa-key fa-6x"></i>
        <h1 className="display-3">You've Discovered My Secret!</h1>
        <p className="secret-text">{secret}</p>
        <hr />
        <button onClick={handleClick} className="btn btn-dark btn-lg mr-1">Random secret</button>
        <Link className="btn btn-primary btn-lg mr-1" to="/" role="button">
          Back to home
        </Link>
        <Logout />
      </div>
    </div>
  );
}
