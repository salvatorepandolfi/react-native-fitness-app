import React, {Component} from 'react'
import {View, Text, StyleSheet, Platform, TouchableOpacity} from "react-native"
import {connect} from 'react-redux'
import {receiveEntries, addEntry} from "../actions"
import {timeToString, getDailyReminderValue} from "../utils/helpers"
import {fetchCalendarResults} from "../utils/api"
import {Agenda} from 'react-native-calendars'
import DateHeader from "./DateHeader";
import {blue, gray, white} from "../utils/colors";
import MetricCard from "./MetricCard";
import AppLoading from 'expo-app-loading';


class History extends Component {
    state = {
        ready: false
    }

    componentDidMount() {
        const {dispatch} = this.props
        fetchCalendarResults()
            .then((entries) => dispatch(receiveEntries(entries)))
            .then(({entries}) => {
                if (!entries[timeToString()]) {
                    dispatch(addEntry({
                        [timeToString()]: getDailyReminderValue()
                    }))
                }
            })
            .then(() => this.setState(() => ({ready: true})))

    }

    renderEmptyDate(formattedDate) {
        return (
            <View style={styles.item}>
                <DateHeader date={formattedDate}/>
                <Text styles={styles.noDataText}>
                    You didn't log any data in this day.
                </Text>
            </View>
        )

    }

    renderItem = ({key, metrics}) => {

        const [curMetrics] =metrics
        const {today}= curMetrics
        return (
            <View style={styles.item}>
                {today
                    ? <View>
                        {/*<DateHeader date={formattedDate}/>*/}
                        <Text style={styles.noDataText}>
                            {today}
                        </Text>
                    </View>
                    : <TouchableOpacity onPress={() => this.props.navigation.navigate(
                        'EntryDetail',
                        {entryId: key}
                    )}>
                        <MetricCard metrics={curMetrics}/>
                    </TouchableOpacity>
                }
            </View>
        )
    }

    render() {
        const {ready} = this.state
        const {entries} = this.props
        // console.log(entries)
        if (ready === false) {
            return (<AppLoading/>)
        }
        return (
            <Agenda
                items={entries}
                renderItem={this.renderItem}
                renderEmptyDate={this.renderEmptyDate}
            />
        )
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: white,
        borderRadius: Platform.OS === 'ios' ? 2 : 16,
        padding: 20,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 17,
        justifyContent: 'center',
        shadowRadius: 3,
        shadowOpacity: 0.8,
        shadowColor: 'rgba(255,255,255,0.24)',
        shadowOffset: {
            width: 0,
            height: 3,
        }
    },
    noDataText: {
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 20,
    }
})

function mapStateToProps(entries) {
    const formattedEntries = {}
    Object.keys(entries).forEach(key => (formattedEntries[key] = [{
            key,
            metrics: entries[key]
        }])
    )
    return {entries: formattedEntries}
}

export default connect(mapStateToProps)(History)
