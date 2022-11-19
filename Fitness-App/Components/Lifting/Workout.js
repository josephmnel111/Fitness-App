import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Workout = ({ workout }) => {
    return (
        <View style = {styles.workoutContainer}>
            <Text style = {styles.workoutName}>Name: {workout.Name}</Text>
            <Text style = {styles.workoutValues}>Reps:{workout.Reps}</Text>
            <Text style = {styles.workoutValues}>Sets: {workout.Sets}</Text>
            <Text style = {styles.workoutValues}>Weight: {workout.Weight}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    workoutContainer: {
        padding: 8,
        margin: 16,
        borderRadius: 20,
        backgroundColor: "#1b1b1b"
    },
    workoutName: {
        fontSize: 14,
        color: "#ffff57"
    },
    workoutValues: {
        color: "white"
    }
});

export default Workout