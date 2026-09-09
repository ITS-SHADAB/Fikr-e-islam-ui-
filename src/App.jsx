import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/store";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { checkAuthStatus } from "./store/slices/authSlice";
import { fetchSettings } from "./store/slices/settingsSlice";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import NotificationManager from "./components/Notification/NotificationManager";

function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
    dispatch(fetchSettings());
  }, [dispatch]);

  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInitializer>
          <NotificationProvider>
            <AuthModalProvider>
              <NotificationManager />
              <AppRoutes />
              <Toaster position="top-center" reverseOrder={false} />
            </AuthModalProvider>
          </NotificationProvider>
        </AppInitializer>
      </BrowserRouter>
    </Provider>
  );
}
