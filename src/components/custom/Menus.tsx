import Home04Icon from "../icons/home";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocation } from "react-router-dom";

import Settings01Icon from "../icons/settings";
import Logo from "../../assets/nobg.png";
import { NavLink } from "react-router-dom";

import AddInEx from "./AddInEx";
const Menus = () => {
  let location = useLocation();

  return (
    <div className="fixed bottom-0 w-full p-8  z-50 ">
      <ul className="flex justify-around md:justify-center md:gap-[7rem] items-end relative">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            isActive ? "z-10 text-cs_yellow  px-6 " : "z-10  text-cs_gray px-6"
          }
        >
          <Home04Icon />
        </NavLink>
        {location.pathname !== "/profile" ? (
          <Popover>
            <PopoverTrigger asChild>
              <div className=" relative z-10 mb-4 outline outline-1 cursor-pointer hover:outline-yellow-300 rounded-full">
                <div className="w-[4rem] bg-black rounded-full p-4 h-full outline outline-[1px] outline-cs_border">
                  <img className=" " src={Logo} alt="logo" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-black mb-1">
              <AddInEx />
            </PopoverContent>
          </Popover>
        ) : (
          <div className="h-[4.7rem]"></div>
        )}

        <NavLink
          to={"/profile"}
          className={({ isActive }) =>
            isActive ? "z-10 text-cs_yellow px-6" : "z-10  text-cs_gray px-6"
          }
        >
          <Settings01Icon />
        </NavLink>
      </ul>
      <div className="absolute bottom-0 left-0 w-full h-4/6 bg-black -z-2 border -mb-2"></div>
    </div>
  );
};

export default Menus;
