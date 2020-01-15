import dayjs from 'dayjs';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ScrollView, Alert } from 'react-native';
import {
  Avatar,
  Caption,
  FAB,
  Headline,
  Subheading,
  Theme,
  Title,
  Text,
  withTheme,
  Button,
  ActivityIndicator,
  Paragraph,
} from 'react-native-paper';
import database, { firebase } from '@react-native-firebase/database';
import DateTimePicker from "react-native-modal-datetime-picker";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationParams } from 'react-navigation';
import { UserContext } from '../../App';
import Hero from '../Hero';
import { getProviders } from '../../util/helpers';

interface Props {
  theme: Theme;
  navigation: NavigationParams;
}

function Booking({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState();
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
  const [nomorAntrianPasien, setNomorAntrianPasien] = useState()

  if (!user) {
    return null;
  }

  useEffect(() => {
    const ref = database().ref(`users/${user.uid}`);
    ref.once('value', (snapshot) => {
      setBookingDate(snapshot.val().userTanggalBooking ? dayjs(snapshot.val().userTanggalBooking).format('D MMMM YYYY') : '');
      setNomorAntrianPasien(snapshot.val().userNomorAntrian);
    });
    setLoading(false)
    return () => { ref.off() }
  }, [loading]);

  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true)
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false)
  };

  const handleDatePicked = date => {
    Alert.alert(
      'Konfirmasi Booking',
      'Anda booking antrian pada tanggal ' + dayjs(date).format('D MMMM YYYY') + '. Proses Booking ?',
      [
        {
          text: 'Cancel',
          onPress: () => hideDateTimePicker(),
          style: 'cancel',
        },
        {
          text: 'OK', onPress: () => {
            const a = dayjs(date).format();
            const ref = database().ref(`users/${user.uid}`);
            const ref1 = database().ref(`daftarTunggu/indexes/${dayjs(date).format("YYYY-MM-DD")}`).once('value');
            setBookingDate(a);
            ref1.then((res) => {
              if (res.exists()) {
                database().ref(`daftarTunggu/indexes/${dayjs(date).format("YYYY-MM-DD")}`).update({
                  nomorAntrianPasien: res.val().nomorAntrianPasien + 1
                })
                setNomorAntrianPasien(res.val().nomorAntrianPasien + 1)
                ref.update({
                  userTanggalBooking: a,
                  userTanggalBooking2: dayjs(date).format("YYYY-MM-DD"),
                  userNomorAntrian: res.val().nomorAntrianPasien + 1,
                  userFlagActivity: 'Booking Antrian',
                });
              } else {
                database().ref(`daftarTunggu/indexes/${dayjs(date).format("YYYY-MM-DD")}`).update({
                  nomorAntrianPasien: 1
                })
                setNomorAntrianPasien(1)
                ref.update({
                  userTanggalBooking: a,
                  userTanggalBooking2: dayjs(date).format("YYYY-MM-DD"),
                  userNomorAntrian: 1,
                  userFlagActivity: 'Booking Antrian',
                });
              }
            })
            hideDateTimePicker();
            // console.log('OK Pressed')
          }
        },
      ],
      { cancelable: false },
    );


  };


  if (loading) {
    return <ActivityIndicator style={styles.container} animating={true} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {!bookingDate ?
          <View>
            <Title>Pilih Booking</Title>
            <Paragraph>Silahkan pilih tanggal booking Anda.</Paragraph>
          </View>
          :
          <View>
            <Title>Nomor booking : {nomorAntrianPasien}</Title>
            <Subheading>Tanggal booking Anda {dayjs(bookingDate).format('D MMMM YYYY')}.</Subheading>
          </View>
        }
        <Button
          mode='outlined' style={styles.button} disabled={!!bookingDate}
          onPress={showDateTimePicker}>
          Pilih Tanggal
        </Button>
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={handleDatePicked}
          onCancel={hideDateTimePicker}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
  },
  profile: {
    marginTop: -50,
    paddingVertical: 10,
  },
  avatar: {
    borderColor: '#fff',
    borderWidth: 5,
    elevation: 4,
  },
  lists: {
    backgroundColor: '#F6F7F8',
    elevation: 4,
    flexDirection: 'column',
    // justifyContent: 'space-evenly',
    marginVertical: 4,
    paddingHorizontal: 3,
  },
  providers: {
    backgroundColor: '#F6F7F8',
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 30,
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  button: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  center: {
    width: '100%',
    alignItems: 'center',
  },
});

export default withTheme(Booking);
