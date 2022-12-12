//Run: expo start --tunnel

import * as React from 'react';
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

