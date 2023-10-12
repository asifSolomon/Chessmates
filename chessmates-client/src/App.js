import Home from "./js/screens/main/Home";
import Login from "./js/screens/Login";
import Forgot from "./js/screens/Forgot";
import Signup from "./js/screens/Signup";
import Reset from "./js/screens/Reset";
import NotFound from "./js/screens/NotFound";
import Settings from "./js/screens/Settings";
import { useAuth } from "./js/contexts/AuthProvider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
}
  from "react-router-dom";
import { SocketProvider } from "./js/contexts/SocketProvider";
import Learn from "./js/screens/Learn";
import Puzzles from "./js/screens/Puzzles";

function App() {
  // preventing access without a token
  const ProtectedRoute = ({
    redirectPath = '/login',
    children,
  }) => {
    // get the token from local storage
    const { auth } = useAuth();

    // if not token redirects to login page
    if (!auth) {
      return <Navigate to={redirectPath} replace />;
    }

    // return the requested path
    return children ? children : <Outlet />
  };

  return (
    <div className="App">
      <Router>
        <div className="content">

          {/* routes of the application */}
          <Routes>

            {/* public routes */}
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Forgot" element={<Forgot />} />
            <Route path="/Reset/:token" element={<Reset />} />
            <Route path="*" element={<NotFound />} />

            {/* private routes */}
            <Route element={
              <SocketProvider>
                <ProtectedRoute />
              </SocketProvider>
            }>
              <Route path="/" element={<Home inGame={false} />} />
              <Route path="/Learn" element={<Learn />} />
              <Route path="/Play" element={<Home inGame={true} />} />
              <Route path="/Settings" element={<Settings />} />
              <Route path="/Puzzles" element={<Puzzles />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
