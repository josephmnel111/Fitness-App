import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import Workout from './Workout';
import LinearGradient from "react-native-linear-gradient";

const getWorkouts = async ()  => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const res = await fetch("http://192.168.0.10:3000/input", requestOptions)
  return res.json();
}

    //{ data.res.map(workout => <Text>{workout.Name}</Text>)}
const ScheduleWorkout = () => {

    const {data, status} = useQuery(["workouts"], getWorkouts);
    
    if (status === 'loading') {
        return (
            <View style = {styles.container}>
                <Text style = {styles.textInput}>Data is Loading...</Text>
            </View>
        )
    } else if (status === 'error') {
      return (
          <View style = {styles.container}>
              <Text style = {styles.textInput}>Data is Loading...</Text>
          </View>
      )
    } else { //Get is successful
      return(
        <View style = {styles.container}>
            <Text style = {styles.textInput}>Schedule Workout Screen</Text>
            {data.map(workout => <Workout key = {workout.Workout_ID} workout = {workout}/>)}
        </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2D3856",
    flex: 1
  },
  textInput: {
    alignSelf: "center",
    color: "#FFFFFF",
    fontSize: 20
  }
});

export default ScheduleWorkout;