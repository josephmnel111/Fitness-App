import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect } from 'react';

const Workout = ({workout, updateActiveWorkouts}) => {
    const [isActive, setIsActive] = useState(false);

    const buttonPress = () => {
        if (isActive == true){
            setIsActive(false)
            updateActiveWorkouts(workout, false)
        } else {
            setIsActive(true)
            updateActiveWorkouts(workout, true)
        }
    }
    const styles = StyleSheet.create({
        overlayContainer: {
            backgroundColor: isActive ? "black": "#18181C",
            flexDirection: 'row',
            borderRadius: 20,
            borderRadius: 20,
            borderColor: 'white',
            borderWidth: 2,
            margin: 16,
            padding: 10,
            justifyContent: "center"
        },
        workoutContainer: {
            display: "flex",
            opacity: isActive ? .5: 1,
            padding: 10,
            borderRadius: 20,
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        buttonContainer: {
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: 10
        },
        workoutName: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18
        },
        workoutValues: {
            fontSize: 18,
            color: "white"
        },
        addButton: {
            width: 100,
            alignItems: "center",
            borderRadius: 20,
            borderColor: 'white',
            borderWidth: 2,
            borderRadius: 15,
        },
        buttonText: {
            color: 'white',
            fontSize: 20
        },
        checkmark: {
            alignSelf: "center",
            color: "white",
            fontSize: 36,
            opacity: isActive ? 1: 0,
            position: "absolute",
            zIndex: 1
        }
    });
    
/*
*/
    return (
        <View style = {styles.overlayContainer}>
            <FontAwesome5
                name = "check-circle"
                style = {styles.checkmark}
            />
                <View>
                    <Text style = {styles.workoutName}>{workout.Name}</Text>
                    <Text style = {styles.workoutValues}>Reps:{workout.Reps}</Text>
                    <Text style = {styles.workoutValues}>Sets: {workout.Sets}</Text>
                    <Text style = {styles.workoutValues}>Weight: {workout.Weight}</Text>
                </View>
                <View style = {styles.buttonContainer}>
                    <TouchableOpacity
                        style = {styles.addButton}
                        onPress = {buttonPress}
                    >
                        <Text style = {styles.buttonText}>{isActive ? "- Remove" : "+ Add"}</Text>
                    </TouchableOpacity>
                </View>
        </View>
        
    )
    
}



export default Workout