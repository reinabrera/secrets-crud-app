import { useAuth } from "../AuthWrapper/AuthWrapper";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
import Logout from "../Logout/Logout";
import EntryInfo from "../EntryInfo/EntryInfo";

export default function Homepage() {
  const { user } = useAuth();
  return (
    <div className="jumbotron centered">
      <div className="container">
        <i className="fas fa-key fa-6x"></i>
        <h1 className="display-3">Secrets</h1>
        <p className="lead">Don't keep your secrets, share them anonymously!</p>
        <hr />
      </div>
      {user.username ? (
        <>
          <div><Button customClass={"mb-1"}>
            <Link
              to="/secrets"
              className="text-decoration-none btn-lg text-body btn-light btn"
              role="button"
            >
              View Secrets
            </Link>
          </Button>
          <Button customClass={"ml-1 mb-1"}>
            <Link
              to="/your-secrets"
              className="btn btn-lg btn-primary text-decoration-none text-light"
              role="button"
            >
              View your secrets
            </Link>
          </Button></div>
          <div className="mb-1">
            <Logout />
          </div>
          
        </>
      ) : (
        <>
          <Button>
            <Link
              to="/register"
              className="text-decoration-none btn-lg text-body btn-light btn"
              role="button"
            >
              Register
            </Link>
          </Button>
          <Button customClass={"ml-1"}>
            <Link
              to="/login"
              className="btn btn-dark btn-lg text-decoration-none text-light"
              role="button"
            >
              Login
            </Link>
          </Button>
        </>
      )}
      <div className="entry-info mt-5">
        <EntryInfo />
      </div>
    </div>
  );
}
