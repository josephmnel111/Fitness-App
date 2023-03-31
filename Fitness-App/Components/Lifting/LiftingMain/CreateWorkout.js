import {useEffect, useState} from "react";
import { View, Text, TouchableOpacity,  StyleSheet, ScrollView } from "react-native";
import MonthCalendar from "../../../Utils/GetScheduledWorkoutsCalendar/MonthCalendar.js";




const CreateWorkout = ({navigation}) => {

  return (
    <ScrollView style = {styles.container}>
      <Text style = {styles.textInput}>Workout Schedule</Text>
      <MonthCalendar/>
      <TouchableOpacity
        style = {styles.touchable} 
        onPress = {() => navigation.navigate('Workout Input')}
      >
        <Text style = {styles.touchableText}>Create Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style = {styles.touchable} 
        onPress = {() => navigation.navigate('Schedule Workout')}
      >
        <Text style = {styles.touchableText}>Schedule Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2D3856", //Grey
    overflow: "scroll",
    padding: 10,
    flex: 1
  },
  textInput: {
    alignSelf: "center",
    color: "white",
    fontSize: 20
  },
  touchable: {
    backgroundColor: "#FFB800", //yellow
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 12
  },
  touchableText: {
    color: "black",
    fontSize: 20
  },
  input: {
    backgroundColor: "white",
    float: "right"
  }
});
export default CreateWorkout;