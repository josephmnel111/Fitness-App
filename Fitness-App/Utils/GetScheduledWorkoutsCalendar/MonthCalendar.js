import {View, Text, StyleSheet, TouchableOpacity} from "react-native"
import {useState, useEffect} from "react"
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import {NetworkIP} from "../../Utils/Constants/NetworkSettings"
import moment from "moment"
import Days from "./Days"

const day = new Date()
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
]
let dataStore = []
let month = day.getMonth()
month = month + 1
let year = day.getFullYear()
let currentCalendarMonth = monthNames[day.getMonth()]
let currentCalendarYear = day.getFullYear()


const getSchedule = async ()  => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    //This can change, need to figure this out eventually
    const res = await fetch(NetworkIP + "/schedule-input", requestOptions)
    return res.json();
  }


const MonthCalendar = (props) => {
    const {data, status} = useQuery(["schedules"], getSchedule);
    const [calendarMonth, setCalendarMonth] = useState(monthNames[day.getMonth()])
    const [calendarYear, setCalendarYear] = useState(day.getFullYear())
    const [dayNames, setDayNames] = useState([])
    const [monthDayNumbers, setMonthDayNumbers] = useState([])

    console.log(props)

    useEffect(() => {
        if ((props.dates != undefined) && (props.workouts != undefined)) {
            for (let i = 0; i < props.dates.length; ++i) {
                for (let j = 0; j < props.workouts.length; ++j) {
                    dataStore.push({Date: props.dates[i], Name: props.workouts[j].Name, Reps: props.workouts[j].Reps, Schedule_ID: -1, Sets: props.workouts[j].Sets, Weight: props.workouts[j].Weight, Workout_ID: props.workouts[j].Workout_ID})
                }
            }

        }
        createCalendar()
    }, [props.dates])

    /*const updateCheck = () => {
        console.log(props.dates)
    }
    updateCheck()*/

    const decreaseCalendarMonthYear = () => {
        if (currentCalendarMonth == "January") {
            currentCalendarYear = currentCalendarYear - 1
            setCalendarYear(currentCalendarYear)
        }
        let foundVal = false
        for (let i = 0; i < monthNames.length; ++i) {
            if ((currentCalendarMonth == monthNames[i]) && (foundVal == false)) {
                if (i == 0) { //If month is first month, set new month to December
                    currentCalendarMonth = "December"
                    setCalendarMonth(currentCalendarMonth)
                } else {
                    currentCalendarMonth = monthNames[i - 1]
                    setCalendarMonth(currentCalendarMonth)
                }
                foundVal = true
            }
        }
        createCalendar()
    }

    const increaseCalendarMonthYear = () => {
        if (currentCalendarMonth == "December") {
            currentCalendarYear = currentCalendarYear + 1
            setCalendarYear(currentCalendarYear)
        }
        let foundVal = false
        for (let i = 0; i < monthNames.length; ++i) {
            if ((currentCalendarMonth == monthNames[i]) && (foundVal == false)) {
                if (i == 11) { //If month is last month, set new month to January
                    currentCalendarMonth = "January"
                    setCalendarMonth(currentCalendarMonth)
                } else {
                    currentCalendarMonth = monthNames[i + 1]
                    setCalendarMonth(currentCalendarMonth)
                }
                foundVal = true
            }
        }
        createCalendar()
    }

    const getMonthNum = () => {
        let monthNum = -1
        for (let i = 0; i < monthNames.length; ++i) {
            if (monthNames[i] == currentCalendarMonth) {
                monthNum = i
            }
        }
        return monthNum

    }

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
        let lastWeekFillerVals = 7 - calendarVals[calendarVals.length - 1].length
        for (let i = 0; i < lastWeekFillerVals; ++i) {
            calendarVals[calendarVals.length - 1].push('')
        }
        let dateWorkoutValues = []
        let usefulData = []
        if (dataStore != undefined) {
            for (let i = 0; i < dataStore.length; ++i) {
                let dataDateArray = dataStore[i].Date.split('/')
                if ((dataDateArray[0] == (getMonthNum() + 1)) && (dataDateArray[2] == currentCalendarYear)) {
                    usefulData.push(dataStore[i])
                }
            }
        }
        if (usefulData != undefined) {
            usefulData.sort(function(a,b) {
                return new Date(a.Date) - new Date(b.Date)
        })
        let dataCounter = 0
        calendarVals.forEach((week) => {
            let weekArray = []
            week.forEach((day) => {
                let dataArray = []
                if (usefulData != undefined) {
                    if (usefulData[dataCounter] != undefined) { //If there is a recorded value for that date
                        let dateValue = usefulData[dataCounter].Date
                        let dayValueArray = dateValue.split('/')
                        if (dayValueArray[1].charAt(0) == '0'){
                            dayValueArray[1] = dayValueArray[1].charAt(1)
                        }
                        if (dayValueArray[1] == day) {
                            while ((dayValueArray[1] == day) && (usefulData[dataCounter] != undefined)) {
                                dataArray.push(usefulData[dataCounter])
                                ++dataCounter
                                if (usefulData[dataCounter] != undefined) {
                                    let dateValue = usefulData[dataCounter].Date
                                    dayValueArray = dateValue.split('/')
                                    if (dayValueArray[1].charAt(0) == '0'){
                                        dayValueArray[1] = dayValueArray[1].charAt(1)
                                    }
                                }
                            }
                            weekArray.push({id: idCounter, dayNumber: day, isActive: true, data: dataArray})
                            ++idCounter
                        } else {
                            //weekArray.push({id: idCounter, dayNumber: day, isActive: false, data: {Schedule_ID: -1, Workout_ID: -1, Date: ''}})
                            weekArray.push({id: idCounter, dayNumber: day, isActive: false, data: []})
                            ++idCounter
                        }
                    } else { //When there is no more data left to add onto dates
                        //weekArray.push({id: idCounter, dayNumber: day, isActive: false, data: {Schedule_ID: -1, Workout_ID: -1, Date: ''}})
                        weekArray.push({id: idCounter, dayNumber: day, isActive: false, data: []})
                        ++idCounter
                    }

                }
                
            })
            dateWorkoutValues.push({weekId: weekIdCounter, week: weekArray})
            ++weekIdCounter
        })
        }
        setMonthDayNumbers(dateWorkoutValues)
    }

    useEffect(() => {
        dataStore = data
        createCalendar()
    }, [data])

    let weekdayshort = moment.weekdaysShort();

    const getDaysInCurrentMonth = () => {
        let daysInMonth = new Date(currentCalendarYear, (getMonthNum() + 1), 0).getDate()
        return daysInMonth
    }

    const firstDayOfMonth = () => {
        let firstDay = -1
        let monthNum = getMonthNum()
        let value = new Date(currentCalendarYear, monthNum, 1)
        let stringValue = String(value)
        let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        for (let i = 0; i< daysOfWeek.length; ++i) {
            if (daysOfWeek[i] == stringValue.substring(0, 3)) {
                firstDay = i
            }
        }
        return firstDay
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
            <View style = {styles.calendarContainer}>
                {
                <View>
                    <View style = {styles.calendarHeader}>
                        <TouchableOpacity onPress = {() =>decreaseCalendarMonthYear()}>
                            <Text style = {styles.calendarHeaderText}>{'   <   '}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style ={styles.calendarHeaderText}>{calendarMonth + " " + calendarYear}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress = {() =>increaseCalendarMonthYear()}>
                            <Text style = {styles.calendarHeaderText}>{'   >   '}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.daysOfWeekContainer}>
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
    backgroundColor: "#1D1E24",
    color: "white"
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#1D1E24",
    color: "white"
  },
  calendarContainer: {
    backgroundColor: '#18181C',
    borderRadius: 20,
    margin: 10
 },
 daysOfWeekContainer: {
     flex: 1, 
     alignSelf: 'stretch', 
     flexDirection: 'row' 
 },
 calendarHeaderText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 20
 },
 calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    margin: 10
 }
})

export default MonthCalendar;