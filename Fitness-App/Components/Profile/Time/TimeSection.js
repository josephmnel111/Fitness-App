import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'



const TimeSection = ( {chooseTime} ) => {

    const getCurrentDay = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        return month + '/' + date + '/' + year
    }

    const ThirtyDays = () => {
        chooseTime(30)
    }

    const NinetyDays = () => {
        chooseTime(90)
    }

    const OneYear = () => {
        chooseTime(365)
    }

    const AllTime = () => {
        chooseTime(99999)

    }
    return (
        <View style = {styles.container}>
            <TouchableOpacity style = {styles.button}>
                <Text style = {styles.text} onPress = {() =>ThirtyDays()} >30 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.button} onPress = {() =>NinetyDays()}>
                <Text style = {styles.text}>90 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.button} onPress = {() =>OneYear()}>
                <Text style = {styles.text}>1 Year</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.button} onPress = {() =>AllTime()}>
                <Text style = {styles.text}>All Time</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#1D65E1',
        justifyContent: 'center',
        borderRadius: 15,
        height: 30,
        width: 60,
        margin: 10
    },
    text: {
        color: 'white',
        alignSelf: 'center'
    }
})
export default TimeSection;