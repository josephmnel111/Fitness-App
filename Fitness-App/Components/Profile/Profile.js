
import * as React from 'react';
import WorkoutContainerSection from './WorkoutContainer/WorkoutContainerSection';
import StepSection from './Steps/StepSection';
import GraphSection from './Graph/GraphSection';
import TimeSection from './Time/TimeSection';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useQuery } from "@tanstack/react-query";
import { useState } from 'react'


/*
  1. Radio buttons for workout container values.
  2. Style nicely.
  3. On submit button, send a value from WorkoutContainerSection up to profile then down to graph and step sections.
  4. Replace the variables given now with that variable once the change has been sent.
  5. When you open the workout container menu back up. Make sure the radio wave is changed to select the appropriate option.

*/

const getWorkouts = async ()  => {

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  //This can change, need to figure this out eventually
  const res = await fetch("http://192.168.0.10:3000/workouts-info", requestOptions)
  return res.json();
}

const getSteps = async ()  => {

   const requestOptions = {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json'
     }
   }
   //This can change, need to figure this out eventually
   const res = await fetch("http://192.168.0.10:3000/steps-info", requestOptions)
   return res.json();
 }



const ProfileScreen = () =>{
   const stepsResponse = useQuery(["steps"], getSteps);
   const workoutResponse = useQuery(["workouts"], getWorkouts);
   const [activeWorkout, setActiveWorkout] = useState("Steps")
   const [timeInterval, setTimeInterval] = useState(99999)
   const [displayed, setDisplayed] = useState(false);
   console.log('hi')


   const chooseTime = (timeInterval) => {
    setTimeInterval(timeInterval)
   }

   const handleActiveWorkout = (workout) => {
      setActiveWorkout(workout)
   }

   const displayWorkoutContainer = () => {
    if (displayed == false) {
      setDisplayed(true)
    } else {
      setDisplayed(false)
    }
  }

   if (stepsResponse.status === 'loading') {
      return (
          <View style = {styles.loadingContainer}>
              <Text style = {styles.textInput}>Data is Loading...</Text>
          </View>
      )
    } else if (stepsResponse.status === 'error') {
      return (
          <View style = {styles.errorContainer}>
              <Text style = {styles.textInput}>Error Loading Data</Text>
          </View>
      ) 
    } else {
      return (
         <View style={{ flex: 1, backgroundColor: "#1D1E24"}}>
            {
              displayed ? (
                <View>
                  <WorkoutContainerSection  activeWorkout = {activeWorkout} displayWorkoutContainer = {displayWorkoutContainer} handleActiveWorkout = {handleActiveWorkout} workoutData = {workoutResponse.data}></WorkoutContainerSection>
              </View>
              ): null
            }
            {
              displayed ? null: (
                <View>
                  <TouchableOpacity style = {styles.button} onPress = {() =>displayWorkoutContainer()}>
                      <Text style = {styles.text}>More Options</Text>
                  </TouchableOpacity>
                  <StepSection time = {timeInterval} activeWorkout = {activeWorkout} workoutData = {workoutResponse.data} stepsData = {stepsResponse.data}  style = {styles.stepSection}/>
                  <GraphSection time = {timeInterval} activeWorkout = {activeWorkout} workoutData = {workoutResponse.data} stepsData = {stepsResponse.data} ></GraphSection>
                  <TimeSection chooseTime = {chooseTime}></TimeSection>
                </View>
              )
            }
   
         </View>
      )
      
    }

 }
 const styles = StyleSheet.create({
  errorContainer: {
     alignItems: "center",
     justifyContent: "center",
     flex: 1,
     backgroundColor: "#1D1E24",
     color: "white"
   },
   loadingContainer: {
     alignItems: "center",
     justifyContent: "center",
     flex: 1,
     backgroundColor: "#1D1E24",
     color: "white"
   },
  stepSection: {
     position: 'absolute',
     right: 50
  },
  button: {
   backgroundColor: '#1D65E1',
   justifyContent: 'center',
   borderRadius: 15,
   height: 30,
   width: 60,
   margin: 10
 },
 text: {
   color: 'white',
   alignSelf: 'center'
 }
})
 export default ProfileScreen;