import React, {Component} from 'react'
import {View, Text, ActivityIndicator, StyleSheet, TouchableOpacity} from "react-native";
import {purple, white} from "../utils/colors";
import {Foundation} from '@expo/vector-icons'
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import {calculateDirection} from "../utils/helpers";


export default class Live extends Component {

    state = {
        coords: null,
        status: 'undetermined',
        direction: ''
    }


    componentDidMount() {
        Location.requestPermissionsAsync()
            .then(({status}) => {
                if (status === 'granted') {
                    this.setLocation()
                }
                this.setState(() => {
                    status
                })
            })
            .catch((error) => {
                console.warn('Error getting location permissions: ', error)
                this.setState(() => {
                    state:'undetermined'
                })
            })

    }

    askPermissions = () => {
        Permissions.askAsync(Permissions.location)
            .then(({status}) => {
                if (status === 'granted') {
                    return this.setLocation()
                }
                this.setState(() => {
                    status
                })
            })
            .catch((error) => {
                console.warn('Error getting location permissions: ', error)
                this.setState(() => {
                    state:'undetermined'
                })
            })
    }
    setLocation = () => {
        Location.watchPositionAsync({
            enableHighAccuracy: true,
            timeInterval: 1,
            distanceInterval: 1
        }, ({coords}) => {
            const newDirection = calculateDirection(coords.heading)
            const {direction} = this.state
            this.setState(() => ({
                coords,
                status: 'granted',
                direction: newDirection
            }))
        })
    }


    render() {
        const {status, coords, direction} = this.state

        if (status === null) {
            return <View style={styles.container}>
                <ActivityIndicator size="large" color={purple}/>
            </View>
        }

        if (status === 'denied') {
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50}/>
                    <Text>
                        You denied your location. Fix it enabling settings for this app.
                    </Text>
                </View>
            )
        }
        if (status === 'undetermined') {
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50}/>
                    <Text>
                        You need to enable location services for this app.
                    </Text>
                    <TouchableOpacity onPress={this.askPermissions} style={styles.button}>
                        <Text style={styles.buttonText}>Enable</Text>
                    </TouchableOpacity>

                </View>
            )
        }

        return (
            <View style={styles.container}>
                <View style={styles.directionContainer}>
                    <Text style={styles.header}>You're heading</Text>
                    <Text style={styles.direction}>{direction}</Text>
                </View>
                <View style={styles.metricContainer}>
                    <View style={styles.metric}>
                        <Text style={[styles.header, {color: white}]}>
                            Altitude
                        </Text>
                        <Text style={[styles.subHeader, {color: white}]}>
                            {Math.round(coords.altitude)} METERS
                        </Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={[styles.header, {color: white}]}>
                            Speed
                        </Text>
                        <Text style={[styles.subHeader, {color: white}]}>
                            {Math.round(coords.speed)} KPH
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    },
    button: {
        padding: 10,
        backgroundColor: purple,
        alignSelf: 'center',
        borderRadius: 5,
        margin: 20
    },
    buttonText: {
        color: white,
        fontSize: 20
    },
    directionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        fontSize: 35,
        textAlign: 'center',
    },
    direction: {
        color: purple,
        fontSize: 120,
        textAlign: 'center',
    },
    metricContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: purple,
    },
    metric: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    subHeader: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 5,
    },
})

