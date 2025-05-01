import {NavigationContainer} from '@react-navigation/native'
import { AuthRoutes } from './auth-routes';
import { PublicRoutes } from './public-routes';
import { useProfile } from '../hooks/use-profile';
import { useState } from 'react';


export function Routes() {
    const [token, setToken] = useState(null);
    return (
        <NavigationContainer>
            {token ? (
                <AuthRoutes />
            ) : (
                <PublicRoutes />
            )}
        </NavigationContainer>
    );
}