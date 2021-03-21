import React, {Component} from 'react'
import {View, Text, StyleSheet} from "react-native";
import {connect} from 'react-redux'
import MetricCard from "./MetricCard";
import {addEntry} from "../actions";
import {removeEntry} from "../utils/api";
import {timeToString, getDailyReminderValue} from "../utils/helpers";
import TextButton from "./TextButton";

class EntryDetail extends Component {
    componentDidMount() {
        this.setTitle(this.props.route.params.entryId);
    }

    setTitle = (entryId) => {
        if (!entryId) return;
        const year = entryId.slice(0, 4)
        const month = entryId.slice(5, 7)
        const day = entryId.slice(8)
        this.props.navigation.setOptions({title: `${month}/${day}/${year}`});
    }


    reset = () => {
        const {remove, goBack, entryId} = this.props
        remove()
        goBack()
        removeEntry(entryId)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.metrics !== undefined && !nextProps.metrics.today
    }

    render() {
        const {metrics} = this.props
        return (
            <View style={styles.container}>
                <MetricCard metrics={metrics}/>
                <TextButton onPress={this.reset} style={{margin: 20}}>
                    Reset
                </TextButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    }
})

const mapStateToProps = (state, {route}) => {
    const {entryId} = route.params
    const [metrics] = state[entryId]
    return {
        entryId,
        metrics: metrics
    }
}

const mapDispatchToProps = (dispatch, {navigation, route}) => {
    const {entryId} = route.params
    return {
        remove: () => {
            const entry = {
                [entryId]: timeToString() === entryId
                ? getDailyReminderValue()
                : []
            }
            console.log(entry)

            dispatch(addEntry({
                [entryId]: timeToString() === entryId
                    ? getDailyReminderValue()
                    : []
            }))
        },
        goBack: () => navigation.goBack()
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)
