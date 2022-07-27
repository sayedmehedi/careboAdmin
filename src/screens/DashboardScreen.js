import React, {useState,useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {View, Text, SafeAreaView, Image, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = ({navigation}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [token,setToken] = useState('');
  

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const [totalReceivable,setTotalReceivable] = useState('0');
  const [totalDisbursed,setTotalDisbursed] = useState('0');
  const [totalDue,setTotalDue] = useState('0');
  const [disputeAmount, setDisputeAmount] = useState('0');

  const [totalOrder,setTotalOrder] = useState('0');
  const [complete,setComplete] = useState('0');
  const [pending,setPending] = useState('0');
  const [cancel,setCansel] = useState('0');


  useEffect(() => {
    getData();
    fetchAllData();
  }, [token]);
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

  const fetchAllData = () => {
    try {
      const api =
        'https://www.api-care-box.click/api/v2/pathology/vendor_dashboard_pathology/';
      axios
        .get(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
        //  console.log('res',res.data);
         
          setCansel(res.data.Cancel);
          setPending(res.data.Pending);
          setComplete(res.data.Completed);
          setTotalOrder(res.data.Total_orders)

          setTotalReceivable(res.data.total_receivable);
          setTotalDisbursed(res.data.total_disbursed);
          setTotalDue(res.data.total_due);
          setDisputeAmount(res.data.disputed_amount);


         
        })
        .catch(error => console.log('errordfsfsf', error));
    } catch (error) {
      console.log('error in getting order data : ', error);
    }
  };


  useEffect(()=>{
    const endDatee = moment(endDate).format('YYYY-MM-DD'); 
    setEndDate(endDatee);

    try {
      console.log('start date',startDate);
     
      const api = `https://www.api-care-box.click/api/v2/pathology/vendor_dashboard_pathology/?Fromdate=${startDate}&Todate=${endDate}`;
      axios
        .get(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          console.log('mehedieeeee hasan',res.data);
          setCansel(res.data.Cancel);
          setPending(res.data.Pending);
          setComplete(res.data.Completed);
          setTotalOrder(res.data.Total_orders);

          setTotalReceivable(res.data.total_receivable);
          setTotalDisbursed(res.data.total_disbursed);
          setTotalDue(res.data.total_due);
          setDisputeAmount(res.data.disputed_amount);


         
        })
        .catch(error => console.log('mehedi errorrr', error));
    } catch (error) {
      console.log('error in getting order data : ', error);
    }



  },[endDate])

  useEffect(()=>{
    const startdatee = moment(startDate).format('YYYY-MM-DD'); 
    setStartDate(startdatee);

  },[startDate])

  useEffect(()=>{


  },[])

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 3}}>
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
              <Text style={{fontSize: 20, marginHorizontal: 10}}>Amar Lab</Text>
            </View>
          </View>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../assets/bell.png')}
              style={{height: 30, width: 30}}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <View
            style={[
              styles.cardContainer,
              {
                backgroundColor: '#BD0451',
                shadowColor: '#BD0451',
                elevation: 18,
              },
            ]}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
              Total Receivable
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Image
                source={require('../assets/money-bag.png')}
                style={{height: 50, width: 50}}
              />
              <Text style={{color: 'white'}}>{totalReceivable} TK</Text>
            </View>
          </View>

          <View
            style={[
              styles.cardContainer,
              {
                backgroundColor: '#06B26B',
                shadowColor: '#06B26B',
                elevation: 18,
              },
            ]}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
              Total Disbursed
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Image
                source={require('../assets/bank.png')}
                style={{height: 50, width: 50}}
              />
              <Text style={{color: 'white'}}>{totalDisbursed} TK</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          <View
            style={[
              styles.cardContainer,
              {
                backgroundColor: '#00C2FF',
                shadowColor: '#00C2FF',
                elevation: 18,
              },
            ]}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
              Total Due
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Image
                source={require('../assets/money2.png')}
                style={{height: 50, width: 50}}
              />
              <Text style={{color: 'white'}}>{totalDue} TK</Text>
            </View>
          </View>

          <View
            style={[
              styles.cardContainer,
              {
                backgroundColor: '#002BFF',
                shadowColor: '#002BFF',
                elevation: 18,
              },
            ]}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
              Dispute Amount
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Image
                source={require('../assets/money3.png')}
                style={{height: 50, width: 50}}
              />
              <Text style={{color: 'white'}}>{disputeAmount} TK</Text>
            </View>
          </View>
        </View>

        {/* date filer */}

        <TouchableOpacity
          onPress={() => setShowMenu(prevState => !prevState)}
          style={[styles.dateFilter, {marginLeft: 33}]}>
          <Text style={{color: 'white', fontWeight: '300'}}>Date Filter</Text>
          <AntDesign name="caretdown" size={12} color={'white'} />
        </TouchableOpacity>

        {showMenu && (
          <View
            style={{
              height: 70,
              width: '85%',
              alignSelf: 'center',
              borderRadius: 5,
              padding: 10,
              backgroundColor: 'white',
              shadowColor: 'black',
              elevation: 18,
              margin: 5,
              flexDirection: 'row',

              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={styles.dateFilter}>
              <Text style={{color: '#f5f5f5', fontWeight: '300', fontSize: 12}}>
                Start Date
              </Text>
              <AntDesign name="calendar" size={14} color={'white'} />
            </TouchableOpacity>

            <TouchableOpacity 
             onPress={() => setEndDateOpen(true)}
            style={styles.dateFilter}>
              <Text style={{color: '#f5f5f5', fontWeight: '300', fontSize: 12}}>
                End Date
              </Text>
              <AntDesign name="calendar" size={14} color={'white'} />
            </TouchableOpacity>

            <DatePicker
              modal
              open={open}
              date={date}
              mode="date"
              onConfirm={date => {
                setOpen(false);
                setStartDate(date);
               
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />

           <DatePicker
              modal
              open={endDateOpen}
              date={date}
              mode="date"
              onConfirm={date => {
                setEndDateOpen(false);
                setEndDate(date);
                setShowMenu(false);
               
              }}
              onCancel={() => {
                setEndDate(false);
                setShowMenu(false);
              }}
            />
          </View>
        )}

        <View
          style={{
            height: 150,
            width: '85%',
            backgroundColor: 'white',
            alignSelf: 'center',
            marginTop: 10,
            shadowColor: 'gray',
            elevation: 18,
            borderRadius: 5,
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
            <View>
              <Text style={{fontSize: 18, color: '#BD0451'}}>Total Orders</Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', margin: 6}}>
                <Text>{totalOrder}</Text>
                <Image
                  source={require('../assets/order.png')}
                  style={{height: 25, width: 25, marginLeft: 10}}
                />
              </View>
            </View>

            <View>
              <Text style={{fontSize: 18, color: '#BD0451'}}>Completed</Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', margin: 6}}>
                <Text>{complete}</Text>
                <Image
                  source={require('../assets/received.png')}
                  style={{height: 25, width: 25, marginLeft: 10}}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
            <View>
              <Text style={{fontSize: 18, color: '#BD0451'}}>Pending</Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', margin: 6}}>
                <Text>{pending}</Text>
                <Image
                  source={require('../assets/pending.png')}
                  style={{height: 25, width: 25, marginLeft: 10}}
                />
              </View>
            </View>

            <View>
              <Text style={{fontSize: 18, color: '#BD0451'}}>Cancelled</Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', margin: 6}}>
                <Text>{cancel}</Text>
                <Image
                  source={require('../assets/multiply.png')}
                  style={{height: 25, width: 25, marginLeft: 10}}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingTop: 30,
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;
const styles = StyleSheet.create({
  header: {
    height: '20%',
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
  },
  cardContainer: {
    height: 100,
    width: '40%',

    padding: 5,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'space-around',
  },
  dateFilter: {
    height: 30,
    width: 100,
    backgroundColor: '#BD0451',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
    justifyContent: 'space-around',
  },
});
