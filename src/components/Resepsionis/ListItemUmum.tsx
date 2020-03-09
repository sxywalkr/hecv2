import dayjs from 'dayjs';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ScrollView, Alert, Keyboard } from 'react-native';
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
  TextInput,
} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { NavigationParams } from 'react-navigation';
import { UserContext } from '../../App';
// import { Hmac, Pbkdf2 } from "@trackforce/react-native-crypto";
// import utc from 'dayjs/plugin/utc' // load on demand
// dayjs.extend(utc) // use plugin
import axios from 'axios';
import DateTimePicker from "react-native-modal-datetime-picker";


// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Hero from '../Hero';
// import { getProviders } from '../../util/helpers';

interface Props {
  theme: Theme;
  navigation: NavigationParams;
}

function ListBookingBpjs({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [param1, setParam1] = useState();
  const [param2, setParam2] = useState();
  // const [itemNomorBpjs, setItemNomorBpjs] = useState('');
  const [header, setHeader] = useState('');
  const [result, setResult] = useState();
  // const [pasienNoBpjs, setPasienNoBpjs] = useState();
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
  const [bookingDate, setBookingDate] = useState();
  
  const [pasienNomorKtp, setPasienNomorKtp] = useState('000001111112345')
  const [pasienNama, setPasienNama] = useState()
  const [pasienSex, setPasienSex] = useState()
  const [pasienTanggalLahir, setPasienTanggalLahir] = useState()
  const [pasienNomorAntrian, setPasienNomorAntrian] = useState()
  const [appMessage, setAppMessage] = useState('Waiting')
  const [appMessage2, setAppMessage2] = useState('')


  if (!user) {
    return null;
  }

  const handleBookingOffline = () => {
    setLoading2(true)
    // cari pasien dulu
    const cekPasien = database().ref('users').orderByChild('userNoBpjs').equalTo(pasienNomorKtp).once('value');
    cekPasien.then((res) => {
      if (res.exists()) {
        // existing user
        const objUserUid = Object.keys(res.val()).map((key) => res.val()[key].userUid)
        cekNomorAntrian(objUserUid[0]);
      } else {
        // register new user
        auth().createUserWithEmailAndPassword(pasienNomorKtp + '@hec.com', 'password')
          .then((authUser) => {
            const ref = database().ref(`users/${authUser.user.uid}`);
            ref.update({
              userUid: authUser.user.uid,
              userName: pasienNama,
              userNoBpjs: pasienNomorKtp,
              userRole: 'Pasien',
              userAlamat: '',
              userHandphone: '',
              userStatusPasien: 'Umum',
              userTanggalBooking: '',
              userSex: pasienSex,
              userTanggalLahir: pasienTanggalLahir,
            })
            const objUserUid = authUser.user.uid
            cekNomorAntrian(objUserUid);
          })
      }
    })
  }

  const cekNomorAntrian = (result) => {
    // const tanggalYMD = dayjs().format("YYYY-MM-DD");
    const tanggalYMD = dayjs().format("2020-03-09");
    const objUserUid = result

    // const ref0 = database().ref(`hecAntrian/indexes/${tanggalYMD}`).once('value');
    const ref0 = database().ref('userBpjs').orderByChild('userBpjsNomorReferensi').equalTo(objUserUid).once('value')
    ref0.then((res0) => {
      if (res0.exists()) {
        // console.log(Object.keys(res0.val()).map((el) => res0.val()[el].userBpjsNomorAntrean ))
        let no0 = 99999
        Object.keys(res0.val()).map((el) =>
          no0 = res0.val()[el].userBpjsNomorAntrean
        )
        setAppMessage2('Anda sudah terdaftar. Nomor Antrian Anda : ' + no0)
      } else {
        const ref1 = database().ref(`hecAntrian/indexes/${tanggalYMD}`).once('value');
        ref1.then((result1) => {
          if (result1.exists()) {
            // antrian offline next        
            let latestOfflineQueue = result1.val().latestOfflineQueue + 1
            let antrianTotal = result1.val().antrianTotal + 1
            // start - rule nomor antrian disini
            const ruleOnline = [4, 5, 9, 10, 14, 15, 19, 20, 24, 25, 29, 30, 34, 35, 39, 40]
            if (ruleOnline.includes(latestOfflineQueue)) {
              latestOfflineQueue = latestOfflineQueue + 2
            }
            // end - rule nomor antrian disini
            database().ref(`hecAntrian/indexes/${tanggalYMD}`).update({
              latestOfflineQueue: latestOfflineQueue,
              antrianTotal: antrianTotal
            })
            database().ref(`userBpjs`).push({
              userBpjsUid: objUserUid,
              userBpjsNomorReferensi: objUserUid,
              userBpjsTanggalBooking9: tanggalYMD,
              userBpjsNomorAntrean: latestOfflineQueue
            })
            database().ref(`hecAntrian/indexes/${tanggalYMD}/detail/${latestOfflineQueue}`).update({
              antrianNomor: latestOfflineQueue,
              antrianUserUid: objUserUid,
              antrianUserNama: pasienNama,
              antrianUserNoBpjs: pasienNomorKtp,
              antrianTanggalBooking9: tanggalYMD,
            })
            database().ref(`users/${objUserUid}`).update({
              userTanggalBooking9: tanggalYMD,
              userNomorAntrian: latestOfflineQueue,
              userFlagActivity: 'Booking Antrian',
            });
            // setPasienNomorAntrian(latestOfflineQueue)
            setAppMessage2('Nomor Antrian Anda : ' + latestOfflineQueue)
          } else {
            // antrian offline no 1
            database().ref(`hecAntrian/indexes/${tanggalYMD}`).update({
              latestOfflineQueue: 1,
              antrianTotal: 1
            })
            database().ref(`userBpjs`).push({
              userBpjsUid: objUserUid,
              userBpjsNomorReferensi: objUserUid,
              userBpjsTanggalBooking9: tanggalYMD,
              userBpjsNomorAntrean: 1
            })
            database().ref(`hecAntrian/indexes/${tanggalYMD}/detail/1`).update({
              antrianNomor: 1,
              antrianUserUid: objUserUid,
              antrianUserNama: pasienNama,
              antrianUserNoBpjs: pasienNomorKtp,
              antrianTanggalBooking2: tanggalYMD,
            })
            database().ref(`users/${objUserUid}`).update({
              userTanggalBooking9: tanggalYMD,
              userNomorAntrian: 1,
              userFlagActivity: 'Booking Antrian',
            });
            // setPasienNomorAntrian(1)
            setAppMessage2('Nomor Antrian Anda : 1')
          }
        })
        // setAppMessage2('')
      }
      setLoading2(false)
    })

  }

  if (loading) {
    return <ActivityIndicator style={styles.container} animating={true} />;
  }

  return (
    <View style={styles.container} >
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          mode="outlined"
          keyboardType='number-pad'
          label="Nomor KTP"
          value={pasienNomorKtp}
          onChangeText={setPasienNomorKtp}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Nama Pasien"
          value={pasienNama}
          onChangeText={setPasienNama}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Jenis Kelamin"
          value={pasienSex}
          onChangeText={setPasienSex}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          keyboardType='number-pad'
          label="Tanggal Lahir"
          value={pasienTanggalLahir}
          onChangeText={setPasienTanggalLahir}
        />
        {/* <Caption>{appMessage}</Caption> */}
        {/* <Button
          disabled={!itemNomorBpjs}
          mode="outlined"
          loading={loading}
          onPress={handleSubmitItem}
          style={styles.button}>
          Cari Data
        </Button> */}
        {/* {appMessage === 'Data ditemukan' &&
          <View><Title>{!!result && result.response.peserta.nama ? result.response.peserta.nama : ''}</Title>
            <Subheading>{!!result && pasienNoBpjs}</Subheading>
            <Subheading>{!!result && pasienSex}</Subheading>
            <Subheading>{!!result && pasienTanggalLahir}</Subheading>
          </View>
        } */}
        {/* {appMessage === 'Data ditemukan' && */}
          <Button
            mode='outlined' style={styles.button} disabled={!pasienNomorKtp}
            loading={loading2}
            onPress={handleBookingOffline}>
            Proses Booking Offline
        </Button>
        {/* } */}
        {/* <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={handleDatePicked}
          onCancel={hideDateTimePicker}
        /> */}
        {/* <Caption>{(!!pasienNomorAntrian) && 'Nomor Antrian Pasien : ' + pasienNomorAntrian}</Caption> */}
        <Subheading>{appMessage2}</Subheading>
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
    // marginHorizontal: -20,
    padding: 16,
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
  input: {
    marginTop: 20,
  },
});

export default withTheme(ListBookingBpjs);
