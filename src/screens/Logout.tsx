import { Loading } from '@components/Loading';
import { useAuth } from '@hooks/useAuth';
import { useEffect } from 'react';

export function Logout() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, []);

  return <Loading />;
}
