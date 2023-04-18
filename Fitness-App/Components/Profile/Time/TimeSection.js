import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { useState } from 'react';



const TimeSection = ( {chooseTime, displayWorkoutContainer} ) => {

    const [thirtyDayState, setThirtyDayState] = useState("inactive");
    const [ninetyDayState, setNinetyDayState] = useState("inactive");
    const [oneYearState, setOneYearState] = useState("inactive");
    const [allTimeState, setAllTimeState] = useState("active");

    const getCurrentDay = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        return month + '/' + date + '/' + year
    }

    const ThirtyDays = () => {
        setThirtyDayState("active")
        setNinetyDayState("inactive")
        setOneYearState("inactive")
        setAllTimeState("inactive")
        chooseTime(30)
    }

    const NinetyDays = () => {
        setThirtyDayState("inactive")
        setNinetyDayState("active")
        setOneYearState("inactive")
        setAllTimeState("inactive")
        chooseTime(90)
    }

    const OneYear = () => {
        setThirtyDayState("inactive")
        setNinetyDayState("inactive")
        setOneYearState("active")
        setAllTimeState("inactive")
        chooseTime(365)
    }

    const AllTime = () => {
        setThirtyDayState("inactive")
        setNinetyDayState("inactive")
        setOneYearState("inactive")
        setAllTimeState("active")
        chooseTime(99999)

    }
    return (
        <View style = {styles.container}>
            <View style = {styles.timeContainer}>
                <TouchableOpacity style = {[styles.timeButton, {backgroundColor: thirtyDayState == "active" ? "#1D65E1" : "#1D1E24"}]}>
                    <Text style = {styles.text} onPress = {() =>ThirtyDays()} >30 D</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.timeButton, {backgroundColor: ninetyDayState == "active" ? "#1D65E1" : "#1D1E24"}]} onPress = {() =>NinetyDays()}>
                    <Text style = {styles.text}>90 D</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.timeButton, {backgroundColor: oneYearState == "active" ? "#1D65E1" : "#1D1E24"}]} onPress = {() =>OneYear()}>
                    <Text style = {styles.text}>1 Y</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.timeButton, {backgroundColor: allTimeState == "active" ? "#1D65E1" : "#1D1E24"}]} onPress = {() =>AllTime()}>
                    <Text style = {styles.text}>All</Text>
                </TouchableOpacity>
            </View>
            <View style = {styles.optionsItem}>
                      <TouchableOpacity style = {styles.optionsButton} onPress = {() =>displayWorkoutContainer()}>
                          <Text style = {styles.text}>More Options</Text>
                      </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#18181C',
        justifyContent: 'center',
        alignItems: 'center',
        width: 320,
        height: 110,
        margin: 15,
        padding: 5,
        borderRadius: 20
    },
    timeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    text: {
        color: 'white',
        alignSelf: 'center'
    },
    optionsItem: {
        flex: 1,
    },
    timeButton: {
       justifyContent: 'center',
       borderColor: 'white',
       borderWidth: .8,
       borderRadius: 15,
       height: 30,
       width: 55,
       margin: 10
     },
     optionsButton: {
        backgroundColor: '#1D1E24',
        borderColor: 'white',
        borderWidth: .8,
        justifyContent: 'center',
        borderRadius: 15,
        height: 30,
        width: 110,
     }
})
export default TimeSection;