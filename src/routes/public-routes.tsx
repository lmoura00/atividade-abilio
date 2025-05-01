
import React = require('react');
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../pages/login';

export function PublicRoutes() {
    const { Navigator, Screen } = createNativeStackNavigator();
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Screen name="Login" component={Login} />
            
        </Navigator>
    );
}