import { Route } from "react-router-dom";
import { LoginPage } from "./pages/login-page";

export const authRoutes = [
  <Route key="login" path="/login" element={<LoginPage />} />,
];
