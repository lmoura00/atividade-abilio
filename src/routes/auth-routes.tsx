
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Dashboard } from '../pages/dashboard';
import React = require('react');
import { ProductDetail } from '../pages/product-detail';
import { CartScreen } from '../pages/cart-screen';



export function AuthRoutes() {
    const {Navigator, Screen} = createNativeStackNavigator();
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Screen name="Dashboard" component={Dashboard} />
            <Screen name="ProductDetail" component={ProductDetail} />
            <Screen name="CartScreen" component={CartScreen} />
        </Navigator>
    );
}