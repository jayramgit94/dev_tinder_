import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { removeUser } from "../../utils/userSlice";

const POLL_INTERVAL_MS = 5000;

const Navbar = () => {
const user = useSelector((store) => store.user.data);
const dispatch = useDispatch();
const navigate = useNavigate(); 
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  if (!user?._id) {
    return undefined;
  }

  let cancelled = false;

  const loadUnreadCount = async () => {
    try {
      const response = await axios.get(`${BASE_URL}inbox/conversations`, { withCredentials: true });
      const conversations = response.data?.data || [];
      const nextUnreadCount = conversations.reduce((count, conversation) => count + (conversation.unreadCount || 0), 0);

      if (!cancelled) {
        setUnreadCount(nextUnreadCount);
      }
    } catch (error) {
      if (!cancelled) {
        console.log("Error loading unread count:", error);
      }
    }
  };

  loadUnreadCount();
  const timer = setInterval(loadUnreadCount, POLL_INTERVAL_MS);

  return () => {
    cancelled = true;
    clearInterval(timer);
  };
}, [user?._id]);

const handleLogout = async () => {
  try{
    await axios.post(BASE_URL + "logout", {}, { withCredentials: true });
  }catch(error){
    console.log("Error during logout:", error);
  } finally {
    dispatch(removeUser());
    navigate("/login", { replace: true });
  }
};

  return (
    <>
    
      <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">DevTender</a>
  </div>
  <div className="flex gap-2">
    {!user && (
      <>
        <Link className="btn btn-outline" to="/register">Register</Link>
        <Link className="btn btn-primary" to="/login">Login</Link>
      </>
    )}


    {user && (<div className="dropdown dropdown-end mx-5"> welcome, {user.firstName}!
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src={user.photoUrl} />
        </div>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <Link className="justify-between" to="/profile">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li>
          <Link className="justify-between" to="/inbox">
            Inbox
            {unreadCount > 0 && <span className="badge badge-primary">{unreadCount}</span>}
          </Link>
        </li>
        <li><Link to="/">Feed</Link></li>
        <li>
          <button type="button" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>)}
  </div>
</div>
    
    </>
  )

}

export default Navbar;
