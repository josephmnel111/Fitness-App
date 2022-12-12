import {View, Text} from "react-native"
import {useState, useEffect, useContext} from "react"
import moment from "moment"
import Days from "./Days"




const MonthCalendar = ({updateActiveDates}) => {
    const [dayNames, setDayNames] = useState([])
    const [monthDayNumbers, setMonthDayNumbers] = useState([])
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
        setMonthDayNumbers(calendarVals)
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
            console.log(i)
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
                            <Days key = {week} value = {week} updateActiveDates = {updateActiveDates}></Days>
                        ))
                    }
                </View>
            }
        
        </View>
    )




}


export default MonthCalendar;