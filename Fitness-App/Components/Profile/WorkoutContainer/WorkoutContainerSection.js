import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import RadioButtonRN from 'radio-buttons-react-native'



const WorkoutContainerSection = (props) => {
    let initialValue = 1
    let activeButton = ""
    let tempArray = ["Steps"]
    let containerWorkoutArray = [{
        label: "Steps"
    }]
    for (let i = 0; i < props.workoutData.length; ++i) {
        if (!tempArray.includes(props.workoutData[i].Name)) {
            containerWorkoutArray.push({label: props.workoutData[i].Name})
            tempArray.push(props.workoutData[i].Name)
        }
    }
    for (let i = 0; i < tempArray.length; ++i) {
        if (tempArray[i] == props.activeWorkout) {
            initialValue = i + 1
        }
    }

    const handleSubmit = () => {
        props.displayWorkoutContainer()
        props.handleActiveWorkout(activeButton)
    }

    const changeActiveButton = (e) => {
        console.log(e)
        activeButton = e.label
    }

    return (
        <View >
            <RadioButtonRN
                data={containerWorkoutArray}
                initial = {initialValue}
                boxActiveBgColor={"white"}
                selectedBtn={(e) => changeActiveButton(e)}
            />
            
            <TouchableOpacity style = {styles.button} onPress = {() => handleSubmit()}>
                <Text style = {styles.text}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.button} onPress = {() => props.displayWorkoutContainer()}>
                <Text style = {styles.text}>Cancel</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    text: {
        color: "white"
    },
    button: {
        backgroundColor: '#1D65E1',
        justifyContent: 'center',
        borderRadius: 15,
        height: 30,
        width: 60,
        margin: 10
    },
})

export default WorkoutContainerSection;