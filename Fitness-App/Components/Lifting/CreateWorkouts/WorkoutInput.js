import React, {useState, useEffect} from "react";
import { View, TouchableOpacity, Text, TextInput,  StyleSheet, Alert, ScrollView} from "react-native";
import {NetworkIP} from "../../../Utils/Constants/NetworkSettings";


const WorkoutInput = ({navigation}) => {
  
  const [name, setName] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [weight, setWeight] = useState('');

  const cancelSwitchScreens = () => {
    navigation.navigate('Create Workout')
  }

  const switchScreens = () => {
    navigation.navigate({
      name: 'Create Workout',
      params: { 
        actionType: 'create'
      },
      merge: true,
    });
  }

  const postWorkout = async () => {
    if ((name != '') && (reps != '') && (sets != '') && (weight != '')) {
      switchScreens()
      try {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name: name, reps: reps, sets: sets, weight: weight})
        }
        console.log(requestOptions.body)
        await fetch(NetworkIP + "/workout-input", requestOptions)
        .then(response => {
          response.json()
          .then(data => {
            Alert.alert("Post Created")
          })
        })
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('invalid input')
    }
  }


  return (
    <ScrollView>
      <View style = {styles.mainContainer}>
      <Text style = {styles.title}>
        Create New Workout
        </Text>

          <View style = {styles.inputContainer}>
              <Text style = {styles.inputTitles}>Name:</Text>
              <TextInput 
                style = {styles.input}
                onChangeText={(val) => setName(val)}
              />
          </View>
          <View style = {styles.inputContainer}>
              <Text style = {styles.inputTitles}>Reps:</Text>
              <TextInput 
                style = {styles.input} 
                keyboardType = "numeric"
                onChangeText={(val) => setReps(val)}
              />
          </View>
          <View style = {styles.inputContainer}>
              <Text style = {styles.inputTitles}>Sets:</Text>
              <TextInput 
                style = {styles.input} 
                keyboardType = "numeric"
                onChangeText={(val) => setSets(val)}
              />
          </View>
          <View style = {styles.inputContainer}>
              <Text style = {styles.inputTitles}>Weight:</Text>
              <TextInput 
                style = {styles.input} 
                keyboardType = "numeric"
                onChangeText={(val) => setWeight(val)}
              />
          </View> 
          <TouchableOpacity
            style = {styles.button} 
            onPress = {postWorkout}
          > 
            <Text style = {styles.buttonText}>Create Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style = {styles.button} 
            onPress = {cancelSwitchScreens}
          >
            <Text style = {styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
      </View>
    </ScrollView>
      
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#1D1E24"
  },
  inputContainer: {
    backgroundColor: "#1D1E24",
    margin: 10
  },
  input: {
    backgroundColor: "#1D1E24",
    borderWidth: 2,
    borderColor: "white",
    color: "white",
    fontSize: 16,
    borderRadius: 12,
    padding: 10,
    margin: 10,
    borderRadius: 12
  },
  inputTitles: {
    color: "white",
    margin: 5,
    fontSize: 18
  },
  title: {
    alignSelf: "center",
    fontSize: 24,
    margin: 10,
    color: "white"
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
  }
});
export default WorkoutInput;