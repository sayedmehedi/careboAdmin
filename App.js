import React, {useEffect, useContext, createContext, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

import OrderListScreen from './src/screens/OrderListScreen';
import DoctorBookingListScreen from './src/screens/DoctorBookingListScreen';

import DoctorPresOrderListScreen from './src/screens/DoctorPresOrderListScreen';
import AssignRiderScreen from './src/screens/AssignRiderScreen';
import RiderPositionScreen from './src/screens/RiderPositionScreen';

import DashboardScreen from './src/screens/DashboardScreen';
import ReportUploadScreen from './src/screens/ReportUploadScreen';
import RiderHomeScreen from './src/screens/RiderHomeScreen';
import BookingListScreen from './src/screens/BookingListScreen';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import FlashMessage from 'react-native-flash-message';
import ChooseLocation from './src/screens/ChooseLocation';
import OrderListForRider from './src/screens/OrderListForRider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Sound from 'react-native-sound';
let sound1;
const playSound = () => {
  sound1 = new Sound(
    require('./src/assets/resource/alarm.mp3'),
    (error, _sound) => {
      if (error) {
        alert('error' + error.message);
        return;
      }
      sound1.play(() => {
        sound1.release();
      });
    },
  );
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  console.log('remoteMessage is ->    ', JSON.stringify(remoteMessage));
  DisplayNotification(remoteMessage);
  playSound();
});

async function DisplayNotification(remoteMessage) {
  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: remoteMessage.data.message_title,
    body: remoteMessage.data.message_body,
    android: {
      channelId,
      smallIcon: 'ic_launcher',
    },
  });
}

export const RiderPosition = createContext();

const Stack = createStackNavigator();

const App = () => {
  const [riderCurrentLocation, setRiderCurrentLocation] = useState({
    latitude: 23.7744342768168,
    longitude: 90.38987575780557,
  });

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      AsyncStorage.setItem('notificationType',(remoteMessage.data.type));
      
      (remoteMessage);
      playSound();
    });

    return unsubscribe;
  }, []);

  return (
    <RiderPosition.Provider
      value={[riderCurrentLocation, setRiderCurrentLocation]}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="home"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="orderList"
            component={OrderListScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="doctorBookingList"
            component={DoctorBookingListScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="doctorPresOrderList"
            component={DoctorPresOrderListScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="assignRider"
            component={AssignRiderScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="riderPosition"
            component={RiderPositionScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="dashboard"
            component={DashboardScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="bookList"
            component={BookingListScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="reportUpload"
            component={ReportUploadScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="riderHome"
            component={RiderHomeScreen}
            options={{
              headerShown: false,
            }}
          />
           <Stack.Screen
            name="orderListForRider"
            component={OrderListForRider}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="chooseLocation" component={ChooseLocation} />
        </Stack.Navigator>
        <FlashMessage position="top" />
      </NavigationContainer>
    </RiderPosition.Provider>
  );
};

export default App;
