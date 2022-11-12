import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './Navigation/DrawerNavigator'

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator useLegacyImplementation = {true}/>
    </NavigationContainer>
  );
}

//const styles = StyleSheet.create({
  //container: {
    //flex: 1,
    //backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  //},
//});
