import { useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "react-native-calendars";

import Workout from './Workout';

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
            <View style = {styles.loadingContainer}>
                <Text style = {styles.textInput}>Data is Loading...</Text>
            </View>
        )
    } else if (status === 'error') {
      return (
          <View style = {styles.errorContainer}>
              <Text style = {styles.textInput}>Error Loading Data</Text>
          </View>
      )
    } else { //Get is successful
      return(
        <ScrollView style = {styles.container}>
            <Text style = {styles.textInput}>Choose Dates</Text>
            <Calendar/>
            <Text style = {styles.textInput}>Choose Exercises</Text>
            {data.map(workout => <Workout key = {workout.Workout_ID} workout = {workout}/>)}
        </ScrollView>
      )
    }
}

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    backgroundColor: "#2D3856",
    overflow: "scroll",
    padding: 10,
    flex: 1
  },
  textInput: {
    alignSelf: "center",
    color: "#FFFFFF",
    fontSize: 20
  }
});

export default ScheduleWorkout;