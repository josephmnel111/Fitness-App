import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState, useEffect } from "react";
import MonthCalendar from "../../../Utils/ScheduleWorkoutsCalendar/MonthCalendar";
import {NetworkIP} from "../../../Utils/Constants/NetworkSettings";
import Workout from "./Workout";

const getWorkouts = async ()  => {

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  //This can change, need to figure this out eventually
  const res = await fetch(NetworkIP + "/workout-input", requestOptions)
  return res.json();
}

    //{ data.res.map(workout => <Text>{workout.Name}</Text>)}
const ScheduleWorkout = ({navigation}) => {
  
    const {data, status} = useQuery([], getWorkouts);
    const [dates, setDates] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [workoutData, setWorkoutData] = useState([])

    const updateActiveDates = (date, isAdd) => {
      let tempDateArray = []
      if (dates != undefined) {
        tempDateArray = dates
      }
      if (isAdd) {
        tempDateArray.push(date)
        setDates(tempDateArray)
      } else {
        let removalIndex = tempDateArray.indexOf(date)
        tempDateArray.splice(removalIndex, 1)
        setDates(tempDateArray)
      }

    }

    const postSchedule = async () => {
      try {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({dateValues: dates, workoutValues: workoutData})
        }
        setShowSuccess(true)
        await fetch(NetworkIP + "/schedule-input", requestOptions)
        .then(response => {
          response.json()
          .then(data => {
            navigation.navigate('Create Workout')
            Alert.alert("Post Created")
          })
        })
      } catch (error) {
        console.log(error);
      }
    }

    const updateActiveWorkouts = (workout, isAdd) => {
      let tempWorkoutArray = []
      if (workoutData != undefined) {
        tempWorkoutArray = workoutData
      }
      if (isAdd) {
        tempWorkoutArray.push(workout)
        setWorkoutData(tempWorkoutArray)
      } else {
        let removalIndex = tempWorkoutArray.indexOf(workout)
        tempWorkoutArray.splice(removalIndex, 1)
        setWorkoutData(tempWorkoutArray)

      }
    }
    

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
          <View style = {styles.scheduleContainer}>
            <MonthCalendar updateActiveDates = {updateActiveDates}/>
          </View>
          <Text style = {styles.textInput}>Choose Exercises</Text>
          <View style = {styles.workoutContainer}>
            {data.map(workout => <Workout key = {workout.Workout_ID} workout = {workout} updateActiveWorkouts = {updateActiveWorkouts}/>)}
            { showSuccess &&
              <Text style = {{color: "white", alignSelf: "center"}}>Workout has been scheduled!</Text>
            }
            <TouchableOpacity
              style = {styles.button} 
              onPress = {postSchedule}
            >
            <Text style = {styles.buttonText}>Schedule</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      )
    }
}

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#2D3856",
    color: "white"
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#2D3856",
    color: "white"
  },
  container: {
    backgroundColor: "#1D1E24",
    overflow: "scroll",
    padding: 10,
    flex: 1
  },
  scheduleContainer: {
    backgroundColor: "#18181C",
    margin: 15,
    padding: 5,
    borderRadius: 20
  },
  workoutContainer: {
    backgroundColor: "#18181C",
    margin: 15,
    padding: 5,
    borderRadius: 20
  },
  button: {
    borderColor: 'white',
    borderWidth: 2,
    alignItems: "center",
    padding: 10,
    margin: 10,
    marginBottom: 20,
    borderRadius: 12
  },
  buttonText: {
    color: "white",
    fontSize: 20
  },
  textInput: {
    alignSelf: "center",
    color: "#FFFFFF",
    fontSize: 20
  }
});

export default ScheduleWorkout;