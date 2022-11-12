import * as React from 'react';
import { StyleSheet, View, Button, Text, TextInput, TouchableOpacity } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from '../../Navigation/StackNavigator'
import { createStackNavigator } from "@react-navigation/stack";
import CreateWorkout from "./CreateWorkout";
import WorkoutInput from "./WorkoutInput"

const Stack = createStackNavigator();


const LiftingScreen = () =>{
  
    return (
       //#4169E1
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
            <Stack.Screen name = "Create Workout" component = {CreateWorkout}/>
            <Stack.Screen name = "Workout Input" component = {WorkoutInput}/>
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
 export default LiftingScreen;