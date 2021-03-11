import React from "react"
import {View, Slider, Text} from 'react-native'

export default function UdaciSlider({max, unit, step, value, onChange}) {
    return (
        <View>
            <Slider
                step={step}
                value={value}
                minimmumValue={0}
                maximumValue={max}
                onValueChange={onChange}
            />
            <View>
                <Text>{value}</Text>
                <Text>{unit}</Text>
            </View>
        </View>
    )
}
