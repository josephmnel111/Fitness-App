import { View, Text, StyleSheet, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useState} from 'react'

const GraphSection = (props) => {

  const [finalDates, setFinalDates] = useState([]);
  const [finalData, setFinalData] = useState([]);

  let name = props.activeWorkout + " History"

  const  addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

    const dateToString = (date) => {
      var mm = date.getMonth() + 1; // getMonth() is zero-based
      var dd = date.getDate();
  
      return [
              mm,
              (dd>9 ? '' : '0') + dd,
              date.getFullYear()
            ].join('/');
    }

    const stringToDate = (date) => {
      let dateArray = date.split('/')
      return new Date(dateArray[2], dateArray[0] - 1, dateArray[1])
    }

    var getDaysArray = (start, end) => {
      let startDate = stringToDate(start);
      let endDate = stringToDate(end)
      for(var arr=[],dt=startDate; dt<=endDate; dt.setDate(dt.getDate()+1)){
        arr.push(dateToString(dt));
      }
      return arr;
    };

    /*const daysBetweenDates = (date1, date2) => {
      var parts1 = date1.split('/');
      var parts2 = date2.split('/');
      var mydate1 = new Date(parts1[2], parts1[0] - 1, parts1[1]);
      var mydate2 = new Date(parts2[2], parts2[0] - 1, parts2[1]);  
      var res = Math.abs(mydate2 - mydate1)/1000;
      var days = Math.floor(res/86400);
      return days
    }*/

    const getCurrentDay = () => {
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      return month + '/' + date + '/' + year
    }

  

    let dates = []
    let graphDates = []
    let dataPoints = []

    if (props.activeWorkout == "Steps") {
      
      for (let i = 0; i < props.stepsData.length; ++i) {
        dates.push(props.stepsData[i].Date)
        dataPoints.push(props.stepsData[i].Current_Steps)
      }
    } else {
      for (let i = 0; i < props.workoutData.length; ++i) {
        if (props.workoutData[i].Name == props.activeWorkout) {
          dates.push(props.workoutData[i].Date)
          dataPoints.push(props.workoutData[i].Weight)
        }
      }
    }

    let arr = getDaysArray(dates[0], getCurrentDay())
    let graphData = []
    let firstDate = stringToDate(arr[arr.length - 1]);
    let days = props.time * -1;
    let startDate = addDays(firstDate, days);
    let secondDate = stringToDate(arr[0])
    if (startDate > secondDate) { //Last date is longer ago than time constraint (normal case)
      let tempArray = getDaysArray(dateToString(startDate), dateToString(firstDate))
        graphDates.push(dateToString(startDate))
        graphDates.push(tempArray[Math.floor((tempArray.length) * (1/3))])
        graphDates.push(tempArray[Math.floor((tempArray.length) * (2/3))])
        graphDates.push(dateToString(firstDate))
       // setFinalDates(graphDates)
        let fillVal = dataPoints[0];
        let j = 0;
        for (let i = 0; i < arr.length; ++i) {
          if (arr[i] == dates[j]) {
            graphData.push(dataPoints[j])
            fillVal = dataPoints[j]
            ++j;
          } else {
            graphData.push(fillVal)
          }
        }
        let arrHolder = []
        for (let i = arr.length - props.time; i < arr.length; ++i) {
          arrHolder.push(arr[i])
        }
        //setFinalData(arrHolder)
        /*1. Start Date will be current date - time. End date will be current date.
        2. Create 2 medium dates by following below example.
        3. You can use same for loop as below, so make a different function for it.
        4. Instead of pushing all values into the graphData array, just push the last time values using for loop.
        5. for (let i = arr.length - time; i < arr.length; ++i) {
          graphData.push(arr[i])
        }
        6. Make sure to use usestates as variables for chart data.

      */
    } else { //Time using app is shorter than button chosen. All time base case.
      if (dates.length < 5) {
        graphDates = dates;
        graphData = dataPoints
        //setFinalData(graphData)
       // setFinalDates(graphDates)
      } else {
        let fillVal = dataPoints[0];
        let j = 0;
        for (let i = 0; i < arr.length; ++i) {
          if (arr[i] == dates[j]) {
            graphData.push(dataPoints[j])
            fillVal = dataPoints[j]
            ++j;
          } else {
            graphData.push(fillVal)
          }
        }
       // setFinalData(graphData)
        graphDates.push(arr[0])
        graphDates.push(arr[Math.floor((arr.length) * (1/3))])
        graphDates.push(arr[Math.floor((arr.length) * (2/3))])
        graphDates.push(arr[arr.length - 1])
       // setFinalDates(graphDates)
      }
    }
   

    return (
    <View style = {styles.container}>
        <Text style = {styles.title}>{name}</Text>
        <LineChart
          data={{
            labels: graphDates,
            datasets: [
              {
                data: graphData
              }
            ]
          }}
          withDots={false}
          width={350} // from react-native
          height={200}
          withHorizontalLines = {false}
          withVerticalLines = {false}
          yAxisInterval={1} // optional, defaults to 1
          fromZero={true}
          chartConfig={{
            decimalPlaces:0,
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            backgroundColor: "#18181C",
            color: (opacity = 1) => `#1D65E1`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    )
}
const styles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 20

    },
    container: {
      backgroundColor: '#18181C',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 15,
      padding: 10,
      borderRadius: 20
    },
})
export default GraphSection;