import { useState, useEffect } from "react";
import Form from "../components/Form/Form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthWrapper/AuthWrapper";

export default function Login() {
  const [error, setError] = useState("");
  const { user, setUser } = useAuth();
  const navigateTo = useNavigate();
  const mode = import.meta.env.VITE_MODE;
  const url = import.meta.env.VITE_API_URL;

  const handleSubmit = (creds) => {
    fetch(`${mode == 'production' ? url : ""}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.auth) {
          return setError(data.error);
        }
        setUser(prev => {
          return {...prev, token: data.token}
        });
      });
  };

  useEffect(() => {
    if (user.token) {
      return navigateTo("/");
    }
  }, [user]);

  return (
    <div>
      <Form text="Login" handleSubmit={handleSubmit} error={error} />
    </div>
  );
}
