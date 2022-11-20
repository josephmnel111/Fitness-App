import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';


const Workout = ({ workout }) => {

    const [isActive, setIsActive] = useState(false);

    const buttonPress = () => {
        if (isActive == true){
            setIsActive(false)
        } else {
            setIsActive(true)
        }
    }

    
    const styles = StyleSheet.create({
        overlayContainer: {
            backgroundColor: "#000000",
            borderRadius: 20,
            margin: 16,
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
            fontSize: 18,
            color: "#FFB800"
        },
        workoutValues: {
            fontSize: 18,
            color: "white"
        },
        addButton: {
            backgroundColor: "#FFB800",
            width: 100,
            alignItems: "center",
            borderRadius: 20
        },
        buttonText: {
            fontSize: 20
        },
        checkmark: {
            alignSelf: "center",
            color: "white",
            fontSize: 36,
            opacity: isActive? 1: 0,
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
            <LinearGradient 
                style = {styles.workoutContainer}
                colors={['#545F7E', '#334160']}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
            >
                <View>
                    <Text style = {styles.workoutName}>Name: {workout.Name}</Text>
                    <Text style = {styles.workoutValues}>Reps:{workout.Reps}</Text>
                    <Text style = {styles.workoutValues}>Sets: {workout.Sets}</Text>
                    <Text style = {styles.workoutValues}>Weight: {workout.Weight}</Text>
                </View>
                <View style = {styles.buttonContainer}>
                    <TouchableOpacity
                        style = {styles.addButton}
                        onPress = {buttonPress}
                    >
                        <Text style = {styles.buttonText}>+ ADD</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
        
    )
}


export default Workout