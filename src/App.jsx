import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/store";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { checkAuthStatus } from "./store/slices/authSlice";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationManager from "./components/Notification/NotificationManager";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthInitializer>
          <NotificationProvider>
            <NotificationManager />
            <AppRoutes />
            <Toaster position="top-center" reverseOrder={false} />
          </NotificationProvider>
        </AuthInitializer>
      </BrowserRouter>
    </Provider>
  );
}
