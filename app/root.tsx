import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import Layout from "./components/layout/Layout";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
