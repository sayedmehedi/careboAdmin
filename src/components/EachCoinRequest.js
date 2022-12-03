import { View, Text,StyleSheet,FlatList} from 'react-native'
import React,{useEffect,useState} from 'react'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'

const EachCoinRequest = ({item}) => {

    const [check,setCheck] = useState(false);
    var ws = new WebSocket(`wss://api-care-box.click:8001/pos/admin/4/`);
    

    useEffect(() => {
        
        ws.onopen = e => {
            var m = {
                'type': 'Authentication',
                'Custom-User-Agent':
                    '15!@ejh46)(*%#!@s4h68a4rgsagH&^%%$#@!JKFKVYRDTgjsgakjzghfjJ%$#@#%HFYD32434',
            };
            ws.send(JSON.stringify(m));

        };
        ws.onmessage = e => {
            const parsData = JSON.parse(e.data);
           // console.log('mehedi',parsData);
           // setAllRequest(parsData?.requests)
        }
        ws.onerror = (e) => {
            console.log('errrorrrr', e.message);

        };

    }, [check])

    const handleAccept = () => {
        console.log('item id',item.id);
        if(item.id)
        {
            setCheck(true)
            var n = {
                'type': 'response_to_cashier_for_member_point_request',
                'request_id':item.id,
                'request_status':'accept'
    
            };
            ws.send(JSON.stringify(n));
            console.log('test....success ');
        }
        
    }
   
  return (
    <View style={styles.container}>

        <View >
            <SimpleLineIcons name='user-following' size={20}/>
            <Text style={{fontWeight:'bold'}}>{item.user_member__Name}</Text>
            <Text>{item.user_member__Phone}</Text>
        </View>

        <View>
            <Text>order Id: {item.id}</Text>
            <Text>Request coin: {item.requested_point}</Text>

            <Text>Requested Cashier: {item.requested_cashier}</Text>

            <View style={{flexDirection:'row',marginTop:5}}>
                <TouchableOpacity 
                onPress={handleAccept}
                style={{
                    height:30,
                    width:70,
                    backgroundColor:'white',
                    borderWidth:1,
                    borderColor:'green',
                    borderRadius:5,
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <Text>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    height:30,
                    width:70,
                    backgroundColor:'red',
                   
                    
                    borderRadius:5,
                    justifyContent:'center',
                    alignItems:'center',
                    marginLeft:5
                }}>
                    <Text style={{color:'white'}}>Reject</Text>
                </TouchableOpacity>
            </View>

        </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        height:150,
        width:'100%',
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:1,
        paddingHorizontal:15,
        justifyContent:'space-between'
    }
})

export default EachCoinRequest