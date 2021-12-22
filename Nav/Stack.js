import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Tab from './Tab';
import CategoriesItems from '../Pages/CategoriesItems';
import SplashScreen from '../Pages/SplashScreen';


const MyStack = createNativeStackNavigator();

const Stack = () => {

    return (
        <NavigationContainer >
            <MyStack.Navigator initialRouteName='SplashScreen'>
                <MyStack.Screen name="Tab" component={Tab}
                    options={
                        {
                            headerShown: false,

                        }
                    } />
                <MyStack.Screen name="SplashScreen" component={SplashScreen}
                    options={
                        {
                            headerShown: false,

                        }
                    } />
                <MyStack.Screen name="Items" component={CategoriesItems}
                    options={
                        {
                            headerTitle: "",
                            headerTransparent: true,
                            headerShadowVisible: false,
                            headerTintColor: "#594202",
                            headerBackVisible: false,

                        }
                    }
                />
            </MyStack.Navigator>
        </NavigationContainer>
    );

};
export default Stack;