import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Login, Secrets, YourSecrets } from "./pages/Pages";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { AuthProvider } from "./components/AuthWrapper/AuthWrapper";
import "./bootstrap-social.css";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/secrets"
              element={
                <PrivateRoute>
                  <Secrets />
                </PrivateRoute>
              }
            />
            <Route
              path="/your-secrets"
              element={
                <PrivateRoute>
                  <YourSecrets />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
