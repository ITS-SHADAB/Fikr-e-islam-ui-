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
              <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                  duration: 4000,
                  style: {
                    borderRadius: "14px",
                    background: "#2B2118",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontFamily:
                      "'Payami Nastaleeq', 'Noto Nastaliq Urdu', system-ui, sans-serif",
                    padding: "12px 18px",
                    boxShadow: "0 8px 24px rgba(43, 33, 24, 0.25)",
                    direction: "rtl",
                    textAlign: "right",
                    maxWidth: "440px",
                    border: "1px solid rgba(168, 121, 62, 0.4)",
                  },
                  error: {
                    iconTheme: {
                      primary: "#E06B6B",
                      secondary: "#2B2118",
                    },
                  },
                  success: {
                    iconTheme: {
                      primary: "#10B981",
                      secondary: "#2B2118",
                    },
                  },
                }}
              />
            </AuthModalProvider>
          </NotificationProvider>
        </AppInitializer>
      </BrowserRouter>
    </Provider>
  );
}
