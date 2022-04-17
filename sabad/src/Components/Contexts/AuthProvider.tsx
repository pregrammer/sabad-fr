import { createContext, useContext, useState  } from "react";
import AuthType from "../../Types/auth";

const AuthContext = createContext({
  auth: {
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
    role: 0,
    phoneNumber: "",
    field_of_study_id: 0,
    field_of_study_name: "",
  },
  setAuth: (auth: AuthType | {}) => {}
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: any) => {
  const [auth, setAuth]: [any, any] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
