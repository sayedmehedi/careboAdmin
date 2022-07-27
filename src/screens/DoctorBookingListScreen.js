import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EachDoctorBookingItems from '../components/EachDoctorBookingItems';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const renderAllBooking = ({item}) => <EachDoctorBookingItems item={item} />;

const DoctorBookingListScreen = ({navigation}) => {
    const [allBooking, setAllBooking] = useState([]);
    const [token, setToken] = useState('');

    const removeData = async () => {
      await AsyncStorage.removeItem('notificationType');
   }


 useEffect(()=>{
   getNotificationType();

 },[])

 const getNotificationType = () => {
   try {
     AsyncStorage.getItem('notificationType').then(value => {
       if (value != null) {
         var notification = value;
         console.log('notification type',notification);
         if(notification == 'Session Created')
         {
           removeData();
           
           
         }
        
       }
     });
   } catch (error) {
     console.log(error);
   }

 } 
 
    
  
    useEffect(() => {
      getData();
      fetchAllBooking();
    }, [token]);
    const getData = () => {
      try {
        AsyncStorage.getItem('token').then(value => {
          if (value != null) {
            var accessToken = value;
            console.log('token',accessToken);
            setToken(accessToken);
          }
        });
  
       
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchAllBooking = () => {
      try {
        const api =
          'https://www.api-care-box.click/api/v2/Online_Doctor_Booking/get_Doctor_Booking_Admin_API/';
        axios
          .get(api, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(res => {
          
            setAllBooking(res.data);
          })
          .catch(error => console.log('error', error));
      } catch (error) {
        console.log('error in getting order data : ', error);
      }
    };
  return (
    <SafeAreaView style={{flex: 1,}}>
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{padding: 5}}
              onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={26} color={'#BD0451'} />
            </TouchableOpacity>
            <Text style={{color: 'black', fontSize: 20, margin: 5}}>
              Back
            </Text>
            <Text style={{color: '#BD0451', fontSize: 20}}>
              To Admin Page
            </Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
            <Image
              source={require('../assets/profile.png')}
              style={{height: 30, width: 30, marginHorizontal: 5}}
            />
            <Text style={{fontSize: 20, marginHorizontal: 10}}>Admin</Text>
          </View>
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../assets/bell.png')}
            style={{height: 30, width: 30}}
          />
        </View>
      </View>
    </View>
    <View style={{flex: 6}}>
      <Text style={{margin: 10, fontSize: 15}}>Last 50 Orders</Text>
      {allBooking.length > 0 ? (
        <View style={{paddingBottom: 40}}>
          <FlatList
            data={allBooking}
            renderItem={renderAllBooking}
            keyExtractor={item => item.id}
          />
        </View>
      ) : (
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#BD0451" />
          <Text style={{marginTop: 10}}>loading</Text>
        </View>
      )}
    </View>
  </SafeAreaView>
  )
}

export default DoctorBookingListScreen
const styles = StyleSheet.create({
    header: {
      height: '100%',
      width: '100%',
  
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      alignItems: 'center',
      backgroundColor:'white',
      borderBottomLeftRadius:20,
      borderBottomRightRadius:20
      
    },
  });