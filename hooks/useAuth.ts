"use client";

import { useEffect, useState } from "react";

interface MockAuthUser {
  uid: string;
  email: string;
}

const STORAGE_KEY = "electos-auth-user";

export function useAuth() {
  const [user, setUser] = useState<MockAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setUser(saved ? (JSON.parse(saved) as MockAuthUser) : null);
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    setError(null);
    if (!email || password.length < 6) {
      const message = "Enter a valid email and password with at least 6 characters.";
      setError(message);
      throw new Error(message);
    }

    const nextUser = {
      uid: crypto.randomUUID(),
      email,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  async function signUp(email: string, password: string) {
    await signIn(email, password);
  }

  async function logOut() {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return { user, loading, error, signIn, signUp, logOut };
}
