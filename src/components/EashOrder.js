import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const rederItem = i => {
  return (
    <View
      key={i.id}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View>
        <Text>{i.product_name}</Text>
      </View>
      <View>
        <Text>{i.Quantity}</Text>
      </View>
    </View>
  );
};

const EashOrder = ({item}) => {
  const orderID = item.id;
  const [showMenu, setShowMenu] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [token, setToken] = useState('');
  const [riderList, setRiderList] = useState('');

  const [confirmed, setConfirmed] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [way, setWay] = useState(false);

  useEffect(() => {
    getData();
    checkStatus();
  }, []);
  const getData = () => {
    try {
      AsyncStorage.getItem('token').then(value => {
        if (value != null) {
          var accessToken = value;
          setToken(accessToken);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkStatus = () => {
    if (item.order_status == 'confirmed') {
      setConfirmed(true);
    }
    if (item.order_status == 'delivered') {
      setConfirmed(true);
      setDelivered(true);
      setWay(true);
    }
    if (item.order_status == 'cancelled') {
      setConfirmed(false);
      setDelivered(false);
      setCancelled(true);
    }
    if (item.order_status == 'on_the_way') {
      setConfirmed(true);

      setWay(true);
    }
  };

  // update status

  const updateStatus = () => {
    try {
      const api = `https://www.api-care-box.click/api/v1/product/polls/product/orderplace_status_update/${item.id}/`;

      const body = {
        order_status: selectedStatus,
      };

      axios
        .put(api, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          console.log('resss', res.data);
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.log('error in updating status : ', error);
    }
  };

  useEffect(() => {
    updateStatus();
  }, [selectedStatus]);

  useEffect(() => {
    fetcAllRider();
  }, [token]);

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
  const _onclick_for_AssignRider = () => {

    try {
      const api = `https://www.api-care-box.click/api/v1/product/polls/product/orderplace_rider_update/3125/`;

      const body = {
        assign_to: selectedStatus,
      };

      axios
        .put(api, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          console.log('resss', res.data);
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.log('error in updating status : ', error);
    }

  }
  const renderAllRider = ({item}) => {
    return (
      <Pressable
        onPress={()=>{
          try {
            const api = `https://www.api-care-box.click/api/v1/product/polls/product/orderplace_rider_update/${orderID}/`;
      
            const body = {
              assign_to: item.id,
            };
      
            axios
              .put(api, body, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then(res => {
                console.log('resss message', res.data);
                setModalVisible2(false);
              })
              .catch(error => console.log('error', error));
          } catch (error) {
            console.log('error in updating status : ', error);
          }
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
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(!modalVisible2);
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
              onPress={() => setModalVisible2(false)}>
              <Text style={{color: 'white'}}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
              height: 220,
              width: 230,
              backgroundColor: 'white',
              borderRadius: 10,
              shadowColor: 'gray',
              elevation: 15,
              margin: 5,
              padding: 15,
              justifyContent: 'center',

              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                borderBottomWidth: 0.3,
                height: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 5,
                alignItems: 'center',
              }}>
              <Text style={{color: '#BD0451'}}>Pending</Text>
              <AntDesign name="checkcircle" size={15} color={'green'} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedStatus('confirmed');
                setConfirmed(true);
              }}
              style={{
                borderBottomWidth: 0.3,
                height: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 5,
                alignItems: 'center',
              }}>
              <Text style={{color: '#BD0451'}}>Confirm</Text>
              {confirmed ? (
                <AntDesign name="checkcircle" size={15} color={'green'} />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedStatus('on_the_way');
                setWay(true);
              }}
              style={{
                borderBottomWidth: 0.3,
                height: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 5,
                alignItems: 'center',
              }}>
              <Text style={{color: '#BD0451'}}>On The Way</Text>
              {way ? (
                <AntDesign name="checkcircle" size={15} color={'green'} />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedStatus('delivered');
                setDelivered(true);
              }}
              style={{
                borderBottomWidth: 0.3,
                height: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 5,
                alignItems: 'center',
              }}>
              <Text style={{color: '#BD0451'}}>Delivered</Text>
              {delivered ? (
                <AntDesign name="checkcircle" size={15} color={'green'} />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedStatus('cancelled');
                setCancelled(true);
              }}
              style={{
                borderBottomWidth: 0.3,
                height: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 5,
                alignItems: 'center',
              }}>
              <Text style={{color: '#BD0451'}}>Cancelled</Text>
              {cancelled ? (
                <AntDesign name="checkcircle" size={15} color={'green'} />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 30,
                width: 100,
                backgroundColor: '#BD0451',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                alignSelf: 'center',
                marginTop: 5,
              }}
              onPress={() => setModalVisible(false)}>
              <Text style={{color: 'white'}}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View
        key={item.id}
        style={{
          height: 180,
          width: '98%',
          backgroundColor: 'white',
          margin: 3,
          justifyContent: 'space-between',
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: '#BD0451',
          borderRadius: 8,
        }}>
        <View style={{justifyContent: 'space-around', padding: 20}}>
          <Text style={{fontSize: 16, fontWeight: '400', color: '#BD0451'}}>
            Order ID: {item.id}
          </Text>
          <Image
            source={require('../assets/received.png')}
            style={{height: 50, width: 50}}
          />
          <TouchableOpacity
            onPress={() => setShowMenu(prevState => !prevState)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: 25,
                width: 25,
                borderRadius: 12,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 3,
                borderColor: '#BD0451',
              }}>
              <AntDesign name="caretdown" size={16} color={'#BD0451'} />
            </View>
            <Text
              style={{
                fontSize: 16,
                color: '#BD0451',
              }}>
              Order Details
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{padding: 5, flex: 1, justifyContent: 'space-around'}}>
          <Text style={{color: 'black'}}>
            Total Amount :
            <Text style={{color: '#BD0451'}}>{item.totalPrice}</Text>
          </Text>

          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  backgroundColor: '#BD0451',
                  width: 60,
                  margin: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 3,
                  height: 15,
                }}>
                <Text style={{fontSize: 8, color: 'white'}}>Status</Text>
              </View>
              <Text style={{fontSize: 12, fontWeight: '300', color: '#BD0451'}}>
                Change Status
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#BD0451'}}>{item.order_status}</Text>
              <Image
                source={require('../assets/pending.png')}
                style={{height: 25, width: 25, marginHorizontal: 10}}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.actionButton}>
                <Text style={{color: 'white', fontSize: 14}}>Action</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible2(true)}
            style={{
              backgroundColor: '#BD0451',
              padding: 4,
              paddingHorizontal: 10,
              borderRadius: 5,
              width: '70%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Text style={{color: 'white', fontSize: 14, fontWeight: '300'}}>
              Select Rider
            </Text>
            <AntDesign name="caretdown" color={'white'} size={14} />
          </TouchableOpacity>
        </View>
      </View>
      {showMenu && (
        <View
          style={{
            width: '98%',
            alignSelf: 'center',
            borderRadius: 5,
            padding: 10,
            backgroundColor: 'white',
            shadowColor: 'black',
            elevation: 18,
            margin: 5,
          }}>
          {item.orders.map(i => rederItem(i))}
        </View>
      )}
    </>
  );
};

export default EashOrder;

const styles = StyleSheet.create({
  actionButton: {
    height: 30,
    width: 80,
    backgroundColor: '#BD0451',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
