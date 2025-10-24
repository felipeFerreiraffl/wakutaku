import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "node_modules/@tanstack/react-router-devtools/dist/esm/TanStackRouterDevtools";

const RootLayout = () => {
  <>
    <h1>Wakutaku</h1>
    <Outlet />
    <TanStackRouterDevtools />
  </>;
};

export const Route = createRootRoute({ component: RootLayout });
