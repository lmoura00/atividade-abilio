import { NavigationContainer } from '@react-navigation/native';
import { AuthRoutes } from './auth-routes';
import { PublicRoutes } from './public-routes';
import { useAuth } from '../hooks/use-profile';
import  { useEffect, useState } from 'react';
import React = require('react');

export function Routes() {
    const { token } = useAuth();
    const [isReady, setIsReady] = useState(false);

    // Adicione este useEffect para debug
    useEffect(() => {
        console.log('Token changed:', token);
    }, [token]);

    return (
        <NavigationContainer>
            {token ? <AuthRoutes /> : <PublicRoutes />}
        </NavigationContainer>
    );
}