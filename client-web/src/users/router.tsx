import { Route } from "react-router-dom";
import { HomePage } from "./pages/Home";

export const userRoutes = [
  <Route key="home" path="/" element={<HomePage />} />,
];
