import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LiftingNavigation from "../Components/Lifting/ButtonNavigation/LiftingNavigation";

const Stack = createStackNavigator();

const StackNavigator = () =>  {
    return (
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name = "Lifting Navigation" component = {LiftingNavigation}/>
        </Stack.Navigator>
        </NavigationContainer>
    )
}
export default StackNavigator