import {View, Text, TouchableOpacity} from "react-native"
import {useState, useEffect} from "react"

const Days = ({value, updateActiveDates}) => {

    const [days, setDays] = useState([])

    const getDate = (day) => {
        const d = new Date()
        let month = d.getMonth()
        let year = d.getFullYear()
        month = month + 1
        let fullDate = month + "/" + day.value + "/" + year
        return fullDate
    }

    useEffect(() => {
        let dayArray = []
        let counter = 0
        value.forEach((val) => {
            const dayObject = {id: counter, value: val, isActive: false}
            dayArray.push(dayObject)
            ++counter
        })
        setDays(dayArray)
    }, [])



    const handleInput = (day) => {
        let dateValue = getDate(day)
        if (day.value != "") {
            if (day.isActive) {
                day.isActive = false
                updateActiveDates(dateValue, false)
            }
            else {
                day.isActive = true
                updateActiveDates(dateValue, true)
            }
        }
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