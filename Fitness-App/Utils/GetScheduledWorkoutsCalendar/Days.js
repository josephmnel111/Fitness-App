import {View, Text, TouchableOpacity, Modal, StyleSheet} from "react-native"
import {useState, useEffect} from "react"
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

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
                console.log(value)
                tempArray.push({Name: value.Name, Reps: value.Reps, Sets: value.Sets, Weight: value.Weight})
            })
            setModalWorkouts(tempArray)
            setModalVisibility(true)
        }

    }


    useEffect(() => {
        let dayArray = []
        let counter = 0
        props.value.forEach((propValue) => {
            const dayObject = {id: counter, isActive: propValue.isActive, value: propValue.dayNumber, data: propValue.data}
            dayArray.push(dayObject)
            ++counter
        })
        setDays(dayArray)
        /*value.forEach((val) => {
            const dayObject = {id: counter, value: val, isActive: false}
            dayArray.push(dayObject)
            ++counter
        })
        setDays(dayArray)*/
    }, [])

    return (
        <View>
            <Modal visible = {modalVisibility}>
                <View style = {{flex: 1, backgroundColor: "#2D3856"}}>
                <FontAwesome5 
                    name="times-circle"
                    style = {styles.closingMark}
                    onPress = {closeModal}
                />
                    {
                        modalWorkouts.map((workout) => (
                            <View key = {workout.Name} style = {styles.overlayContainer}>
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
                                            style = {styles.editButton}
                                        >
                                            <Text style = {styles.buttonText}>Edit Workout</Text>
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            </View>
                        ))
                    }
                </View>
            </Modal>
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
            {
                days.map((day) => (
                    <TouchableOpacity key = {day.id} onPress = {() =>handleClick(day)} style={{ flex: 1, alignSelf: 'stretch' }}>                   
                        <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: day.isActive? "#FFB800":"#2D3856"}}>
                            <Text style = {{textAlign: "center", color: day.isActive? "black": "white"}}>{day.value}</Text>
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
        backgroundColor: "#000000",
        borderRadius: 20,
        margin: 16,
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
    }
})

export default Days;