"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiService, AuthResponse } from "@/lib/api";

interface User {
  id: string;
  correo: string;
  nombre: string;
  apellido: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    correo: string;
    password: string;
    nombre: string;
    apellido: string;
    roles?: string[];
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser && savedUser !== "undefined") {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // Si hay error al parsear, limpiar localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiService.login({ email, password });
    const { token, ...userData } = response as any;
    const userMapped = {
      id: userData.id_usuario?.toString() || userData.id,
      correo: userData.correo,
      nombre: userData.nombre,
      apellido: userData.apellido,
      roles: userData.roles,
    };
    setToken(token);
    setUser(userMapped);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userMapped));
  };

  const register = async (data: {
    correo: string;
    password: string;
    nombre: string;
    apellido: string;
    roles?: string[];
  }) => {
    const response = await apiService.register(data);
    const { token, ...userData } = response as any;
    const userMapped = {
      id: userData.id_usuario?.toString() || userData.id,
      correo: userData.correo,
      nombre: userData.nombre,
      apellido: userData.apellido,
      roles: userData.roles,
    };
    setToken(token);
    setUser(userMapped);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userMapped));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
