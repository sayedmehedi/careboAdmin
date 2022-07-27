import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  ImageBackground,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
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

const EashReportItems = ({item}) => {
  const testID = item.id;
  const [showMenu, setShowMenu] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [singleFile, setSingleFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      // Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      setSingleFile(res);
    } catch (err) {
      setSingleFile(null);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  useEffect(() => {
    getData();
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

  //() => setModalVisible(false)

  const showToastWithGravity = () => {
    ToastAndroid.showWithGravity(
      "Updated Successfully",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  const saveButtonClicked = () => {
    setIsLoading(true);

    if (singleFile != null) {

      try {
        
        const api = `https://www.api-care-box.click/api/v2/pathology/report_upload_api/${testID}/`;
        console.log('api',api);
        var body = new FormData();
        body.append(
          'Report',
          // singleFile,
          {
            uri: singleFile[0].uri,
            type: singleFile[0].type,
            name: singleFile[0].name,
          },
        );
        console.log('report data',singleFile[0].type);
        axios
          .put(api, body, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          })
          .then(res => {
            console.log('teeeeeeeeeeeeeeee', res.data);
            setModalVisible(false);
            setIsLoading(false);
            showToastWithGravity();
          })
          .catch(error => {
            console.log('error', error);
            setModalVisible(false);
            setIsLoading(false);
          });
      } catch (error) {
        console.log('error in updating status : ', error);
        setIsLoading(false);
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
              width: 230,
              backgroundColor: 'white',
              borderRadius: 10,
              shadowColor: 'gray',
              elevation: 15,
              margin: 5,
              padding: 15,
              justifyContent: 'center',

              alignItems: 'center',
            }}>
            <ImageBackground
              source={require('../assets/upload.png')}
              style={{height: 100, width: 100, borderRadius: 5}}>
              <TouchableOpacity
                onPress={selectFile}
                style={{
                  height: 100,
                  width: 100,
                  backgroundColor: 'rgba(0,0,0,0)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
               
                  
             
                
              </TouchableOpacity>
            </ImageBackground>

            <TouchableOpacity
              style={{
                height: 30,
                width: 140,
                backgroundColor: '#BD0451',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                alignSelf: 'center',
                marginTop: 5,
              }}
              onPress={saveButtonClicked}>
                {
                  isLoading? <ActivityIndicator size="small" color="white" />:
                  <Text style={{color: 'white'}}>Save</Text>
                }
              
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
            source={require('../assets/report.png')}
            style={{height: 50, width: 50}}
          />
        </View>

        <View style={{padding: 20, flex: 1, justifyContent: 'space-around'}}>
          <Text style={{color: 'black'}}>
            Sample Collection :
            <Text style={{color: '#BD0451'}}>
              {item.Sample_Collection_Status}
            </Text>
          </Text>

          <View>
            <View
              style={{
                backgroundColor: '#BD0451',
                width: 70,
                margin: 5,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3,
                height: 15,
              }}>
              <Text style={{fontSize: 8, color: 'white'}}>Report Status</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#BD0451'}}>{item.Report_Status}</Text>
              <Image
                source={require('../assets/pending.png')}
                style={{height: 25, width: 25, marginLeft: 20}}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.actionButton}>
            <Text style={{color: 'white', fontSize: 14, marginRight: 3}}>
              Upload
            </Text>
            <AntDesign name="upload" size={14} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
      {showMenu && (
        <View
          style={{
            height: 100,
            width: '98%',
            alignSelf: 'center',
            borderRadius: 5,
            padding: 10,
            backgroundColor: 'white',
            shadowColor: 'black',
            elevation: 18,
            margin: 5,
          }}>
          {item.ordered_medical_test.map(i => rederItem(i))}
        </View>
      )}
    </>
  );
};

export default EashReportItems;
const styles = StyleSheet.create({
  actionButton: {
    height: 30,
    width: 80,
    backgroundColor: '#BD0451',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
