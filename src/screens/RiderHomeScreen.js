import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

import  { AnimatedRegion} from 'react-native-maps';

import {locationPermission, getCurrentLocation} from '../helper/helperFunction';


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const RiderHomeScreen = ({navigation}) => {
  let checklogout = false;
 
    
 
  const markerRef = useRef();
  const [token, setToken] = useState('');
  const [riderID,setRiderID] = useState(null);
  const [riderName,setRiderName] = useState('');

  const [lat,setLat] = useState();
  const [lon,setLon] = useState();
  
 
 
  const [state, setState] = useState({
    curLoc: {
      latitude: 30.7046,
      longitude: 77.1025,
    },
    destinationCords: {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 30.7046,
      longitude: 77.1025,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    time: 0,
    distance: 0,
    heading: 0,
  });

  useEffect(() => {
    getData();
    getRiderID();
   
  }, [token]);
  const getData = () => {
    try {
      AsyncStorage.getItem('token').then(value => {
        if (value != null) {
          var accessToken = value;
          console.log('token', accessToken);
          setToken(accessToken);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getRiderID = () => {
    try {
      const api =
        'https://www.api-care-box.click/api/v1/DeliveryTeam/polls/RiderPersonalDetail/';
      axios
        .get(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
     
          setRiderID(res.data.id);
          setRiderName(res.data.name);
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.log('error in getting rider id data : ', error);
    }
  }
 
  useEffect(() => {
    getLiveLocation();
  }, []);

  let ws;

  useEffect(() => {
    initiateSocketConnection()
  }, [riderID,lat,lon])

  const initiateSocketConnection = () => {
    // Add URL to the server which will contain the server side setup
     ws = new WebSocket(`wss://api-care-box.click:8001/rider_location/${riderID}/`)

    // When a connection is made to the server, send the user ID so we can track which
    // socket belongs to which user
    ws.onopen = () => {
     
      var m = {
        'Custom-User-Agent':
          '15!@ejh46)(*%#!@s4h68a4rgsagH&^%%$#@!JKFKVYRDTgjsgakjzghfjJ%$#@#%HFYD32434',
      };
      var adress = {
        latitude: lat,
        longitude: lon
      };


       ws.send(JSON.stringify(m));
       ws.send(JSON.stringify(adress));
    }

    // Ran when teh app receives a message from the server
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data)
      
    }
  }


  const getLiveLocation = async () => {
    console.log('get live location called');
    
    const locPermissionDenied = await locationPermission();

    if (locPermissionDenied) {
      const {latitude, longitude, heading} = await getCurrentLocation();
      setLat(latitude);
      setLon(longitude);


    }
  };

      
 

  useEffect(() => {
    console.log('check log out ',checklogout);
    const interval = setInterval(() => {
      console.log('check log from interval',checklogout);
      getLiveLocation();
      
     
      if(checklogout == true)
      {
        clearInterval(interval)
      }
     
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  const _logOutPress = async () => {
    checklogout=true;
   // setChecklogout(true);
    

    
    try {
      
      await AsyncStorage.clear();

      navigation.navigate('login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 3}}>
        <View style={styles.header}>
          <View>
            <Text style={{fontSize: 20, marginVertical: 5}}>
              Welcome <Text style={{color: '#BD0451'}}>To Carebox-Rider</Text>
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../assets/profile.png')}
                style={{height: 30, width: 30, marginHorizontal: 5}}
              />
              {riderName != null ?
              <Text style={{fontSize: 20, marginHorizontal: 10}}>{riderName}</Text>:null
              }
              
            </View>
          </View>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../assets/bell.png')}
              style={{height: 30, width: 30}}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Image
            source={require('../assets/microscope_2.png')}
            style={{height: 80, width: 80}}
          />

          <View>
            <Text style={{margin: 10, fontSize: 18}}>Booking List</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('orderListForRider',{'rider_name':riderName})}
              style={styles.viewButton}>
              <Text style={{color: 'white'}}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={_logOutPress} style={styles.logOutButton}>
          <Text style={{fontSize: 14, color: 'white'}}>Log Out</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontWeight: '400',
              color: 'black',
              fontSize: 22,
              marginHorizontal: 10,
            }}>
            Powered By |
          </Text>
          <Image
            source={require('../assets/Carebox_logo.png')}
            style={{height: 50, width: 120}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RiderHomeScreen;

const styles = StyleSheet.create({
  header: {
    height: '20%',
    width: '100%',

    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  logOutButton: {
    height: 40,
    width: 120,
    backgroundColor: '#BD0451',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    height: 150,
    width: '80%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#BD0451',
    borderRadius: 8,
    shadowColor: 'black',
    elevation: 18,
    padding: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'space-around',
  },
  viewButton: {
    height: 30,
    width: 100,
    backgroundColor: '#BD0451',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
  },
});
