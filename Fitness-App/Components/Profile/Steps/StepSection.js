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
      <View style = {styles.container}>
        <View style = {styles.titleContainer}>
          <Text style = {styles.title}>{props.activeWorkout}</Text>
        </View>
        <View style = {styles.dataContainer}>
          <Text style = {styles.data}>{data}</Text>
        </View>
        <CircularProgress
          style = {styles.progressBar}
          radius = {40}
          value={percentage}
          progressValueColor="#2D3856"
          activeStrokeColor="#1D65E1"
          inActiveStrokeOpacity={.4}
          dashedStrokeConfig={{
            count: 30,
            width: 4,
          }}
        />
      </View>
      
    );
 }
const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 18,
    margin: 10,
  },
  
  container: {
    alignItems: 'center',
    backgroundColor: '#18181C',
    justifyContent: 'center'
  },
  dataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10
  },
  data: {
    top: 10,
    color: 'white',
    justifyContent: 'center',
    position: 'absolute',
  }
});
//Blue color: #1D65E1

 export default StepSection;