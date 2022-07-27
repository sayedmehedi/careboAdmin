import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';

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

const EashOrderForRider = ({item}) => {
  console.log(item.shippingAddress.appartment);

  const [showMenu, setShowMenu] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    setPhone(item.users.Phone);
  }, []);

  const sendOTP = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      if (confirmation) {
        // console.log('ok', confirmation);
        setConfirm(confirmation);
        setModalVisible(true);
        setLoading(false);
      }
    } catch (error) {
      console.log('sign in with phone otpppp error', error);
      setLoading(false);
    }
  };

  const _click_SendOTP = () => {
    setLoading(true);
    if (phone) {
      sendOTP();
    }else {
      setLoading(false);
    }
  };
  const _clicked_ConfirmOtp = async () => {
    setLoading(true)
    if (otp != '' && otp.length == 6) {
      try {
        
        await confirm.confirm(otp);
        setModalVisible(false);
        setLoading(false);
        
      } catch (error) {
        console.log('confirmCode error.', error);
        setLoading(false);
      }
    } 
  };

  return (
    <>
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
              height: 200,
              width: 250,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="type otp here"
              style={{
                height: 40,
                width: 200,
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: 10,
                padding: 10,
              }}
              onChangeText={text => setOtp(text)}
            />
            <TouchableOpacity
              onPress={_clicked_ConfirmOtp}
              style={{
                backgroundColor: '#BD0451',
                paddingHorizontal: 40,
                margin: 5,
                padding: 5,
                borderRadius: 5,
              }}>
                {loading?
              <ActivityIndicator/>
              :
              <Text style={{color: '#EFEFEF'}}>Confirm</Text>

              }
             
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View
        key={item.id}
        style={{
          height: 220,
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
          <Text>{item.users.Phone}</Text>
          <TouchableOpacity
            onPress={_click_SendOTP}
            style={{
              backgroundColor: '#BD0451',
              padding: 3,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 3,
            }}>
              {loading?
              <ActivityIndicator 
              size={'small'}
              color={'white'}
              />
               :
               <Text style={{color: '#DFDFDF', fontWeight: '400'}}>
               Verify OTP
             </Text>
              }
           
          </TouchableOpacity>
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

        <View
          style={{
            flex: 1,
            paddingVertical: 10,
            justifyContent: 'space-between',
          }}>
          <Text style={{color: 'black'}}>
            Total Amount :
            <Text style={{color: '#BD0451'}}>{item.totalPrice}</Text>
          </Text>

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

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#BD0451'}}>{item.order_status}</Text>
              <Image
                source={require('../assets/pending.png')}
                style={{height: 25, width: 25, marginHorizontal: 10}}
              />
            </View>
          </View>

          {/* address */}
          <View style={{width: '100%'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}>
              <View>
                <Text style={{fontSize: 14, fontWeight: '600', color: 'black'}}>
                  Address:{' '}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 12, fontWeight: '400', color: '#BD0451'}}>
                  {item.shippingAddress.area}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}>
              <Text style={{fontSize: 14, fontWeight: '600', color: 'black'}}>
                House:{' '}
              </Text>
              <View style={{flex: 1, marginVertical: 3}}>
                <Text
                  style={{fontSize: 12, fontWeight: '400', color: '#BD0451'}}>
                  {item.shippingAddress.house}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}>
              <Text style={{fontSize: 14, fontWeight: '600', color: 'black'}}>
                Appartment:{' '}
              </Text>
              <View style={{flex: 1, marginVertical: 3}}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '400',
                    color: '#BD0451',
                    width: '100%',
                    alignSelf: 'center',
                  }}>
                  {item.shippingAddress.appartment}
                </Text>
              </View>
            </View>
          </View>
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

export default EashOrderForRider;

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
