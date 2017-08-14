
import { StackNavigator, DrawerNavigator, TabNavigator } from 'react-navigation';

import type { NavigationComponent } from 'react-navigation/src/TypeDefinition';

import Splash from './screens/Splash';
import SignUpEmailAndPassword from './screens/SignUpEmailAndPassword';
import SignUpReservationNumber from './screens/SignUpReservationNumber';
import SignIn from './screens/SignIn';
import Profile from './screens/Profile';
import ReportDamage from './screens/ReportDamage';

import Feed from './screens/Feed';

export const SignedOut: NavigationComponent = StackNavigator({
  Splash: {
    screen: Splash,
  },
  SignUpEmailAndPassword: {
    screen: SignUpEmailAndPassword,
  },
  SignUpReservationNumber: {
    screen: SignUpReservationNumber,
  },
  SignIn: {
    screen: SignIn,
  },
});

export const SignedIn: NavigationComponent = TabNavigator({
  Feed: {
    screen: Feed,
  },
  Profile: {
    screen: Profile,
  },
  ReportDamage: {
    screen: ReportDamage,
  },
}, {
  tabBarPosition: 'bottom',
  activeTintColor: '#000000',
  inactiveTintColor: 'green',
  swipeEnabled: true,
});

export const createRootNavigator: NavigationComponent = (signedIn: boolean) =>
  StackNavigator(
    {
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
      SignedIn: {
        screen: SignedIn,
      },
    },
    {
      mode: 'modal',
      initialRouteName: signedIn ? 'SignedIn' : 'SignedOut',
    },
  );
