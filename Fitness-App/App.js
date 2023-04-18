//Expo start --tunnel

/*
  Todo:
  1. On scheduling, turn workout has been scheduled green and add back button to screen.
  2. When you create a workout, make sure tag is green when it is added as well.
  3. Add animations
  4. Fix schedule button on workout input page.

*/

import * as React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DrawerNavigator from './Navigation/DrawerNavigator';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client = {queryClient}>
      <NavigationContainer>
        <DrawerNavigator useLegacyImplementation = {true}/>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
registerRootComponent(App);