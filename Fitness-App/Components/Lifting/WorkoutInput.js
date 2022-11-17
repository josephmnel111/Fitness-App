import React, {useState, useEffect} from "react";
import { View, TouchableOpacity, Text, TextInput,  StyleSheet, Alert} from "react-native";

const WorkoutInput = ({navigation}) => {
  
  const [name, setName] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [weight, setWeight] = useState('');


  const postWorkout = async () => {

    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name, reps: reps, sets: sets, weight: weight})
      }
      console.log(requestOptions.body)
      await fetch("http://192.168.0.10:3000/input", requestOptions)
      .then(response => {
        response.json()
        .then(data => {
          Alert.alert("Post Created")
        })
      })
    } catch (error) {
      console.log(error);
    }
  }


  return (
      <View style = {styles.container}>
        <Text style = {styles.textInput}>
          Workout Input Screen
        </Text>

          <View style = {styles.inputContainer}>
              <Text style = {styles.inputValues}>Name:</Text>
              <TextInput 
                style = {styles.input}
                onChangeText={(val) => setName(val)}
              />
          </View>
          <View style = {styles.inputContainer}>
              <Text style = {styles.inputValues}>Reps:</Text>
              <TextInput 
                style = {styles.input} 
                keyboardType = "numeric"
                onChangeText={(val) => setReps(val)}
              />
          </View>
          <View style = {styles.inputContainer}>
              <Text style = {styles.inputValues}>Sets:</Text>
              <TextInput 
                style = {styles.input} 
                keyboardType = "numeric"
                onChangeText={(val) => setSets(val)}
              />
          </View>
          <View style = {styles.inputContainer}>
              <Text style = {styles.inputValues}>Weight:</Text>
              <TextInput 
                style = {styles.input} 
                keyboardType = "numeric"
                onChangeText={(val) => setWeight(val)}
              />
          </View> 
          <TouchableOpacity
            style = {styles.touchable} 
            onPress = {postWorkout}
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