import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HomeScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState('');
  const [riderList, setRiderList] = useState('');
  const [notificationType, setNotificationType] = useState(null);
  console.log('t', notificationType);

  const renderAllRider = ({item}) => {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate('riderPosition', {rider_id: item.id});
          setModalVisible(false);
        }}
        style={{
          borderBottomWidth: 0.3,
          width: '70%',
          alignSelf: 'center',
          paddingVertical: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text>{item.name}</Text>
        <AntDesign name="arrowright" size={18} color={'#BD0451'} />
      </Pressable>
    );
  };

  useEffect(() => {
    getNotificationType();
  }, []);

  const getNotificationType = () => {
    try {
      AsyncStorage.getItem('notificationType').then(value => {
        if (value != null) {
          var notification = value;
          console.log('not', notification);
          setNotificationType(notification);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
    fetcAllRider();
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

  const _logOutPress = async () => {
    try {
      await AsyncStorage.clear();

      navigation.navigate('login');
    } catch (error) {
      console.log(error);
    }
  };

  const _riderPosition = () => {
    setModalVisible(true);

    // navigation.navigate('riderPosition')
  };

  const fetcAllRider = () => {
    try {
      const api =
        'https://www.api-care-box.click/api/v1/DeliveryTeam/polls/RiderList/';
      axios
        .get(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          setRiderList(res.data);
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.log('error in getting order data : ', error);
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
      
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}>
              <View
                style={{
                  height: 300,
                  width: 260,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  shadowColor: 'gray',
                  elevation: 15,
                  margin: 5,
                  padding: 15,
                  paddingBottom: 25,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      marginRight: 8,
                      color: 'black',
                      fontWeight: '500',
                      fontSize: 20,
                    }}>
                    Rider List
                  </Text>
                  <Image
                    source={require('../assets/delivery-man.png')}
                    style={{height: 20, width: 20}}
                  />
                </View>
                <View
                  style={{
                    width: '98%',
                    height: 1,
                    backgroundColor: 'black',
                  }}></View>

                {riderList.length > 0 ? (
                  <View style={{paddingBottom: 40}}>
                    <FlatList
                      data={riderList}
                      renderItem={renderAllRider}
                      keyExtractor={item => item.id}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator size="large" color="#BD0451" />
                    <Text style={{marginTop: 10}}>loading</Text>
                  </View>
                )}

                <Pressable
                  style={{
                    height: 30,
                    width: 100,
                    backgroundColor: '#BD0451',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,

                    marginTop: 5,

                    position: 'absolute',
                    bottom: 5,
                    alignSelf: 'center',
                  }}
                  onPress={() => setModalVisible(false)}>
                  <Text style={{color: 'white'}}>Ok</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <View style={styles.header}>
            <View>
              <Text style={{fontSize: 20, marginVertical: 5}}>
                Welcome <Text style={{color: '#BD0451'}}>To Admin Page</Text>
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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

         <View style={{flex:1}}>
          <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 30,
            }}>
            <Pressable
              onPress={() => {
                navigation.navigate('orderList');
                setNotificationType(null);
              }}
              style={styles.cardContainer}>
              {notificationType == 'Orderplace' ? (
                <View style={styles.notificationAlert}></View>
              ) : null}

              <Image
                source={require('../assets/box.png')}
                style={{height: 60, width: 60}}
              />
              <Text
                style={{
                  color: '#BD0451',
                  fontSize: 15,
                  marginTop: 7,
                }}>
                Orders
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                navigation.navigate('doctorBookingList');
                setNotificationType(null);
              }}
              style={styles.cardContainer}>
              {notificationType == 'Session Created' ? (
                <View style={styles.notificationAlert}></View>
              ) : null}

              <Image
                source={require('../assets/doctor.png')}
                style={{height: 60, width: 60}}
              />
              <Text
                style={{
                  color: '#BD0451',
                  fontSize: 15,
                  marginTop: 7,
                }}>{`Doctor Booking`}</Text>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 30,
            }}>
            <Pressable
              onPress={() => {
                navigation.navigate('bookList');
                setNotificationType(null);
              }}
              style={styles.cardContainer}>
              {notificationType == 'Pathology' ? (
                <View style={styles.notificationAlert}></View>
              ) : null}

              <Image
                source={require('../assets/microscope_2.png')}
                style={{height: 60, width: 60}}
              />
              <Text
                style={{
                  color: '#BD0451',
                  fontSize: 15,
                  marginTop: 7,
                }}>{`Pathology`}</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('doctorPresOrderList')}
              style={styles.cardContainer}>
              <Image
                source={require('../assets/prescription.png')}
                style={{height: 60, width: 60}}
              />
              <Text
                style={{
                  color: '#BD0451',
                  fontSize: 15,
                  marginTop: 7,
                }}>{`Doctor Pres. \n     Order`}</Text>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 30,
            }}>
            <Pressable
              onPress={() => {
                navigation.navigate('physioShebaBooking');
                setNotificationType(null);
              }}
              style={styles.cardContainer}>
              {notificationType == 'Pathology' ? (
                <View style={styles.notificationAlert}></View>
              ) : null}

              <Image
                source={require('../assets/physio.jpg')}
                style={{height: 60, width: 60}}
              />
              <Text
                style={{
                  color: '#BD0451',
                  fontSize: 15,
                  marginTop: 7,
                  textAlign:'center'
                }}>{`PhysioSheba Bookings`}</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('ambulanceBookingList')}
              style={styles.cardContainer}>
              <Image
                source={require('../assets/ambulance.png')}
                style={{height: 30, width: 50}}
              />
              <Text
                style={{
                  color: '#BD0451',
                  fontSize: 15,
                  marginTop: 7,
                  textAlign:'center'
                }}>{`Ambulance Bookings`}</Text>
            </Pressable>
          </View>

          <View
            style={{
              alignItems: 'center',
              marginTop: 30,
            }}>
            <Pressable
              onPress={_riderPosition}
              style={[styles.cardContainer, {width: '70%'}]}>
              <Image
                source={require('../assets/map.png')}
                style={{height: 60, width: 60}}
              />
              <Text
                style={{
                  color: '#BD0451',
                  fontSize: 15,
                  marginTop: 7,
                }}>{`Rider Position`}</Text>
            </Pressable>
          </View>

          <View
            style={{
              alignItems: 'center',
              marginTop: 30,
            }}>
            <Pressable
              onPress={()=>navigation.navigate('onlinePayment')}
              style={[styles.cardContainer, {width: '70%'}]}>
              <Image
                source={require('../assets/dollar.png')}
                style={{height: 60, width: 60}}
              />
              <Text
                style={{
                  color: '#BD0451',
                  fontSize: 15,
                  marginTop: 7,
                }}>{`Request for use Points`}</Text>
            </Pressable>
          </View>


          <TouchableOpacity onPress={_logOutPress} style={styles.logOutButton}>
            <Text style={{fontSize: 14, color: 'white'}}>Log Out</Text>
          </TouchableOpacity>
          </ScrollView>
         </View>
        
       
        {/* <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
        

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontWeight: '400',
                color: 'black',
                fontSize: 18,
                marginHorizontal: 10,
              }}>
              Powered By |
            </Text>
            <Image
              source={require('../assets/Carebox_logo.png')}
              style={{height: 50, width: 120}}
            />
          </View>
        </View> */}
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    height: '15%',
    width: '100%',

    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logOutButton: {
    height: 40,
    width: 120,
    backgroundColor: '#BD0451',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    marginVertical:20
  },
  cardContainer: {
    height: 150,
    width: '40%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#BD0451',
    borderRadius: 8,
    shadowColor: 'black',
    elevation: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  notificationAlert: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: '#BD0451',
    marginTop: -10,
    marginLeft: 40,
  },
});
