import { authRoutes } from "@auth/routes";
import { userRoutes } from "@users/router";
import { Routes } from "react-router-dom";

export function AppRoutes() {
  const routes = [authRoutes, userRoutes];
  return <Routes>{routes}</Routes>;
}
