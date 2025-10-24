import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => {
  return (
    <div>
      {/* Considere um <Header /> aqui */}
      <main>
        <Outlet />
      </main>
      {/* Considere um <Footer /> aqui */}
      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({ component: RootLayout });
