// useAuth.js
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        setIsAuthenticated(true);
        setUser(user);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
      });
  }, []);

  return { isAuthenticated, user };
}

export default useAuth;
