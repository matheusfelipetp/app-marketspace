import { ProviderDTO } from '@dtos/ProviderDTO';
import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken';
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser';
import { AppError } from '@utils/AppError';
import { AxiosError } from 'axios';
import { createContext, useEffect, useState } from 'react';

type PropsAuthContext = {
  user: UserDTO;
  signUp: (dataUser: FormData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
};

const AuthContext = createContext<PropsAuthContext>({} as PropsAuthContext);

const AuthProvider = ({ children }: ProviderDTO) => {
  const [user, setUser] = useState({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  const signUp = async (dataUser: FormData) => {
    try {
      await api.post('/users', dataUser, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw new AppError(error.response?.data.message);
      }
      throw error;
    }
  };

  const userAndTokenUpdate = async (userData: UserDTO, token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const storageUserAndTokenSave = async (
    userData: UserDTO,
    token: string,
    refresh_token: string,
  ) => {
    try {
      setIsLoadingUserStorageData(true);

      await storageUserSave(userData);
      await storageAuthTokenSave({ token, refresh_token });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/sessions', { email, password });

      if (data?.user && data?.token && data?.refresh_token) {
        await storageUserAndTokenSave(
          data.user,
          data?.token,
          data?.refresh_token,
        );

        userAndTokenUpdate(data.user, data?.token);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AppError(error.response?.data.message);
      }
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);

      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  const loadUserData = async () => {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();
      const { token } = await storageAuthTokenGet();

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
