import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import {
  getCurrentUser,
  promoteCurrentUserToAdmin,
  signInRequest,
  signOutRequest,
  type AuthUser,
} from './api';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  promoteToAdmin: (setupToken: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  refresh: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Não foi possível verificar a sessão. Tente novamente.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError(null);
      return currentUser;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      throw requestError;
    }
  }, []);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((currentUser) => {
        if (!active) return;
        setUser(currentUser);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        const message = getErrorMessage(requestError);
        setError(message);
        toast.error(`Não foi possível conectar à autenticação: ${message}`, { id: 'auth-connection' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const signedInUser = await signInRequest(email, password);
    setUser(signedInUser);
    setError(null);
    return signedInUser;
  }, []);

  const promoteToAdmin = useCallback(async (setupToken: string) => {
    const promotedUser = await promoteCurrentUserToAdmin(setupToken);
    setUser(promotedUser);
    setError(null);
    return promotedUser;
  }, []);

  const signOut = useCallback(async () => {
    await signOutRequest();
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    signIn,
    promoteToAdmin,
    signOut,
    refresh,
  }), [user, loading, error, signIn, promoteToAdmin, signOut, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider.');
  return value;
}
