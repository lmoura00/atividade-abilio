
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Dashboard } from '../pages/dashboard';
import React = require('react');



export function AuthRoutes() {
    const {Navigator, Screen} = createNativeStackNavigator();
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Screen name="Dashboard" component={Dashboard} />
        </Navigator>
    );
}