import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query"
import Workout from './Workout'

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
            <View>
                <Text style = {styles.textInput}>Data is Loading...</Text>
            </View>
        )
    } else if (status === 'error') {
      return (
          <View>
              <Text style = {styles.textInput}>Data is Loading...</Text>
          </View>
      )
    } else { //Get is successful
      return(
        <View>
            <Text style = {styles.textInput}>Schedule Workout Screen</Text>
            {data.map(workout => <Workout key = {workout.Workout_ID} workout = {workout}/>)}
        </View>
      )
    }
}

const styles = StyleSheet.create({
    textInput: {
      alignSelf: "center",
      color: "#00308F",
      fontSize: 20
    }
  });

export default ScheduleWorkout;