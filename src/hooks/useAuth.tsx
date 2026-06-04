"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/services/api";
import * as authService from "@/services/auth";
import type { LoginPayload, PublicUser, RegisterPayload } from "@/types/api";

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<PublicUser>;
  register: (payload: RegisterPayload) => Promise<PublicUser>;
  logout: () => Promise<void>;
  setUser: (user: PublicUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { user } = await authService.getMe();
      setUser(user);
      setError(null);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setUser(null);
      } else {
        setError(e instanceof Error ? e.message : "Failed to load session");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (payload: LoginPayload) => {
    const { user } = await authService.login(payload);
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { user } = await authService.register(payload);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, error, refresh, login, register, logout, setUser }),
    [user, loading, error, refresh, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
