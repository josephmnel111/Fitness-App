import React from "react";
import { View, Button, Text, TouchableOpacity,  StyleSheet } from "react-native";
import Week from "./Calendar/Week"
import Month from "./Calendar/Month"
const CreateWorkout = ({navigation}) => {
  return (
    <View>
      <Text style = {styles.textInput}>Lifting Page</Text>
      <TouchableOpacity
        style = {styles.touchable} 
        onPress = {() => navigation.navigate('Workout Input')}
      >
        <Text style = {styles.touchableText}>Create Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style = {styles.touchable} 
      >
        <Text style = {styles.touchableText}>Schedule Workout</Text>
      </TouchableOpacity>
      <Text style = {styles.textInput}>Workout Schedule</Text>
      <Week/>
      <Month/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    display: "flex"
  },
  textInput: {
    alignSelf: "center",
    color: "#00308F",
    fontSize: 20
  },
  touchable: {
    backgroundColor: "#00308F",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 12
  },
  touchableText: {
    color: "white",
    fontSize: 20
  },
  input: {
    backgroundColor: "white",
    float: "right"
  }
});
export default CreateWorkout;