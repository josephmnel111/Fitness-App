import {View, Text, StyleSheet} from "react-native"
import {useState, useEffect} from "react"
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment"
import Days from "./Days"

const getSchedule = async ()  => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    //This can change, need to figure this out eventually
    const res = await fetch("http://192.168.0.5:3000/schedule-input", requestOptions)
    return res.json();
  }


const MonthCalendar = (props) => {
    const {data, status} = useQuery(["schedules"], getSchedule);
    const [dayNames, setDayNames] = useState([])
    const [monthDayNumbers, setMonthDayNumbers] = useState([])
    const [dates, setDates] = useState([])


    const createCalendar = () => {

        setDayNames(moment.weekdaysShort())
        let calendarVals = []
        let weekNumbers = []
        let dayCounter = 1
        let counter = 0
        let idCounter = 0
        let weekIdCounter = 0
        for (let i = 0; i < firstDayOfMonth(); ++i) {
            weekNumbers.push('')
            ++counter
        }
        for (let i = 0; i < getDaysInCurrentMonth(); ++i) {
            if (counter < 7) {
                weekNumbers.push(`${dayCounter}`)
                ++counter
            } else {
                calendarVals.push(weekNumbers)
                weekNumbers = []
                weekNumbers.push(`${dayCounter}`)
                counter = 1
            }
            ++dayCounter
        }
        if (weekNumbers != []) {
            calendarVals.push(weekNumbers)
        }
        let dateWorkoutValues = []
        if (data != undefined) {
        data.sort(function(a,b) {
            return new Date(a.Date) - new Date(b.Date)
        })
        let dataCounter = 0
        calendarVals.forEach((week) => {
            let weekArray = []
            week.forEach((day) => {
                let dataArray = []
                if (data[dataCounter] != undefined) {
                    let dateValue = data[dataCounter].Date
                    let dayValue = dateValue.substring(dateValue.indexOf("/") + 1, dateValue.lastIndexOf("/"))
                    if (dayValue == day) {
                        while ((dayValue == day) && (data[dataCounter] != undefined)) {
                            dataArray.push(data[dataCounter])
                            ++dataCounter
                            if (data[dataCounter] != undefined) {
                                let dateValue = data[dataCounter].Date
                                dayValue = dateValue.substring(dateValue.indexOf("/") + 1, dateValue.lastIndexOf("/"))
                            }
                        }
                        weekArray.push({id: idCounter, dayNumber: day, isActive: true, data: dataArray})
                        ++idCounter
                    } else {
                        weekArray.push({id: idCounter, dayNumber: day, isActive: false, data: {Schedule_ID: -1, Workout_ID: -1, Date: ''}})
                        ++idCounter
                    }
                } else {
                    weekArray.push({id: idCounter, dayNumber: day, isActive: false, data: {Schedule_ID: -1, Workout_ID: -1, Date: ''}})
                    ++idCounter
                    
                }
            })
            dateWorkoutValues.push({weekId: weekIdCounter, week: weekArray})
            ++weekIdCounter
        })
        }
        setMonthDayNumbers(dateWorkoutValues)
    }

    useEffect(() => {
        createCalendar()
    }, [data])

    let weekdayshort = moment.weekdaysShort();

    const getDaysInCurrentMonth = () => {
        const date = new Date()
        return new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDate()
    }

    const firstDayOfMonth = () => {
        let dateObject = moment()
        let firstDay = moment(dateObject)
        .startOf("month")
        .format("d");
        return firstDay
    }
    
    const handlePress = () => {
        console.log("press")
    }
    /*

                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                        {
                            dayNames.map((dayName) => (
                                <View key = {dayName} style={{ flex: 1, alignSelf: 'stretch' }}><Text style = {{textAlign: "center", color: "white"}}>{dayName}</Text></View>
                            ))
                        }
                    </View>
                    {
                        monthDayNumbers.map((week) => (// This will render a row for each data element.
                            <Days key = {week} value = {week}></Days>
                        ))
                    }
    */
    if (status === 'loading') {
        return (
            <View style = {styles.loadingContainer}>
                <Text style = {styles.textInput}>Data is Loading...</Text>
            </View>
        )
    } else if (status === 'error') {
        return (
            <View style = {styles.errorContainer}>
                <Text style = {styles.textInput}>Error Loading Data</Text>
            </View>
        ) 
    } else {
        return (
            <View>
                {
                <View>
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                        {
                            dayNames.map((dayName) => (
                                <View key = {dayName} style={{ flex: 1, alignSelf: 'stretch' }}><Text style = {{textAlign: "center", color: "white"}}>{dayName}</Text></View>
                            ))
                        }
                    </View>
                        {
                        monthDayNumbers.map((week) => (// This will render a row for each data element.
                            <Days key = {week.weekId} value = {week.week}></Days>
                        ))
                    }
                </View>
                }
                        
            </View>
        )
    }
    




}

const styles = StyleSheet.create({
  textInput: {
    alignSelf: "center",
    color: "#FFFFFF",
    fontSize: 20,
    marginTop: 25
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#2D3856",
    color: "white"
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#2D3856",
    color: "white"
  },
})

export default MonthCalendar;