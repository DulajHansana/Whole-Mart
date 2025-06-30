
"use client";

import { useState, useEffect } from 'react';
import type { User } from '@/components/dashboard/user-management/users-table';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('loggedInUser');
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('loggedInUser');
    }
    setUser(null);
  };
  
  const updateAuthUser = (updatedUser: User) => {
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    }
  }

  return { user, loading, logout, updateAuthUser };
}
