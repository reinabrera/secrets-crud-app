import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({token:localStorage.getItem("token") || "", username:""});
  const [loading, setLoading] = useState(true);
  const mode = import.meta.env.VITE_MODE;
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user.token) {
      fetch(`${mode == 'production' ? url : ""}/api/checkAuth`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.token,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (!data.auth) {
            localStorage.removeItem("token");
            setUser(prev => {
              return {...prev, token: "", username: ""}
            });
          } else {
            localStorage.setItem("token", user.token);
            setUser(prev => {
              return {...prev, token: user.token, username: data.username}
            });
          }
          setLoading(false);
        });
    } else {
      localStorage.removeItem("token");
      setUser(prev => {
        return {...prev, token: "", username: ""}
      });
      setLoading(false);
    }
  }, [user.token]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {loading ? (
        <div className="loader-wrapper">
          <span className="loader"></span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
