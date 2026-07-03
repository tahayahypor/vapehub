import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authService } from "../services/authService";

const AuthContext = createContext(null);

const normalizeUser = (userData) => ({
  ...userData,
  fullName: userData.full_name,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setError(null);

        const currentUser =
          await authService.getMe();

        setUser(normalizeUser(currentUser));
      } catch (requestError) {
        if (requestError.status !== 401) {
          setError(requestError.message);
        }

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (
    fullName,
    email,
    password
  ) => {
    try {
      setError(null);

      const registeredUser =
        await authService.register({
          full_name: fullName,
          email,
          password,
        });

      setUser(normalizeUser(registeredUser));

      return { success: true };
    } catch (requestError) {
      setError(requestError.message);

      return {
        success: false,
        message: requestError.message,
      };
    }
  };

  const login = async (
    email,
    password
  ) => {
    try {
      setError(null);

      const loggedInUser =
        await authService.login({
          email,
          password,
        });

      setUser(normalizeUser(loggedInUser));

      return { success: true };
    } catch (requestError) {
      setError(requestError.message);

      return {
        success: false,
        message: requestError.message,
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};