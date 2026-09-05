import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/store";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { checkAuthStatus } from "./store/slices/authSlice";

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
          <AppRoutes />
          <Toaster position="top-center" reverseOrder={false} />
        </AuthInitializer>
      </BrowserRouter>
    </Provider>
  );
}
