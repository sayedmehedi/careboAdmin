import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
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
        <Text>{i.Diagnostic_Center_Name}</Text>
      </View>
      <View>
        <Text>{i.Test_Name}</Text>
      </View>
    </View>
  );
};

const EachPhysioShebaBooking = ({item}) => {
  const testID = item.id;
  console.log('testI',testID);
  const [showMenu, setShowMenu] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userType, setUserType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [token,setToken] = useState('');

  const [confirmed,setConfirmed] = useState(false);
  const [way,setWay]  = useState(false);
  const [traffic, setTraffic] = useState(false);
  const [collected,setCollected] = useState(false);  

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
      AsyncStorage.getItem('userType').then(value => {
        if (value != null) {
          var userType = value;
          console.log('type', userType);
          setUserType(userType);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkStatus = () => {
    if(item.Sample_Collection_Status == 'Confirmed')
    {
      setConfirmed(true);
    }
    if(item.Sample_Collection_Status == 'On The Way')
    {
      setConfirmed(true);
      setWay(true);
    }
    if(item.Sample_Collection_Status == 'Stuck in Traffic')
    {
      setConfirmed(true);
      setWay(true);
      setTraffic(true);
    }
    if(item.Sample_Collection_Status == 'Collected')
    {
      setConfirmed(true);
      setWay(true);
      setTraffic(true);
      setCollected(true)
    }

  }

  // update status

  const updateStatus = () => {
    try {
      const api = `https://www.api-care-box.click/api/v2/pathology/sample_collection_statusUpdate_api/${testID}/`;
      console.log('api',api);
      const body = {
        'Sample_Collection_Status':selectedStatus 
      }

             axios.put(api, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(res => {
              console.log('teeeeeeeeeeeeeeee', res.data);
            })
            .catch(error => console.log('error', error));
      
    } catch (error) {

      console.log('error in updating status : ', error);
      
    }
  }

  useEffect(()=>{
    updateStatus();


  },[selectedStatus])

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
              height: 220,
              width: 230,
              backgroundColor: 'white',
              borderRadius: 10,
              shadowColor: 'gray',
              elevation: 15,
              margin: 5,
              padding: 15,
              justifyContent: 'center',
              
              justifyContent:'space-between'
            }}>
           <TouchableOpacity 
           disabled={true}
           style={{borderBottomWidth:0.3,height:30,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:5,alignItems:'center'}}>
           <Text style={{color:'#BD0451'}}>Pending</Text>
           <AntDesign name='checkcircle' size={15} color={'green'} />
           </TouchableOpacity>

           <TouchableOpacity
           disabled={true}
           onPress={()=>{
            setSelectedStatus('Confirmed');
            setConfirmed(true);
           }}
           style={{borderBottomWidth:0.3,height:30,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:5,alignItems:'center'}}>
           <Text style={{color:'#BD0451'}}>Confirm</Text>
           {
             confirmed?<AntDesign name='checkcircle' size={15} color={'green'} />:
             null
           }
           
           </TouchableOpacity>

           <TouchableOpacity
           disabled={true}
           onPress={()=>{
            setSelectedStatus('On The Way');
            setWay(true);
           }}
           
           style={{borderBottomWidth:0.3,height:30,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:5,alignItems:'center',}}>
           <Text style={{color:'#BD0451'}}>On the way</Text>
           {way?<AntDesign name='checkcircle' size={15} color={'green'} />:null}
           </TouchableOpacity>

           <TouchableOpacity
           disabled={true}
           onPress={()=>{
            setSelectedStatus('Stuck in Traffic');
            setTraffic(true);
           }}
           
           style={{borderBottomWidth:0.3,height:30,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:5,alignItems:'center',}}>
           <Text style={{color:'#BD0451'}}>Stuck in Traffic</Text>
           {traffic?<AntDesign name='checkcircle' size={15} color={'green'} />:null}
           </TouchableOpacity>

           <TouchableOpacity
          disabled={true}
           onPress={()=>{
            setSelectedStatus('Collected');
            setCollected(true);
           }}
           style={{borderBottomWidth:0.3,height:30,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:5,alignItems:'center',}}>
           <Text style={{color:'#BD0451'}}>Collected</Text>
           {collected?<AntDesign name='checkcircle' size={15} color={'green'} />:null}
           </TouchableOpacity>

            

            <TouchableOpacity
            style={{
              height: 30,
              width: 100,
              backgroundColor:'#BD0451',
              justifyContent:'center',
              alignItems:'center',
              borderRadius:5,
              alignSelf:'center',
              marginTop:5
            }}
            onPress={() => setModalVisible(false)}>
              <Text style={{color:'white'}}>Ok</Text>
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
        <View style={{justifyContent: 'space-around', padding: 15}}>
          <Text style={{fontSize: 16, fontWeight: '400', color: '#BD0451'}}>
            Order ID: {item.id}
          </Text>
          <Image
            source={require('../assets/received.png')}
            style={{height: 50, width: 50}}
          />
          <Text style={{
            fontWeight:'bold',
            color:'#BD0451'
          }}>Payable to Carebox:<Text style={{color:'gray'}}>{item.PayableToCareBox}</Text></Text>
          {/* <TouchableOpacity
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
              Test Details
            </Text>
          </TouchableOpacity> */}
        </View>

        <View style={{padding: 20, flex: 1, justifyContent: 'space-around'}}>
          <Text style={{color: 'black'}}>
            Total Amount :
            <Text style={{color: '#BD0451'}}>{item.Total_Price}</Text>
          </Text>

          <View>
            <View
              style={{
                backgroundColor: '#BD0451',
                width: 60,
                margin: 5,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                height: 15,
              }}>
              <Text style={{fontSize: 8, color: 'white'}}>Status</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#BD0451'}}>
                {item.Sample_Collection_Status}
              </Text>
              <Image
                source={require('../assets/pending.png')}
                style={{height: 25, width: 25, marginLeft: 20}}
              />
            </View>
          </View>

          <TouchableOpacity
            //onPress={() => setModalVisible(true)}
            style={styles.actionButton}>
            <Text style={{color: 'white', fontSize: 14}}>{item.Status}</Text>
          </TouchableOpacity>
        </View>
      </View>
     
    </>
  );
};

export default EachPhysioShebaBooking;

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
