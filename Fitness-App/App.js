//Expo start --tunnel

/*
  Todo:
  1. Change profile and workoutcontainersection so style matches rest of app (especially buttons)
  2. Make it so when you exit from scheduling section, then go back in, the active dates are refreshed, so none are colored in.c
  3. Add animations

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