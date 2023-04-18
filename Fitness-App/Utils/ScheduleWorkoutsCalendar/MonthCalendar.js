import {View, StyleSheet, Text, TouchableOpacity} from "react-native"
import {useState, useEffect, useContext} from "react"
import moment from "moment"
import Days from "./Days"

const day = new Date()
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
]
let month = day.getMonth()
let year = day.getFullYear()

const MonthCalendar = ({updateActiveDates}) => {
    const [dayNames, setDayNames] = useState([])
    const [mapMonthDayNumbers, setMapMonthDayNumbers] = useState([])
   // const user = useContext(UserContext)


    useEffect(() => {
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
    }, [])

    let weekdayshort = moment.weekdaysShort();

    const getDaysInCurrentMonth = () => {
        const date = new Date()
        return new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDate()
    }

    const getWeekDays = () => {
        console.log(weekdayshort)
    }


    const getBlankDays = () => {
        let blanks = []
        for (let i = 0; i < firstDayOfMonth(); i++) {
            blanks.push(
                <td>{""}</td>
            )
        }
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

    return (
        <View style = {styles.calendarContainer}>
            {
                <View>
                    <View style = {styles.calendarHeader}>
                        <TouchableOpacity>
                            <Text style = {styles.calendarHeaderText}>{'<   '}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style ={styles.calendarHeaderText}>{monthNames[day.getMonth()]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style = {styles.calendarHeaderText}>{'   >'}</Text>
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
                            <Days key = {week.key} value = {week.value} updateActiveDates = {updateActiveDates}></Days>
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