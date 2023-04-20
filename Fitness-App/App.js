//Expo start --tunnel

/*
  Todo:
  1. Fix styling when clicking on schedule on first screen. 
  2. Make loading screens for loading values.
  3. Make profile screen styling better.
  4. Something broke with loading blue circle when submitting via scheduling button.
  5. Add animations

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