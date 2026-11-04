import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { loginRequest, logoutRequest, registerRequest } from "../api/authApi";
import type { LoginCredentials } from "../types";
import { firebaseAuth } from "../api/firebase";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../api/firebase";

interface AuthContextValue {
  authReady: boolean;
  isAuthenticated: boolean;
  userEmail: string | null;
  userId: string | null;
  role: "customer" | "pharmacy";
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "e_pharmacy_token";
const EMAIL_KEY = "e_pharmacy_email";
const ROLE_KEY = "e_pharmacy_role";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(!firebaseAuth);
  const [token, setToken] = useState<string | null>(() =>
    firebaseAuth ? null : localStorage.getItem(TOKEN_KEY),
  );
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem(EMAIL_KEY),
  );
  const [role, setRole] = useState<"customer" | "pharmacy">(() =>
    localStorage.getItem(ROLE_KEY) === "pharmacy" ? "pharmacy" : "customer",
  );

  useEffect(() => {
    if (!firebaseAuth) return;
    return firebaseAuth.onAuthStateChanged(async (user) => {
      setToken(user?.uid ?? null);
      setUserEmail(user?.email ?? null);
      if (user?.email) {
        localStorage.setItem(EMAIL_KEY, user.email);
        try {
          const profile = firestore
            ? await getDoc(doc(firestore, "users", user.uid))
            : null;
          const nextRole =
            profile?.data()?.role === "pharmacy" ? "pharmacy" : "customer";
          setRole(nextRole);
          localStorage.setItem(ROLE_KEY, nextRole);
        } catch {
          setRole("customer");
        }
      } else {
        localStorage.removeItem(EMAIL_KEY);
        localStorage.removeItem(ROLE_KEY);
        setRole("customer");
      }
      setAuthReady(true);
    });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await loginRequest(credentials);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(EMAIL_KEY, result.email);
    localStorage.setItem(ROLE_KEY, result.role);
    setToken(result.token);
    setUserEmail(result.email);
    setRole(result.role);
  }, []);

  const register = useCallback(async (credentials: LoginCredentials) => {
    const result = await registerRequest(credentials);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(EMAIL_KEY, result.email);
    localStorage.setItem(ROLE_KEY, result.role);
    setToken(result.token);
    setUserEmail(result.email);
    setRole(result.role);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(ROLE_KEY);
    setToken(null);
    setUserEmail(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      authReady,
      userEmail,
      userId: token,
      role,
      login,
      register,
      logout,
    }),
    [token, userEmail, role, authReady, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
