import * as React from 'react';
import { View, Text } from "react-native";

const SettingsScreen = () =>{
   return (
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#2D3856"}}>
<Text style={{fontSize:16,fontWeight:'700', color: "white"}}>Settings Screen</Text>
</View>
   );
 }
 
 export default SettingsScreen;