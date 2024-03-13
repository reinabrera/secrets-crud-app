import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthWrapper/AuthWrapper";
import { useEffect } from "react";

export default function PrivateRoute({ children }) {
  const {user, setUser} = useAuth();

  useEffect(() => {
    setUser(prev => {
      return {...prev, token: localStorage.getItem('token')}
    });
  }, [localStorage.getItem('token')])

  return user.username ? children : <Navigate to="/login" />;
}

