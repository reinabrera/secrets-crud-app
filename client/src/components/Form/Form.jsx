import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Form({ text, handleSubmit, error }) {
  const [value, setValue] = useState({ username: "", password: "" });
  const navigateTo = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const onSubmitted = (e) => {
    e.preventDefault();
    return handleSubmit(value);
  };

  return (
    <div className="container mt-5">
      <h1>{text}</h1>
      <div className="row">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={onSubmitted}>
                <div className="form-group">
                  <label className="username" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="username"
                    className="form-control"
                    name="username"
                    onChange={handleChange}
                    required={true}
                  />
                </div>
                <div className="form-group">
                  <label className="password" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    onChange={handleChange}
                    required={true}
                  />
                </div>
                <button type="submit" className="btn btn-lg btn-dark">
                  {text}
                </button>
                <button className="ml-1">
                  <Link className="btn btn-lg btn-primary" to="/">Back to Home</Link>
                </button>
                {error && <div className="text-danger mt-2">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
