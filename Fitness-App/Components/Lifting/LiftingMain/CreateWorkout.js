import {useEffect, useState} from "react";
import { View, Text, TouchableOpacity,  StyleSheet, ScrollView } from "react-native";
import MonthCalendar from "../../../Utils/GetScheduledWorkoutsCalendar/MonthCalendar.js";




const CreateWorkout = ({navigation}) => {

  return (
    <ScrollView style = {styles.container}>
      <Text style = {styles.textInput}>Workout Schedule</Text>
      <MonthCalendar/>
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
  }
});
export default CreateWorkout;