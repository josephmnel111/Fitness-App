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
        activeButton = e.label
    }

    return (
        <View style = {styles.container}>
            <View>
                <Text style = {styles.title}>Choose Workout History</Text>
            </View>
            <RadioButtonRN
                data={containerWorkoutArray}
                initial={initialValue}
                activeColor={"#1D65E1"}
                boxActiveBgColor={"#1D1E24"}
                boxDeactiveBgColor={"#1D1E24"}
                textColor={"white"}
                selectedBtn={(e) => changeActiveButton(e)}
            />
            <View style = {styles.buttonContainer}>
                <TouchableOpacity style = {styles.button} onPress = {() => handleSubmit()}>
                    <Text style = {styles.text}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.button} onPress = {() => props.displayWorkoutContainer()}>
                    <Text style = {styles.text}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1D1E24',
        padding: 10
    },
    text: {
        color: "white"
    },
    button: {
        backgroundColor: '#1D1E24',
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        height: 30,
        width: 110,
        margin: 15
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        color: 'white',
        alignSelf: 'center'
    }
})

export default WorkoutContainerSection;