import React from "react";
import { View, TouchableOpacity, Text, TextInput,  StyleSheet } from "react-native";

const WorkoutInput = ({navigation}) => {
  return (
      <View style = {styles.container}>
        <Text style = {styles.textInput}>
          Workout Input Screen
        </Text>

          <View style = {styles.inputContainer}>
              <Text style = {styles.inputValues}>Type:</Text>
              <TextInput style = {styles.input}/>
          </View>
          <View style = {styles.inputContainer}>
              <Text style = {styles.inputValues}>Reps:</Text>
              <TextInput style = {styles.input} keyboardType = "numeric"/>
          </View>
          <View style = {styles.inputContainer}>
              <Text style = {styles.inputValues}>Sets:</Text>
              <TextInput style = {styles.input} keyboardType = "numeric"/>
          </View>
          <View style = {styles.inputContainer}>
              <Text style = {styles.inputValues}>Weight:</Text>
              <TextInput style = {styles.input} keyboardType = "numeric"/>
          </View> 
          <TouchableOpacity
            style = {styles.touchable} 
            onPress = {() => navigation.navigate('Create Workout')}
          > 
            <Text style = {styles.touchableText}>Create Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style = {styles.touchable} 
          >
            <Text style = {styles.touchableText}>Schedule Workout</Text>
          </TouchableOpacity>
      </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    margin: 10
  },
  inputContainer: {
    backgroundColor: "#00308F",
    margin: 5,
    borderRadius: 12
  },
  input: {
    backgroundColor: "white",
    margin: 6,
    borderRadius: 12
  },
  inputValues: {
    color: "white",
    margin: 5,
    fontSize: 15
  },
  textInput: {
    alignSelf: "center",
    fontSize: 20,
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
});
export default WorkoutInput;