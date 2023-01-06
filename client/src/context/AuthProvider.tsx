import { createContext, ReactNode, useState } from "react";

const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => {},
});

export interface AuthContextType {
  auth?: UserType | null;
  setAuth: (user: UserType | null) => void;
}

export interface UserType {
  username: string | undefined;
  roles: string[] | undefined;
  accessToken: string | undefined;
}

interface Props {
  children?: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<UserType | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
