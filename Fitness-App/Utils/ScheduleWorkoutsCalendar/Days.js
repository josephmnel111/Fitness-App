import {View, Text, TouchableOpacity} from "react-native"
import {useState, useEffect} from "react"

let activeDates = []

const Days = ({value, updateActiveDates, month, year}) => {

    const [days, setDays] = useState([])

    const getDate = (day) => {
        let fullDate = month + "/" + day.value + "/" + year
        return fullDate
    }

    useEffect(() => {
        let dayArray = []
        let counter = 0
        value.forEach((val) => {
            let currentValue = month + '/' + val + '/' + year 
            if (activeDates.indexOf(currentValue) >= 0) {//If the day has been activated (clicked) then it should be colored
                const dayObject = {id: counter, value: val, isActive: true}
                dayArray.push(dayObject)
            }  else {
                const dayObject = {id: counter, value: val, isActive: false}
                dayArray.push(dayObject)
            }
            ++counter
        })
        setDays(dayArray)
    }, [value])



    const handleInput = (day) => {
        let dateValue = getDate(day)
        if (day.value != "") {
            if (day.isActive) {
                day.isActive = false
                const index = activeDates.indexOf(dateValue);
                activeDates.splice(index, 1)
                updateActiveDates(dateValue, false)
            }
            else {
                day.isActive = true
                activeDates.push(dateValue)
                updateActiveDates(dateValue, true)
            }
        }
        //This code changes the day array to include the previous values, the now highlighted value, then the values after
        let beginArray = days.slice(0, day.id)
        beginArray.push(day)
        if (day.id == days.length - 1) { //If the day is the last in the array
            setDays(beginArray)
        } else {
            let endArray = days.slice(day.id + 1)
            setDays([...beginArray, ...endArray])
        }
    }

    return (
        <View style={{ flex: 1, alignSelf: 'center', flexDirection: 'row' }}>
            {
                days.map((day) => (
                    <TouchableOpacity key = {day.id} onPress = {() =>handleInput(day)} style={{ flex: 1, alignSelf: 'stretch' }}>                   
                         <View style={{ flex: 1, alignSelf: 'center', backgroundColor: day.isActive? "#1D65E1": "#18181C", borderRadius: 100, height: 30, width: 30, justifyContent: 'center'}}>
                            <Text style = {{textAlign: "center", color: "white"}}>{day.value}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
        </View>
    )

}

export default Days;