import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesome5 } from '@expo/vector-icons';
import ProfileScreen from '../Components/Profile/Profile';
import SettingsScreen from '../Components/Settings/Settings';
import LiftingScreen from '../Components/Lifting/Lifting';
import RunningScreen from '../Components/Running/Running';


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            useLegacyImplementation = {true}
            initialRouteName="Profile"
      
            screenOptions={{
            headerShown: true,
            headerTintColor: "white",
            headerStyle: {
            backgroundColor: "black",
            },
            drawerStyle: {
            backgroundColor: "black"
            }
            }}
            >
            <Drawer.Screen 
                name = "  Profile" 
                component = {ProfileScreen}
                options = {{
                    drawerInactiveTintColor: "white",
                    drawerIcon: ({focused, size}) => (
                        <FontAwesome5
                            name = "user-circle"
                            size = {24}
                            color={focused ? "#4169E1" : "white"}
                        />
                    ),
                }}
            />
            <Drawer.Screen 
                name = "Lifting" 
                component = {LiftingScreen}
                options = {{
                    drawerInactiveTintColor: "white",
                    drawerIcon: ({focused, size}) => (
                        <FontAwesome5
                            name = "dumbbell"
                            size = {24}
                            color={focused ? "#4169E1" : "white"}
                        />
                    ),
                }}
            />
            <Drawer.Screen 
                name = "   Running" 
                component = {RunningScreen}
                options = {{
                    drawerInactiveTintColor: "white",
                    drawerIcon: ({focused, size}) => (
                        <FontAwesome5
                            name = "running"
                            size = {24}
                            color={focused ? "#4169E1" : "white"}
                        />
                    ),
                }}
            />
            <Drawer.Screen 
                name = "  Settings" 
                component = {SettingsScreen}
                options = {{
                    drawerInactiveTintColor: "white",
                    drawerIcon: ({focused, size}) => (
                        <FontAwesome5
                            name = "cog"
                            size = {24}
                            color={focused ? "#4169E1" : "white"}
                        />
                    ),
                }}
            />
        </Drawer.Navigator>
);
  }
  
  export default DrawerNavigator;