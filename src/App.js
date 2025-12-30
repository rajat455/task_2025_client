import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginScreen from "./Screens/Login/LoginScreen";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import RegisterScreen from "./Screens/Register/RegisterScreen";
import Layout from "./Layout";
import ProfileScreen from "./Screens/Profile/ProfileScreen";
import ProtectedRoute from "./Components/ProtectedRouter";
import UserScreen from "./Screens/Users/UserScreen";
import ForbiddenScreen from "./Screens/Forbidden/ForbiddenScreen";
import apiHelper from "./Halpers/apiHalpers";

function App() {
  const { enqueueSnackbar: showSnack } = useSnackbar();
  window.showSnack = showSnack;
  const token = localStorage.getItem("token");
  let [Auth, setAuth] = useState(token ? jwtDecode(token) : null);
  useEffect(() => {
    apiHelper.setAuth = setAuth
    apiHelper.Auth = Auth
    // eslint-disable-next-line
  }, [])
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginScreen Auth={Auth} setAuth={setAuth} />} />
          <Route
            path="/register"
            element={<RegisterScreen setAuth={setAuth} Auth={Auth} />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                Auth={Auth}
                Component={
                  <Layout
                    Auth={Auth}
                    Component={ProfileScreen}
                    setAuth={setAuth}
                  />
                }
              />
            }
          />
          <Route
            path="/listUser"
            element={
              <ProtectedRoute
                Auth={Auth}
                Component={
                  <Layout
                    Auth={Auth}
                    Component={UserScreen}
                    setAuth={setAuth}
                  />
                }
              />
            }
          />
          <Route
            path="/forbidden"
            element={
              <ProtectedRoute
                Auth={Auth}
                Component={
                  <Layout
                    Auth={Auth}
                    Component={ForbiddenScreen}
                    setAuth={setAuth}
                  />
                }
              />
            }
          />
        
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
