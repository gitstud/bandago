'use strict';

import React, { Component } from 'react';
import { DatePickerIOS, StyleSheet, Text, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
  textinput: {
    height: 26,
    width: 50,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    padding: 4,
    fontSize: 13,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  labelView: {
    marginRight: 10,
    paddingVertical: 2,
  },
  label: {
    fontWeight: '500',
  },
  headingContainer: {
    padding: 4,
    backgroundColor: '#f6f7f8',
  },
  heading: {
    fontWeight: '500',
    fontSize: 14,
  },
});

function WithLabel(props) {
    return (
      <View style={styles.labelContainer}>
        <View style={styles.labelView}>
          <Text style={styles.label}>
            {props.label}
          </Text>
        </View>
        {props.children}
      </View>
    );
}

function Heading(props) {
    return (
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>
          {props.label}
        </Text>
      </View>
    );
}

export default class DatePicker extends React.Component {

  state = {
    date: this.props.date,
    timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
  }

  getInitialState() {
    return {
      date: this.props.date,
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
    };
  }

  componentDidMount() {
    const date = new Date();
    const timeZoneOffsetInHours = (-1) * (new Date()).getTimezoneOffset() / 60;
    this.setState({
      date,
      timeZoneOffsetInHours,
    })
  }

  onDateChange = (date) => {
    this.setState({ date });
    this.props.onDateChange(date);
  }

  onTimeZoneChange = (event) => {
    const offset = parseInt(event.nativeEvent.text, 10);
    if (isNaN(offset)) {
      return;
    }
    this.setState({timeZoneOffsetInHours: offset});
  }

  render() {
    return (
      <View>
        <DatePickerIOS
          date={this.state.date}
          mode="datetime"
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          onDateChange={this.onDateChange}
          minuteInterval={30}
        />
        <WithLabel label="Timezone:">
          <TextInput
            onChange={this.onTimezoneChange}
            style={styles.textinput}
            value={this.state.timeZoneOffsetInHours.toString()}
          />
          <Text> hours from UTC</Text>
        </WithLabel>
      </View>
    );
  }

}
