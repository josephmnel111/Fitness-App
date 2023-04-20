import {useEffect, useState} from "react";
import { View, Text, TouchableOpacity,  StyleSheet, ScrollView } from "react-native";
import MonthCalendar from "../../../Utils/GetScheduledWorkoutsCalendar/MonthCalendar.js";
import { FontAwesome5 } from '@expo/vector-icons';




const CreateWorkout = ({navigation, route}) => {

  const [successWorkoutInput, setSuccessWorkoutInput] = useState(false)
  const [successScheduleWorkout, setSuccessScheduleWorkout] = useState(false)


  //Updates the calendar on this screen if a new workout/date pair is added on schedule screen.
  useEffect(() => {
    if (route.params?.actionType == 'create') {
      console.log('hi')
      setSuccessWorkoutInput(true)
      setTimeout(() => {
        setSuccessWorkoutInput(false)
    }, 2000);
    } else if (route.params?.actionType == 'schedule') {
      setSuccessScheduleWorkout(true)
      setTimeout(() => {
        setSuccessScheduleWorkout(false)
    }, 2000);
    }
  }, [route.params?.actionType]);

  return (
    <ScrollView style = {styles.container}>
      <Text style = {styles.textInput}>Workout Schedule</Text>
      <MonthCalendar dates = {route.params?.postDates} workouts = {route.params?.postWorkoutData}/>
      <TouchableOpacity
        style = {styles.button} 
        onPress = {() => navigation.navigate('Workout Input')}
      >
        <Text style = {styles.buttonText}>Create Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style = {styles.button} 
        onPress = {() => navigation.navigate('Schedule Workout')}
      >
        <Text style = {styles.buttonText}>Schedule Workout</Text>
      </TouchableOpacity>
        { successWorkoutInput &&
        <View style = {styles.successContainer}>
          <FontAwesome5
          name = "check-circle"
          style = {styles.successCheckmark}
          />
          <Text style = {styles.successText}>  Workout has been created!</Text>
        </View>
        }
        { successScheduleWorkout &&
        <View style = {styles.successContainer}>
          <FontAwesome5
          name = "check-circle"
          style = {styles.successCheckmark}
          />
          <Text style = {styles.successText}>  Workout has been scheduled!</Text>
        </View>
        }
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1D1E24",
    overflow: "scroll",
    padding: 10,
    flex: 1
  },
  textInput: {
    alignSelf: "center",
    color: "white",
    fontSize: 20
  },
  button: {
    alignItems: "center",
    borderColor: 'white',
    borderWidth: 2,
    padding: 10,
    margin: 10,
    borderRadius: 12
  },
  buttonText: {
    color: "white",
    fontSize: 20
  },
  input: {
    backgroundColor: "white",
    float: "right"
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successCheckmark: {
    color: "#32CD32",
    fontSize: 16,
    zIndex: 1
  },
  successText: {
    color: "#32CD32",
    fontSize: 16
  }
});
export default CreateWorkout;