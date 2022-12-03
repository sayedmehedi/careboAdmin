import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import EachCoinRequest from '../components/EachCoinRequest'





const renderAllReguest = ({ item }) => <EachCoinRequest item={item} />;
const UseCoinRequestScreen = () => {

    const [allRequest, setAllRequest] = useState(null)

    useEffect(() => {
        var ws = new WebSocket(`wss://api-care-box.click:8001/pos/admin/4/`);
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
            setAllRequest(parsData?.requests)
        }
        ws.onerror = (e) => {
            console.log('errrorrrr', e.message);

        };

    }, [])


    return (
        <View>
            <FlatList
                data={allRequest}
                renderItem={renderAllReguest}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default UseCoinRequestScreen