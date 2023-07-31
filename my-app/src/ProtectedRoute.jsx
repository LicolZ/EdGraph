import React from 'react';
import { Route, Redicrect } from 'react-router-dom'

export default function ProtectedRoute({ children, isAuthenticated, ...rest}) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/signin",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}