import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { UserContext } from "./context/UserContext";
import { useContext, useState, useEffect } from "react";
import "./App.css";
import { CgProfile } from "react-icons/cg";

function App() {
  const { setToken, token } = useContext(UserContext);
  const [isProfileMenu, setIsProfileMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  // Set today's date
  useEffect(() => {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(today.toLocaleDateString(undefined, options));
  }, []);

  // Close profile menu when clicking outside

  return (
    <div className="relative">
      <Router>
        {/* Header Section */}
        <div className="px-8 py-8 md:h-[250px] App flex flex-col gap-5 md:gap-16">
          <div className="flex justify-between items-center">
            {/* App Logo */}
            <h1 className="text-3xl font-bold mb-4">
              <Link to="/">Plan-it</Link>
            </h1>

            {/* Profile Section */}
            <div className="relative">
              <CgProfile
                className="text-5xl cursor-pointer"
                onClick={() => setIsProfileMenu(!isProfileMenu)}
              />
              <div
                className={`absolute top-[60px] right-[30px] bg-white rounded shadow-md  ${
                  isProfileMenu ? "visible" : "invisible"
                }`}
              >
                {token ? (
                  <ul>
                    <li
                      className="bg-purple-200 border-[1px] border-white px-6 py-2 cursor-pointer hover:bg-purple-800 hover:text-white font-semibold hover:border-white rounded text-nowrap"
                      onClick={() => {
                        localStorage.removeItem("tokentodo");
                        setToken(null);
                        setIsProfileMenu(false); // Close menu after logout
                      }}
                    >
                      Log Out
                    </li>
                  </ul>
                ) : (
                  <ul>
                    <li className="bg-purple-200 border-[1px] border-white px-6 py-2 cursor-pointer hover:bg-purple-800 hover:text-white font-semibold hover:border-white rounded mb-2">
                      <Link to="/login" onClick={() => setIsProfileMenu(false)}>
                        Login
                      </Link>
                    </li>
                    <li className="bg-purple-200 border-[1px] border-white px-6 py-2 cursor-pointer hover:bg-purple-800 hover:text-white font-semibold hover:border-white rounded">
                      <Link
                        to="/register"
                        onClick={() => setIsProfileMenu(false)}
                      >
                        Register
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Today's Date */}
          <div className="text-left  ">
            <p className="text-2xl font-semibold "> {currentDate}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="-mt-10 md:mx-14 bg-slate-200 rounded-lg min-h-[70vh]">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
