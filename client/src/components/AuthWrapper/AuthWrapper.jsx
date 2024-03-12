import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({token:localStorage.getItem("token") || "", username:""});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.token) {
      fetch("api/checkAuth", {
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
              return {...prev, token: ""}
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
