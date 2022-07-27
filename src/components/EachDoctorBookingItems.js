import { View, Text,Image } from 'react-native'
import React from 'react'

const EachDoctorBookingItems = ({item}) => {
  return (
    <View key={item.id} style={{flexDirection:'row',
    height: 180,
    width: '98%',
    backgroundColor: 'white',
    margin: 3,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#BD0451',
    borderRadius: 8,
    paddingHorizontal:10,
    
    }}>

        <View>
            <Text>Patient Info</Text>
            <Image
            source={require('../assets/profile.png')}
            style={{
                height:50,
                width: 50
            }}
            
            />
            <Text>{item.Patient_Name}</Text>
            <Text>{item.Patient_Phone}</Text>
            <Text>Age:{item.Patient_Age}</Text>
            <Text>Gender:{item.Patient_Gender}</Text>

        </View>

        {/* status */}

        <View style={{alignSelf:'center',alignItems:'center'}}>
            <Text>Booking ID:{item.id}</Text>
            <View>
                <Text>Meeting Status</Text>
            </View>
            <Text>{item.Meeting_Status}</Text>
        </View>

        <View>
            <Text>Doctor Info</Text>
            <Image
            source={require('../assets/doctor.png')}
            style={{height:50,width:50}}
            />

        </View>
      
    </View>
  )
}

export default EachDoctorBookingItems