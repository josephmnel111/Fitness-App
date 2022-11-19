import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Workout = ({ workout }) => {
    return (
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
                >
                    <Text style = {styles.buttonText}>+ ADD</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    workoutContainer: {
        padding: 8,
        margin: 16,
        borderRadius: 20,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    buttonContainer: {
        justifyContent: "center",
        width: 50
    },
    workoutName: {
        fontSize: 18,
        color: "#ffff57"
    },
    workoutValues: {
        fontSize: 18,
        color: "white",
    },
    addButton: {
        backgroundColor: "#FFB800",
        width: 50
    },
    buttonText: {
        fontSize: 20
    }
});

export default Workout