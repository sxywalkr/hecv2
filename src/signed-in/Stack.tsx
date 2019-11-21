import {NavigationNativeContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Theme, withTheme} from 'react-native-paper';
import Profile from './Profile';
import Settings from './Settings';
import AppHome from '../components/Appx/AppHome';
import SAListUser from '../components/SysAdmin/ListUser';
import ResepsionisEditItem from '../components/Resepsionis/EditItem';
import ResepsionisListItem from '../components/Resepsionis/ListItem';
import ResepsionisEditDiagnosa from '../components/Resepsionis/EditDiagnosa';
import ResepsionisListDiagnosa from '../components/Resepsionis/ListDiagnosa';
import ResepsionisListBooking from '../components/Resepsionis/ListBooking';
import ResepsionisListBookingByDay from '../components/Resepsionis/ListBookingByDay';
import DokterListBookingByDay from '../components/Dokter/ListBookingByDay';
import DokterViewRekamMedik from '../components/Dokter/ViewRekamMedik';


interface Props {
  theme: Theme;
}

const Stack = createStackNavigator();

function SignedInStack({theme}: Props) {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator 
        initialRouteName='AppHome'
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.accent,
        }}>
        <Stack.Screen name="AppHome" component={AppHome} options={{header: null}}/>
        <Stack.Screen name="SAListUser" component={SAListUser} options={{title: 'List User App'}} />
        <Stack.Screen name="ResepsionisEditItem" component={ResepsionisEditItem} options={{title: 'Edit Obat'}} />
        <Stack.Screen name="ResepsionisListItem" component={ResepsionisListItem} options={{title: 'List Obat'}} />
        <Stack.Screen name="ResepsionisEditDiagnosa" component={ResepsionisEditDiagnosa} options={{title: 'Edit Diagnosa'}} />
        <Stack.Screen name="ResepsionisListDiagnosa" component={ResepsionisListDiagnosa} options={{title: 'List Diagnosa'}} />
        <Stack.Screen name="ResepsionisListBooking" component={ResepsionisListBooking} options={{title: 'List User Booking'}} />
        <Stack.Screen name="ResepsionisListBookingByDay" component={ResepsionisListBookingByDay} options={{title: 'List User Booking By Day'}} />
        <Stack.Screen name="DokterListBookingByDay" component={DokterListBookingByDay} options={{title: 'List User Booking By Day'}} />
        <Stack.Screen name="DokterViewRekamMedik" component={DokterViewRekamMedik} />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{header: null}}
        />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}

export default withTheme(SignedInStack);
