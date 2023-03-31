import * as React from 'react';
import { StyleSheet, View, Button, Text, TextInput, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import CreateWorkout from "../LiftingMain/CreateWorkout";
import WorkoutInput from "../CreateWorkouts/WorkoutInput"
import ScheduleWorkout from "../ScheduleWorkouts/ScheduleWorkout"

const Stack = createStackNavigator();


const LiftingNavigation = () => {
  
    return (
       //#4169E1
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
            <Stack.Screen name = "Create Workout" component = {CreateWorkout}/>
            <Stack.Screen name = "Workout Input" component = {WorkoutInput}/>
            <Stack.Screen name = "Schedule Workout" component = {ScheduleWorkout}/>
        </Stack.Navigator>
        
      /*<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "black"}}>
        <Button title = "Create" onPress = {() => navigation.navigate('CreateWorkout')}>

        </Button>
      </View>*/

    );
 }
 
 
 const styles = StyleSheet.create({
    container: {
      backgroundColor: "black",
    },
    input: {
      backgroundColor: "white"
    },
    input_container: {
      display: "grid"
    },
    inputLifts: {
      display: "none"
    },
    button_container: {
      backgroundColor: "white",

    }
  });
 export default LiftingNavigation;