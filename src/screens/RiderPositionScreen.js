import React, { useState, useRef, useEffect ,useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import { GOOGLE_MAP_KEY } from '../constants/googleMapKey';
import imagePath from '../constants/imagePath';
import MapViewDirections from 'react-native-maps-directions';
import Loader from '../components/Loader';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const RiderPositionScreen = ({ route }) => {
    const Rider_ID = route.params.rider_id;
    const mapRef = useRef()
   
    const [state, setState] = useState({
        curLocAdmin: {
            latitude: 23.760764538242192,
            longitude: 90.38877658171374,
        },
        riderCurrentLocation: {
            latitude: 23.7956,
             longitude: 90.3537,
       
        },
        isLoading: false,
        coordinate: new AnimatedRegion({
            latitude: 23.760764538242192,
            longitude: 90.38877658171374,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        time: 0,
        distance: 0,
        heading: 0

    })

     const { curLocAdmin, time, distance,  isLoading, coordinate,heading ,riderCurrentLocation} = state
     const updateState = (data) => setState((state) => ({ ...state, ...data }));
     
    const onCenter = () => {
        mapRef.current.animateToRegion({
            latitude: 23.760764538242192,
            longitude: 90.38877658171374,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

    const fetchTime = (d, t) => {
        updateState({
            distance: d,
            time: t
        })
    }

    useEffect(()=>{
        var ws = new WebSocket(`wss://api-care-box.click:8001/rider_location/${Rider_ID}/`);
        ws.onopen = e => {
          
          };
          ws.onmessage = e => {
              console.log('ee',e.data);
              
            const data = JSON.parse(e.data);
            var m = {
                'Custom-User-Agent':
                  '15!@ejh46)(*%#!@s4h68a4rgsagH&^%%$#@!JKFKVYRDTgjsgakjzghfjJ%$#@#%HFYD32434',
              };

              if (data.status === 'Websocket Connected') {
                ws.send(JSON.stringify(m));
        
                
              }
              console.log('data',data);
              
              if (data.latitude != undefined) {
                  console.log('mehedi',data.latitude);
                updateState({
                  riderCurrentLocation: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                  },
                });
              }
             
          }

    },[])

    return (
        <View style={styles.container}>

            {distance !== 0 && time !== 0 && (<View style={{ alignItems: 'center', marginVertical: 16 }}>
                <Text>Time left:  {time.toFixed(2)}  min</Text>
                <Text>Distance left:  {distance.toFixed(2)}  km</Text>
            </View>)}
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFill}
                    initialRegion={{
                        ...curLocAdmin,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >
                    {/* <Marker
                        coordinate={riderCurrentLocation}
                        image={imagePath.icGreenMarker}
                    /> */}
                    <Marker.Animated
                    coordinate={riderCurrentLocation}

                    >
                         <Image
                            source={imagePath.icBike}
                            style={{
                                width: 40,
                                height: 40,
                                transform: [{rotate: `${heading}deg`}]
                            }}
                            resizeMode="contain"
                        />

                    </Marker.Animated>

                    

                    {Object.keys(curLocAdmin).length > 0 && (<Marker
                        coordinate={curLocAdmin}
                        image={imagePath.icGreenMarker}
                    />)}

                    {Object.keys(riderCurrentLocation).length > 0 && (<MapViewDirections
                        origin={curLocAdmin}
                        destination={riderCurrentLocation}
                        apikey={GOOGLE_MAP_KEY}
                        strokeWidth={6}
                        strokeColor="hotpink"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${riderCurrentLocation.latitude,riderCurrentLocation.longitude}"`);
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            fetchTime(result.distance, result.duration),
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        // right: 30,
                                        // bottom: 300,
                                        // left: 30,
                                        // top: 100,
                                    },
                                });
                        }}
                        onError={(errorMessage) => {
                            // console.log('GOT AN ERROR');
                        }}
                    />)}
                </MapView>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0
                    }}
                    onPress={onCenter}
                >
                    <Image source={imagePath.greenIndicator} />
                </TouchableOpacity>
            </View>
          
            <Loader isLoading={isLoading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
   
    inpuStyle: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        height: 48,
        justifyContent: 'center',
        marginTop: 16
    }
});

export default RiderPositionScreen;
