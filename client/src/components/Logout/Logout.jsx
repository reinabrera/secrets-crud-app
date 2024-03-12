import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthWrapper/AuthWrapper";
export default function Logout() {
  const navigateTo = useNavigate();
  const { setUser } = useAuth();
  const handleClick = () => {
    setUser({token: "", user: ""});
  };

  return (
    <button onClick={handleClick} className="btn btn-lg btn-dark btn-secondary">
      Log Out
    </button>
  );
}
