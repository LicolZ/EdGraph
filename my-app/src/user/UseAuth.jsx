// UseAuth.jsx
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

export default function UseAuth() {
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