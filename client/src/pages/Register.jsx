import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../components/Form/Form";
import { useAuth } from "../components/AuthWrapper/AuthWrapper";

export default function Register() {
  const [ error, setError ] = useState("");
  const { user } = useAuth();
  const navigateTo = useNavigate();
  const handleSubmit = (creds) => {
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    })
      .then((response) => {
        if (response.status === 200) {
          navigateTo("/login");
        }
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
        }
      });
  }

  useEffect(() => {
    if (user.token) {
      return navigateTo("/");
    }
  }, [user]);

  return (
    <div>
      <Form
        text="Register"
        handleSubmit={handleSubmit}
        error={error}
      />
    </div>
  );
}
