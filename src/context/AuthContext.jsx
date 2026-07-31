import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  // True while the user is completing a password reset (they arrived via the
  // emailed recovery link). The app shows a "set new password" prompt.
  const [recovery, setRecovery] = useState(false);
  // `loading` is true until we've resolved the initial session so the UI
  // doesn't flash "logged out" for a moment on refresh.
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // Pull this user's row from the `subscriptions` table (RLS ensures they can
  // only ever read their own). Returns null when unconfigured or not paid.
  const fetchSubscription = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setSubscription(null);
      return;
    }
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    setSubscription(data || null);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) fetchSubscription(sessionUser.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) fetchSubscription(sessionUser.id);
      else setSubscription(null);
    });

    return () => sub.subscription.unsubscribe();
  }, [fetchSubscription]);

  // A logged-in user counts as "pro" when their subscription row is active or
  // trialing. This is NOT yet used for gating — the Stripe webhook (a later
  // step) has to populate the table first. Kept here so gating can switch over
  // in one place once that's live.
  const isProAccount =
    !!subscription && ['active', 'trialing'].includes(subscription.status);

  const value = {
    user,
    subscription,
    loading,
    isSupabaseConfigured,
    isProAccount,
    refreshSubscription: () => user && fetchSubscription(user.id),

    signUp: async (email, password) => {
      if (!supabase) return { error: { message: 'Auth is not configured yet.' } };
      const { data, error } = await supabase.auth.signUp({ email, password });
      // If email confirmation is ON, data.session is null and the user must
      // click a link before they can log in.
      return { data, error, needsConfirmation: !error && !data.session };
    },

    signIn: async (email, password) => {
      if (!supabase) return { error: { message: 'Auth is not configured yet.' } };
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    },

    signOut: async () => {
      if (!supabase) return;
      await supabase.auth.signOut();
      setUser(null);
      setSubscription(null);
    },

    resetPassword: async (email) => {
      if (!supabase) return { error: { message: 'Auth is not configured yet.' } };
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}?reset=true`,
      });
      return { error };
    },

    recovery,
    updatePassword: async (password) => {
      if (!supabase) return { error: { message: 'Auth is not configured yet.' } };
      const { error } = await supabase.auth.updateUser({ password });
      if (!error) setRecovery(false);
      return { error };
    },
    dismissRecovery: () => setRecovery(false),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
