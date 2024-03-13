import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthWrapper/AuthWrapper";
import UserSecrets from "../components/UserSecrets/UserSecrets";
import { Link } from "react-router-dom";
import EntryInfo from "../components/EntryInfo/EntryInfo";

export default function YourSecrets() {
  const [secrets, setSecrets] = useState([]);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const mode = import.meta.env.VITE_MODE;
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user.token) {
      fetch(`${mode == 'production' ? url : ""}/api/userSecrets`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.token,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setSecrets(data.userSecrets);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.firstChild.value = "";
    fetch(`${mode == 'production' ? url : ""}/api/secret`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + user.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: value }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          return setError(data.error);
        }
        return setSecrets((prev) => {
          return [
            {
              secret_text: data.newSecret.secret_text,
              secret_id: data.newSecret.secret_id,
              new: true,
            },
            ...prev,
          ];
        });
      });
  };

  return (
    <div className="your-secrets container py-5">
      <div className="create-secret">
        <div className="d-flex justify-content-between mb-2">
          <h2>Create Secret</h2>
          <button className="ml-1">
            <Link className="btn btn-lg btn-primary" to="/">
              Back to Home
            </Link>
          </button>
        </div>

        <div className="card p-4">
          <form onSubmit={handleSubmit}>
            <textarea
              type="input"
              name="text"
              className="form-control"
              onChange={handleChange}
              required={true}
            ></textarea>
            <button type="submit" className="btn-dark ml-auto btn-lg btn mt-2">
              Submit Secret
            </button>
            {error && (
              <div className="error">
                <span className="text-danger">{error}</span>
              </div>
            )}
          </form>
        </div>
        <div className="entry-info mt-2">
        <EntryInfo />
      </div>
      </div>
      <div className="mt-5">
        <h2 className="mb-3">Your secrets</h2>
        {secrets?.length > 0 ? (
          <UserSecrets
            secrets={secrets}
            auth={user.token}
            setSecrets={setSecrets}
          />
        ) : (
          <div className="border rounded empty-secrets d-flex justify-content-center align-items-center"><h3>You do not have any secrets. Add now.</h3></div>
        )}
      </div>
    </div>
  );
}
