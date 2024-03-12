import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthWrapper/AuthWrapper";

export default function PrivateRoute({ children }) {
  const {user} = useAuth();

  return user.username ? children : <Navigate to="/login" />;
}

