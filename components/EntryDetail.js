import React, {Component} from 'react'
import {View, Text, StyleSheet} from "react-native";
import {connect} from 'react-redux'
import MetricCard from "./MetricCard";

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
    };

    render() {
        const {metrics} = this.props
        return (
            <View style={styles.container}>
                <MetricCard metrics={metrics}/>
                <Text>Entry Detail - {JSON.stringify(this.props.route.params.entryId)}</Text>
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
    const entryId = route.params.entryId
    const [metrics] = state[entryId]
    return {
        entryId,
        metrics: metrics
    }
}
export default connect(mapStateToProps)(EntryDetail)
