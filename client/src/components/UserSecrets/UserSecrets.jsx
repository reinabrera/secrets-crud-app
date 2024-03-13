import { useState } from "react";
import UserSecretsItem from "./UserSecretsItem";

export default function UserSecrets({ secrets, auth, setSecrets }) {
  const [error, setError] = useState("");
  const mode = import.meta.env.VITE_MODE;
  const url = import.meta.env.VITE_API_URL;

  const handleDelete = (id) => {
    fetch(`${mode == 'production' ? url : ""}/api/secret/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          return setError(data.error);
        } else {
          return setSecrets(secrets.filter((item) => item.secret_id !== id));
        }
      });
  };

  const handleUpdate = (id, text) => {
    fetch(`${mode == 'production' ? url : ""}/api/secret/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ secret_id: id, secret_text: text }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          return setError(data.error)
        } 
        return setSecrets(prev => {
          return secrets.map((item) => {
            if (item.secret_id === data.updatedSecret.secret_id) {
              return {...item, secret_text: data.updatedSecret.secret_text}
            }
            return item;
          });
        })
      });
  };
  return (
    <div>
      <ul>
        {secrets.map((item) => {
          return (
            <UserSecretsItem
              key={item.secret_id}
              data={item}
              handleDelete={handleDelete}
              error={error}
              handleUpdate={handleUpdate}
            />
          );
        })}
      </ul>
    </div>
  );
}
