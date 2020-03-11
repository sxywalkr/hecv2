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
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [param1, setParam1] = useState();
  const [param2, setParam2] = useState();
  const [itemNomorBpjs, setItemNomorBpjs] = useState('');
  const [header, setHeader] = useState('');
  const [result, setResult] = useState();
  const [pasienNama, setPasienNama] = useState()
  const [pasienNoBpjs, setPasienNoBpjs] = useState();
  const [pasienSex, setPasienSex] = useState()
  const [pasienTanggalLahir, setPasienTanggalLahir] = useState()
  const [pasienNomorAntrian, setPasienNomorAntrian] = useState()
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
  const [bookingDate, setBookingDate] = useState();
  const [appMessage, setAppMessage] = useState('Waiting')
  const [appMessage2, setAppMessage2] = useState('')


  if (!user) {
    return null;
  }

  // async function initHeader() {
  //   // const iterations = 4096;
  //   // const keyInBytes = 32;
  //   // const message = '8004';
  //   // const tstamp = dayjs().utc().unix() - dayjs('1970-01-01 00:00:00').utc().unix();
  //   // const key = await Pbkdf2.hash('1iH08C361F', message + '&' + tstamp, iterations, keyInBytes, 'SHA256');
  //   // const hmac256Hash = await Hmac.hmac256(message + '&' + tstamp, key);
  //   // console.log(message + '&' + tstamp)
  //   // setHeader1(hmac256Hash);
  //   // setHeader2(dayjs().utc().unix() - dayjs('1970-01-01 00:00:00').utc().unix());
  //   // setHeader3(dayjs().utc().unix());
  //   // console.log()


  //   axios.get('https://daengdeals.com/hec.php')
  //     .then(function (response) {
  //       // handle success
  //       setHeader(response.data.split(' '));
  //     })
  //     .catch(function (error) {
  //       // handle error
  //       // console.log(error);
  //     })
  //     .then(function () {
  //       // always executed
  //     });
  // }

  useEffect(() => {
    // setParam1('0000125575514')
    setParam2(dayjs().format('YYYY-MM-DD'))
    // setParam2()
    // console.log(header[0])
    // console.log(header[1])
    axios.get('https://daengdeals.com/hec.php')
      .then(function (response) {
        setHeader(response.data.split(' '));
      })
      .catch(function (error) {
        // console.log(error);
      });
    setLoading(false)

  }, [loading]);

  async function handleSubmitItem() {
    setResult('')
    setAppMessage('Loading')
    Keyboard.dismiss();
    console.log('header0', header[0])
    console.log('header1', header[1])
    axios.get('https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/Peserta/nokartu/' + itemNomorBpjs + '/tglSEP/' + param2, {
      headers: {
        'X-cons-id': 8004,
        'X-timestamp': header[0],
        'X-signature': header[1],
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
      .then(function (response) {
        console.log(response.data.metaData.message)
        if (response.data.metaData.message !== 'Peserta Tidak Terdaftar') {
          // console.log(response.data.response.peserta);
          // console.log(response.data.response.list);
          setAppMessage('Data ditemukan')
          setResult(response.data);
          setPasienNama(response.data.response.peserta.nama)
          setPasienNoBpjs(response.data.response.peserta.noKartu)
          setPasienSex(response.data.response.peserta.sex)
          setPasienTanggalLahir(response.data.response.peserta.tglLahir)
        } else {
          setAppMessage('Data tidak ditemukan')
        }

      })
    // .catch(function (error) {
    //   // console.log(error);
    // });
  };

  // const showDateTimePicker = () => {
  //   setIsDateTimePickerVisible(true)
  // };

  // const hideDateTimePicker = () => {
  //   setIsDateTimePickerVisible(false)
  // };

  // const handleDatePicked = datex => {
  //   setBookingDate(dayjs(datex).format("YYYY-MM-DD"))
  //   // const a = database().ref('users').orderByChild('userNoBpjs').equalTo(pasienNoBpjs)
  //   // console.log(a)
  // }

  const handleBookingOffline = () => {
    setLoading2(true)
    // cari pasien dulu
    const cekPasien = database().ref('users').orderByChild('userNoBpjs').equalTo(pasienNoBpjs).once('value');
    cekPasien.then((res) => {
      if (res.exists()) {
        // existing user
        const objUserUid = Object.keys(res.val()).map((key) => res.val()[key].userUid)
        cekNomorAntrian(objUserUid[0]);
      } else {
        // register new user
        auth().createUserWithEmailAndPassword(pasienNoBpjs + '@hec.com', 'password')
          .then((authUser) => {
            const ref = database().ref(`users/${authUser.user.uid}`);
            ref.update({
              userUid: authUser.user.uid,
              userName: pasienNama,
              userNoBpjs: pasienNoBpjs,
              userRole: 'Pasien',
              userAlamat: '',
              userHandphone: '',
              userStatusPasien: 'BPJS',
              userTanggalBooking: '',
              userSex: pasienSex,
              userTanggalLahir: dayjs(pasienTanggalLahir).format('YYYY-MM-DD'),
            })
            const objUserUid = authUser.user.uid
            cekNomorAntrian(objUserUid);
          })
      }
    })
  }

  const cekNomorAntrian = (result) => {
    const tanggalYMD = dayjs().format("YYYY-MM-DD");
    // const tanggalYMD = dayjs().format("2020-03-09");
    const objUserUid = result

    // const ref0 = database().ref(`hecAntrian/indexes/${tanggalYMD}`).once('value'); 0001430503648
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
              antrianUserNoBpjs: pasienNoBpjs,
              antrianUserBpjsNomorReferensi: objUserUid,
              antrianTanggalBooking9: tanggalYMD,
            })
            database().ref(`users/${objUserUid}`).update({
              userTanggalBooking9: tanggalYMD,
              userNomorAntrian: latestOfflineQueue,
              userFlagActivity: 'Booking Antrian',
            });
            setPasienNomorAntrian(latestOfflineQueue)
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
              antrianUserNoBpjs: pasienNoBpjs,
              antrianUserBpjsNomorReferensi: objUserUid,
              antrianTanggalBooking2: tanggalYMD,
            })
            database().ref(`users/${objUserUid}`).update({
              userTanggalBooking9: tanggalYMD,
              userNomorAntrian: 1,
              userFlagActivity: 'Booking Antrian',
            });
            setPasienNomorAntrian(1)
          }
        })
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
          label="Nomor BPJS Peserta"
          value={itemNomorBpjs}
          onChangeText={setItemNomorBpjs}
        />
        <Caption>{appMessage}</Caption>
        <Button
          disabled={!itemNomorBpjs}
          mode="outlined"
          loading={loading}
          onPress={handleSubmitItem}
          style={styles.button}>
          Cari Data
        </Button>
        {appMessage === 'Data ditemukan' &&
          <View><Title>{!!result && result.response.peserta.nama ? result.response.peserta.nama : ''}</Title>
            <Subheading>{!!result && pasienNoBpjs}</Subheading>
            <Subheading>{!!result && pasienSex}</Subheading>
            <Subheading>{!!result && pasienTanggalLahir}</Subheading>
          </View>
        }
        {appMessage === 'Data ditemukan' &&
          <Button
            mode='outlined' style={styles.button} disabled={!itemNomorBpjs}
            loading={loading2}
            onPress={handleBookingOffline}>
            Proses Booking Offline
        </Button>}
        {/* <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={handleDatePicked}
          onCancel={hideDateTimePicker}
        /> */}
        <Caption>{(!!pasienNomorAntrian) && 'Nomor Antrian Pasien : ' + pasienNomorAntrian}</Caption>
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
