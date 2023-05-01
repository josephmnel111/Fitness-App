import * as React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';


const StepSection = ( props ) =>{
    let currentDay = props.stepsData.length - 1
    let data = ""
    let percentage = (props.stepsData[currentDay].Current_Steps/props.stepsData[currentDay].Goal_Steps) * 100
    if (props.activeWorkout == "Steps") {
      data = props.stepsData[currentDay].Current_Steps + "/" + props.stepsData[currentDay].Goal_Steps
    } else {
      let max = 0
      for (let i = 0; i < props.workoutData.length; ++i) {
        if ((props.workoutData[i].Weight > max) && (props.workoutData[i].Name == props.activeWorkout)) {
          max = props.workoutData[i].Weight
        }
      }
      data = "Max: " + String(max)
      percentage = 100
    }
      return (
      <View>
        <View style = {styles.titleContainer}>
          <Text style = {styles.title}>{props.activeWorkout}</Text>
        </View>
        <View style = {styles.container}>
          <View style = {styles.dataContainer}>
            <Text style = {styles.data}>{data}</Text>
          </View>
          <CircularProgress
            style = {styles.progressBar}
            radius = {40}
            value={percentage}
            progressValueColor="#18181C"
            activeStrokeColor="#1D65E1"
            inActiveStrokeOpacity={1}
            dashedStrokeConfig={{
              count: 30,
              width: 4,
            }}
          >
            
          </CircularProgress>

          </View>
          
      </View>
      
    );
 }
const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 20,
    marginTop: 10,
    alignSelf: 'center'
  },
  
  container: {
    backgroundColor: '#18181C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    marginTop: 15,
    padding: 10,
    borderRadius: 20
  },
  dataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10
  },
  data: {
    color: 'white',
  },
});
//Blue color: #1D65E1

 export default StepSection;