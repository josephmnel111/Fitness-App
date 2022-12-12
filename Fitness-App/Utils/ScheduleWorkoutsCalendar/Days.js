import {View, Text, TouchableOpacity} from "react-native"
import {useState, useEffect} from "react"

const Days = ({value, updateActiveDates}) => {

    const [days, setDays] = useState([])

    const getDate = (day) => {
        const d = new Date()
        let month = d.getMonth()
        let year = d.getFullYear()
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
        if (day.isActive) {
            day.isActive = false
            updateActiveDates(dateValue, false)
        }
        else {
            day.isActive = true
            updateActiveDates(dateValue, true)
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
        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
            {
                days.map((day) => (
                    <TouchableOpacity key = {day.id} onPress = {() =>handleInput(day)} style={{ flex: 1, alignSelf: 'stretch' }}>                   
                         <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: day.isActive? "#FFB800": "#2D3856", borderRadius: 100 }}>
                            <Text style = {{textAlign: "center", color: day.isActive? "black": "white"}}>{day.value}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
        </View>
    )

}

export default Days;