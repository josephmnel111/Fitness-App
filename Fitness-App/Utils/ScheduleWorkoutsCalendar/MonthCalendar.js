import {View, StyleSheet, Text, TouchableOpacity} from "react-native"
import {useState, useEffect, useContext} from "react"
import moment from "moment"
import Days from "./Days"

const day = new Date()
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
]
let month = day.getMonth()
month = month + 1
let year = day.getFullYear()
let currentCalendarMonth = monthNames[day.getMonth()]
let currentCalendarYear = day.getFullYear()

const MonthCalendar = ({updateActiveDates}) => {
    const [dayNames, setDayNames] = useState([])
    const [mapMonthDayNumbers, setMapMonthDayNumbers] = useState([])
    const [calendarMonth, setCalendarMonth] = useState(monthNames[day.getMonth()])
    const [calendarYear, setCalendarYear] = useState(day.getFullYear())
   // const user = useContext(UserContext)

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

    useEffect(() => {
        createCalendar()
        
    }, [])

    const getMonthNum = () => {
        let monthNum = -1
        for (let i = 0; i < monthNames.length; ++i) {
            if (monthNames[i] == currentCalendarMonth) {
                monthNum = i
            }
        }
        return monthNum

    }

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

    const createCalendar = () => {
        setDayNames(moment.weekdaysShort())
        let calendarVals = []
        let weekNumbers = []
        let dayCounter = 1
        let counter = 0
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
        let newCalendar = []
        for (let i = 0; i < calendarVals.length; ++i) {
            newCalendar.push({value: calendarVals[i], key: i})
        }
        setMapMonthDayNumbers(newCalendar)

    }

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
                        mapMonthDayNumbers.map((week) => (// This will render a row for each data element.
                            <Days key = {week.key} value = {week.value} updateActiveDates = {updateActiveDates} month = {(getMonthNum() + 1)} year = {currentCalendarYear}></Days>
                        ))
                    }
                </View>
            }
        
        </View>
    )
}

const styles = StyleSheet.create({
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