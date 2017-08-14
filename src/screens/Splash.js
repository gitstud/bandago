import React from 'react';
import { Facebook } from 'expo';
import { StyleSheet, Button, Text, View, Alert } from 'react-native';
import type {
  NavigationRoute,
  NavigationAction,
  NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition';
import firebase from '../../lib/firebase';

type Props = {
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>
};

type FacebookLoginResponse = {
  type: string,
  token: string,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    padding: 32,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 150,
  },
  signInContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  caption: {
    fontSize: 18,
  },
});

export default class Splash extends React.Component {
  static navigationOptions = {
    header: null,
  };

  props: Props;

  signInWithFacebook = () => {
    Facebook.logInWithReadPermissionsAsync('109004536389072', {
    }).then((res: FacebookLoginResponse) => {
      const { type, token } = res;
      if (type === 'success') {
        const credential = firebase.auth().FacebookAuthProvider.credential(token);
        firebase.auth().signInWithCredential(credential).catch((error: Error) => {
          Alert.alert('Something went wrong', error.message);
        });
      }
    }).catch((error: Error) => {
      Alert.alert('Error', error.message);
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to the Bandago Support App</Text>
          <Text style={styles.caption}>Everything you need for a smooth rental experience</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this.signInWithFacebook}
            title="Log In with Facebook"
            color="blue"
            accessibilityLabel="Log In With Facebook"
          />
          <Button
            onPress={() => navigate('SignUpEmailAndPassword')}
            title="Sign Up With Email"
            color="blue"
            accessibilityLabel="Sign Up WIth Email"
          />
          <View style={styles.signInContainer}>
            <Button
              title="Already have an account?"
              color="blue"
              onPress={() => navigate('SignIn')}
            />
          </View>
        </View>
      </View>
    );
  }
}
