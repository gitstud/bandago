import React from 'react';
import { StyleSheet, Button, Text, TextInput, View, Alert } from 'react-native';
import type {
  NavigationRoute,
  NavigationAction,
  NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition';
import firebase from '../../lib/firebase';

type Props = {
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
};

type State = {
  username: string,
  error: ?string,
};

type ErrorLabelProps = {
  error: string
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    padding: 32,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  textInput: {
    borderColor: '#222',
    borderWidth: 1,
    height: 60,
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

const ErrorLabel = (props: ErrorLabelProps) => (
  <Text style={styles.error}>{props.error}</Text>
);

export default class SignUpReservationNumber extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state: State = {
    username: '',
    error: null,
  };

  props: Props;

  checkUsername = () => {
    const { navigate, state } = this.props.navigation;

    if (state.params && state.params.email) {
      const { email } = state.params;
      navigate('SignUpPassword', {
        email,
        username: this.state.username,
      });
    } else {
      Alert.alert('Error', 'Something went wrong.  Please try again.');
      navigate('Splash');
    }
  }

  render() {
    const { username, error } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enter</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(value: string) => {
            this.setState({ username: value });
            this.findExistingUserName();
          }}
          value={username}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
        />
        { error && <ErrorLabel error={error} /> }
        <Button
          title="Next"
          onPress={this.checkUsername}
          color="#841584"
          accessibilityLabel="Proceed to password screen"
          disabled={username.length === 0}
        />
      </View>
    );
  }
}
