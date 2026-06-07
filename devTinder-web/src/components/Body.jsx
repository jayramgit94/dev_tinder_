import Navbar from "./NavBar"; // import local NavBar component
import { Outlet } from "react-router-dom";//Outlet is a component that is used to render the child components of a route. It is used in the parent component of a route to render the child components of that route.
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../../utils/constants"; // import BASE_URL from constants file
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Body = () =>{
  const userData  = useSelector((store) => store.user.data);
return(
  <>
  
       <Navbar />
       <Outlet />
        <Footer />

  
  </>
)
}

export default Body;