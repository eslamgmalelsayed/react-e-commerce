import { createBrowserRouter } from "react-router-dom";
import Layout from "@/layout/Layout";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import NotFound from "@/pages/NotFound";

const routes = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default routes;
