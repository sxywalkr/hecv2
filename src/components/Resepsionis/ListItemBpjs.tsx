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
import database from '@react-native-firebase/database';
import { NavigationParams } from 'react-navigation';
import { UserContext } from '../../App';
import { Hmac, Pbkdf2 } from "@trackforce/react-native-crypto";
import utc from 'dayjs/plugin/utc' // load on demand
dayjs.extend(utc) // use plugin


// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Hero from '../Hero';
// import { getProviders } from '../../util/helpers';

interface Props {
  theme: Theme;
  navigation: NavigationParams;
}

function ListBookingBpjs({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [header1, setHeader1] = useState('');
  const [header2, setHeader2] = useState('');
  const [header3, setHeader3] = useState('');
  // const [userRole, setUserRole] = useState('')

  if (!user) {
    return null;
  }

  async function initHeader() {
    const iterations = 4096;
    const keyInBytes = 32;
    const message = '8004';
    const tstamp = dayjs().utc().unix() - dayjs('1970-01-01 00:00:00').utc().unix();
    const key = await Pbkdf2.hash('1iH08C361F', message + '&' + tstamp, iterations, keyInBytes, 'SHA256');
    const hmac256Hash = await Hmac.hmac256(message + '&' + tstamp, key);
    console.log(message + '&' + tstamp)
    setHeader1(hmac256Hash);
    setHeader2(dayjs().utc().unix() - dayjs('1970-01-01 00:00:00').utc().unix());
    setHeader3(dayjs().utc().unix());

  }

  useEffect(() => {
    initHeader()

    setLoading(false)
  }, [loading]);


// X-cons-id: 8004 
// X-timestamp: 1580274110 
// 8146bb043240185bad176a4630b0d4f745d895c861324e1dac5bb1686c174c69
// X-signature: ODE0NmJiMDQzMjQwMTg1YmFkMTc2YTQ2MzBiMGQ0Zjc0NWQ4OTVjODYxMzI0ZTFkYWM1YmIxNjg2YzE3NGM2OQ== 
// Content-Type: application/json; charset=utf-8 

  // useEffect(() => {
  //   // Create reference
  //   const ref = database().ref(`obat`)
  //   // .orderByChild('userFlagActivity').equalTo('Booking Antrian');
  //   ref.on('value', onSnapshot);
  //   return () => { ref.off() }
  // }, [items]);

  // function onSnapshot(snapshot) {
  //   const list = [];
  //   snapshot.forEach(item => {
  //     // console.log(item.val().userTanggalBooking2)
  //     list.push({
  //       key: item.val().itemIdObat,
  //       ...item.val(),
  //     });
  //   });
  //   setItems(list);
  //   setLoading(false);
  // }

  // function onDeleteItem(p) {
  //   Alert.alert(
  //     'Konfirmasi',
  //     'Yakin ingin menghapus obat ' + p.itemNamaObat + ' ?',
  //     [
  //       {
  //         text: 'Cancel',
  //         // onPress: () => hideDateTimePicker(),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK', onPress: () => {
  //           const ref = database().ref(`obat/${p.itemIdObat}`)
  //           ref.remove();
  //         }
  //       }
  //     ],
  //     { cancelable: false },
  //   )
  // }


  if (loading) {
    return <ActivityIndicator style={styles.container} animating={true} />;
  }

  return (
    <View style={styles.container} >
      <Caption>{header1}</Caption>
      <Caption>{header2}</Caption>
      <Caption>{header3}</Caption>
      {console.log('X-cons-id: ' + '8004')}
      {console.log('X-timestamp: ' + header2)}
      {console.log('X-signature: ' + header1)}

      {/* <FlatList data={items} renderItem={({ item }) =>
        <View style={styles.lists}>
          <View>
            <Subheading>{item.itemNamaObat}</Subheading>
            <Caption>{item.itemHargaJualObat}</Caption>
          </View>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Button onPress={() => navigation.navigate('ResepsionisEditItem', {q: 'Edit', r: item })}>Edit</Button>
            <Button onPress={() => onDeleteItem(item)}>Hapus</Button>
          </View>
        </View>
      } /> */}
      {/* <FAB
        color="#fff"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="add"
        onPress={() => navigation.navigate('ResepsionisEditItem', { q: 'New', r: 'New' })}
      /> */}
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
    marginHorizontal: -20,
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
    justifyContent: 'space-between',
    marginVertical: 4,
    paddingHorizontal: 5,
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

export default withTheme(ListBookingBpjs);
