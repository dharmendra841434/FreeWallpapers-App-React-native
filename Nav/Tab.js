import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Pages/Home';
import Categories from '../Pages/Categories';
import MySearch from '../Pages/Search';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionic from 'react-native-vector-icons/Ionicons';
import Colors from '../Colors';
import { View, Text, TouchableOpacity } from 'react-native';

<Icon name="rocket" size={30} color="#900" />

const MyTab = createBottomTabNavigator();

const Tab = () => {

    return (

        <MyTab.Navigator>
            <MyTab.Screen name="Home" component={Home}
                options={
                    {
                        headerShown: false,

                        tabBarActiveTintColor: Colors.primarycolor,
                        headerStyle: {
                            backgroundColor: Colors.primarycolor
                        },
                        headerRight: () => (
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'white', marginEnd: 8, marginTop: 10, fontSize: 10 }}>Swipe Right</Text>
                                <TouchableOpacity>
                                    <Icon name="caret-right" style={{ marginEnd: 10 }}
                                        size={40} color="white" />
                                </TouchableOpacity>
                            </View>
                        ),
                        headerTintColor: 'white',
                        tabBarIcon: (tabinfo) => {

                            return <Icon name="home" size={25}
                                color={tabinfo.focused ? Colors.primarycolor : "gray"} style={{
                                    marginTop: 5
                                }} />
                        }
                    }
                } />
            <MyTab.Screen name="Categories" component={Categories}
                options={
                    {
                        headerShown: false,
                        tabBarActiveTintColor: Colors.primarycolor,
                        tabBarIcon: (tabinfo) => {

                            return <Ionic name="logo-buffer" size={25}
                                color={tabinfo.focused ? Colors.primarycolor : "gray"} style={{
                                    marginTop: 5
                                }} />
                        }
                    }
                } />
            <MyTab.Screen name="Search" component={MySearch}
                options={
                    {
                        headerTransparent: true,
                        headerShadowVisible: false,
                        headerBackVisible: false,
                        tabBarActiveTintColor: Colors.primarycolor,
                        tabBarIcon: (tabinfo) => {

                            return <Icon name="search" size={25}
                                color={tabinfo.focused ? Colors.primarycolor : "gray"} style={{
                                    marginTop: 5
                                }} />
                        }
                    }
                } />
        </MyTab.Navigator>
    );

};
export default Tab;