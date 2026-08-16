import React from "react";
import Navbar from "./component/Navbar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/Login";
import Profile from "./component/Profile";
import Body from "./component/Body";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./component/Feed";
import ProtectedRoute from "./utils/protectedRoute";
import Connection from "./component/Connection";
import ConnectionReq from "./component/ConnectionReq";

const App = () => {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Navigate to="/feed" replace />} />
            <Route path="login" element={<Login />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="feed" 
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="connections"
              element={
                <ProtectedRoute>
                  <Connection />
                </ProtectedRoute>
              }
            />
            <Route
              path="conrequest"
              element={
                <ProtectedRoute>
                  <ConnectionReq />
                </ProtectedRoute>
              }
            />
            <Route
              path="Conrequest"
              element={
                <ProtectedRoute>
                  <ConnectionReq />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

