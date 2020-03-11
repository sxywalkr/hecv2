import {NavigationNativeContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Theme, withTheme} from 'react-native-paper';
import Profile from './Profile';
import Settings from './Settings';
import AppHome from '../components/Appx/AppHome';
import SAListUser from '../components/SysAdmin/ListUser';
import ResepsionisListItemBpjs from '../components/Resepsionis/ListItemBpjs';
import ResepsionisListItemUmum from '../components/Resepsionis/ListItemUmum';
import ResepsionisListItem from '../components/Resepsionis/ListItem';
import ResepsionisEditItem from '../components/Resepsionis/EditItem';
import ResepsionisEditDiagnosa from '../components/Resepsionis/EditDiagnosa';
import ResepsionisListDiagnosa from '../components/Resepsionis/ListDiagnosa';
import ResepsionisEditTindakanNonOp from '../components/Resepsionis/EditTindakanNonOp';
import ResepsionisListTindakanNonOp from '../components/Resepsionis/ListTindakanNonOp';
import ResepsionisEditTindakanOp from '../components/Resepsionis/EditTindakanOp';
import ResepsionisListTindakanOp from '../components/Resepsionis/ListTindakanOp';
import ResepsionisEditKacamata from '../components/Resepsionis/EditKacamata';
import ResepsionisListKacamata from '../components/Resepsionis/ListKacamata';
import ResepsionisListBooking from '../components/Resepsionis/ListBooking';
import ResepsionisListBookingByDay from '../components/Resepsionis/ListBookingByDay';
import ResepsionisListBookingByDayDisplay from '../components/Resepsionis/ListBookingByDayDisplay';
import DokterListBookingByDay from '../components/Dokter/ListBookingByDay';
import DokterListBookingOka from '../components/Dokter/ListBookingOka';
import DokterListBookingOkaByDay from '../components/Dokter/ListBookingOkaByDay';
import DokterViewRekamMedik from '../components/Dokter/ViewRekamMedik';
import ApotekListBooking from '../components/Apotek/ListBookingApotek'
import ApotekListBookingByDay from '../components/Apotek/ListBookingApotekByDay'
import BillingListBooking from '../components/Billing/ListBookingBilling'
import BillingListBookingByDay from '../components/Billing/ListBookingBillingByDay'
import OkaListBooking from '../components/Oka/ListBookingOka'
import OkaListBookingByDay from '../components/Oka/ListBookingOkaByDay'
import OkaViewRekamMedik from '../components/Oka/OkaViewRekamMedik'

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
        <Stack.Screen name="ResepsionisListItemBpjs" component={ResepsionisListItemBpjs} options={{title: 'Registrasi Pasien BPJS'}} />
        <Stack.Screen name="ResepsionisListItemUmum" component={ResepsionisListItemUmum} options={{title: 'Registrasi Pasien Umum'}} />
        <Stack.Screen name="ResepsionisListItem" component={ResepsionisListItem} options={{title: 'List Obat'}} />
        <Stack.Screen name="ResepsionisEditItem" component={ResepsionisEditItem} options={{title: 'Edit Obat'}} />
        <Stack.Screen name="ResepsionisEditDiagnosa" component={ResepsionisEditDiagnosa} options={{title: 'Edit Diagnosa'}} />
        <Stack.Screen name="ResepsionisListDiagnosa" component={ResepsionisListDiagnosa} options={{title: 'List Diagnosa'}} />
        <Stack.Screen name="ResepsionisListBooking" component={ResepsionisListBooking} options={{title: 'List User Booking'}} />
        <Stack.Screen name="ResepsionisEditTindakanNonOp" component={ResepsionisEditTindakanNonOp} options={{title: 'Edit Tindakan Non Operasi'}} />
        <Stack.Screen name="ResepsionisListTindakanNonOp" component={ResepsionisListTindakanNonOp} options={{title: 'List Tindakan Non Operasi'}} />
        <Stack.Screen name="ResepsionisEditTindakanOp" component={ResepsionisEditTindakanOp} options={{title: 'Edit Tindakan  Operasi'}} />
        <Stack.Screen name="ResepsionisListTindakanOp" component={ResepsionisListTindakanOp} options={{title: 'List Tindakan  Operasi'}} />
        <Stack.Screen name="ResepsionisEditKacamata" component={ResepsionisEditKacamata} options={{title: 'Edit Kacamata'}} />
        <Stack.Screen name="ResepsionisListKacamata" component={ResepsionisListKacamata} options={{title: 'List Kacamata'}} />
        <Stack.Screen name="ResepsionisListBookingByDay" component={ResepsionisListBookingByDay} options={{title: 'List User Booking By Day'}} />
        <Stack.Screen name="ResepsionisListBookingByDayDisplay" component={ResepsionisListBookingByDayDisplay} options={{header: null}} />
        <Stack.Screen name="DokterListBookingByDay" component={DokterListBookingByDay} options={{title: 'List User Booking By Day'}} />
        <Stack.Screen name="DokterListBookingOka" component={DokterListBookingOka} options={{title: 'List User Booking Kamar Operasi'}} />
        <Stack.Screen name="DokterListBookingOkaByDay" component={DokterListBookingOkaByDay} options={{title: 'List User Booking Kamar Operasi By Day'}} />
        <Stack.Screen name="DokterViewRekamMedik" component={DokterViewRekamMedik} options={{title: 'View Rekam Medik'}} />
        <Stack.Screen name="ApotekListBooking" component={ApotekListBooking} options={{title: 'List Antri Apotek'}} />
        <Stack.Screen name="ApotekListBookingByDay" component={ApotekListBookingByDay} options={{title: 'List Antri Apotek By Day'}} />
        <Stack.Screen name="BillingListBooking" component={BillingListBooking} options={{title: 'List Antri Billing'}} />
        <Stack.Screen name="BillingListBookingByDay" component={BillingListBookingByDay} options={{title: 'List Antri Billing By Day'}} />
        <Stack.Screen name="OkaListBooking" component={OkaListBooking} options={{title: 'List Antri Oka'}} />
        <Stack.Screen name="OkaListBookingByDay" component={OkaListBookingByDay} options={{title: 'List Antri Oka By Day'}} />
        <Stack.Screen name="OkaViewRekamMedik" component={OkaViewRekamMedik} options={{title: 'View Rekam Medik'}} />
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
