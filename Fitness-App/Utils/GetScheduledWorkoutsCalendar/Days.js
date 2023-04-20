import {View, Text, TouchableOpacity, Modal, StyleSheet} from "react-native"
import {useState, useEffect} from "react"

const Days = (props) => {
    
    const [days, setDays] = useState([])
    const [modalVisibility, setModalVisibility] = useState(false)
    const [modalWorkouts, setModalWorkouts] = useState([])

    const closeModal = () => {
        setModalVisibility(false)
    }

    const handleClick = (day) => {
        if(day.isActive == true) {
            let tempArray = []
            day.data.forEach((value) => {
                tempArray.push({Name: value.Name, Reps: value.Reps, Sets: value.Sets, Weight: value.Weight})
            })
            setModalWorkouts(tempArray)
            setModalVisibility(true)
        }

    }


    useEffect(() => {
        let counter = 0
        let dayArray = []
        props.value.forEach((propValue) => {
            const dayObject = {id: counter, isActive: propValue.isActive, value: propValue.dayNumber, data: propValue.data}
            dayArray.push(dayObject)
            ++counter
        })
        setDays(dayArray)
    }, [props.value])

    return (
        <View>
            <Modal visible = {modalVisibility}>
                <View style = {{backgroundColor: "#1D1E24"}}>
                    <Text>Workouts for Date</Text>
                </View>
                <View style = {{flex: 1, backgroundColor: "#1D1E24"}}>
                    {
                        modalWorkouts.map((workout) => (
                            <View key = {workout.Name} style = {styles.overlayContainer}>
                                    <View>
                                        <Text style = {styles.workoutName}>Name: {workout.Name}</Text>
                                        <Text style = {styles.workoutValues}>Reps:{workout.Reps}</Text>
                                        <Text style = {styles.workoutValues}>Sets: {workout.Sets}</Text>
                                        <Text style = {styles.workoutValues}>Weight: {workout.Weight}</Text>
                                    </View>
                                    <View style = {styles.buttonContainer}>
                                        <TouchableOpacity
                                            style = {styles.editButton}
                                        >
                                            <Text style = {styles.buttonText}>Edit Workout</Text>
                                        </TouchableOpacity>
                                    </View>
                            </View>
                        ))
                    }
                    <TouchableOpacity
                        style = {styles.cancelButton} 
                        onPress = {closeModal}
                    >
                        <Text style = {styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <View style={{ flex: 1, alignSelf: 'center', flexDirection: 'row'}}>
            {
                days.map((day) => (
                    <TouchableOpacity key = {day.id} onPress = {() =>handleClick(day)} style={{ flex: 1, alignSelf: 'stretch' }}>                   
                        <View style={{ flex: 1, alignSelf: 'center', backgroundColor: day.isActive? "#1D65E1":"#18181C", borderRadius: 100, height: 30, width: 30, justifyContent: 'center'}}>
                            <Text style = {{textAlign: "center", color: "white"}}>{day.value}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
            </View>
        </View>
        
    )

}


const styles = StyleSheet.create({
    buttonText: {
        fontSize: 18
    },
    closingMark: {
        color: "white",
        fontSize: 25,
        alignSelf: "flex-end",
        margin: 10
    },
    editButton: {
        backgroundColor: "#FFB800",
        width: 120,
        alignItems: "center",
        borderRadius: 20
    },
    overlayContainer: {
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
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    touchable: {
        backgroundColor: "#FFB800", //yellow
        alignItems: "center",
        padding: 10,
        margin: 10,
        borderRadius: 12
      },
      touchableText: {
        color: "black",
        fontSize: 20
      },
      workoutName: {
        fontSize: 18,
        color: "#FFB800"
     },
      workoutValues: {
        fontSize: 18,
        color: "white"
     },
     buttonContainer: {
        justifyContent: "center",
        marginLeft: "auto",
        marginRight: 10
    },
    cancelButton: {
        alignItems: "center",
        borderColor: 'white',
        borderWidth: 2,
        padding: 10,
        margin: 10,
        borderRadius: 12
      },
      cancelButtonText: {
        color: "white",
        fontSize: 20
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
})

export default Days;