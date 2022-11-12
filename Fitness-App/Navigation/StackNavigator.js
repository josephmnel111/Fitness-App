import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CreateWorkout from "../Components/Lifting/CreateWorkout";

const Stack = createStackNavigator();

const StackNavigator = () =>  {
    return (
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name = "Create Workout" component = {CreateWorkout}/>
        </Stack.Navigator>
        </NavigationContainer>
    )
}
export default StackNavigator