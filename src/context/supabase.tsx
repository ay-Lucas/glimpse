"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/services/supabase/client";
import { usePathname } from "next/navigation";

interface SupaContext {
  client: ReturnType<typeof getBrowserSupabase>;
  session: Session | null;
  user: User | null;
}

const SupabaseContext = createContext<SupaContext | null>(null);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const client = getBrowserSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // 1) load initial session
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
    });
    // 2) subscribe for updates
    const { data: sub } = client.auth.onAuthStateChange((_ev, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [client]);
  // re‐fetch session on every navigation
  useEffect(() => {
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
    });
  }, [client, pathname]);

  return (
    <SupabaseContext.Provider value={{ client, session, user }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error("Missing <SupabaseProvider> in your tree");
  return ctx;
}
