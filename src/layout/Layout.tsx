import Menus from "@/components/custom/Menus";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Outlet />
      <Menus />
    </div>
  );
};

export default Layout;
