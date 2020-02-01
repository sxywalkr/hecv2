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
  TextInput,
} from 'react-native-paper';
import database from '@react-native-firebase/database';
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
  const [param1, setParam1] = useState();
  const [param2, setParam2] = useState();
  const [itemNomorBpjs, setItemNomorBpjs] = useState();
  const [header, setHeader] = useState('');
  const [result, setResult] = useState();
  const [pasienNama, setPasienNama] = useState()
  const [pasienNoBpjs, setPasienNoBpjs] = useState();
  const [pasienSex, setPasienSex] = useState()
  const [pasienTanggalLahir, setPasienTanggalLahir] = useState()
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
  const [bookingDate, setBookingDate] = useState();

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
    console.log(header[0])
    console.log(header[1])
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
    setResult()
    console.log(header[0])
    console.log(header[1])
    axios.get('https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/Peserta/nokartu/' + itemNomorBpjs + '/tglSEP/' + param2, {
      headers: {
        'X-cons-id': 8004,
        'X-timestamp': header[0],
        'X-signature': header[1],
        'Content-Type': 'application/json; charset=utf-8',
      },

    })
      .then(function (response) {
        console.log(response.data.response.peserta);
        // console.log(response.data.response.list);
        setResult(response.data);
        setPasienNama(response.data.response.peserta.nama)
        setPasienNoBpjs(response.data.response.peserta.noKartu)
        setPasienSex(response.data.response.peserta.sex)
        setPasienTanggalLahir(response.data.response.peserta.tglLahir)
      })
      .catch(function (error) {
        // console.log(error);
      });
  };

  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true)
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false)
  };

  const handleDatePicked = datex => {
    const a = database().ref('users').orderByChild('userNoBpjs').equalTo(pasienNoBpjs)
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
        <Button
          disabled={!itemNomorBpjs}
          mode="outlined"
          loading={loading}
          onPress={handleSubmitItem}
          style={styles.button}>
          Cari Data
        </Button>
        <Title>{!!result && result.response.peserta.nama ? result.response.peserta.nama : 'No Data'}</Title>
        <Caption>{!!result && pasienNama}</Caption>
        <Caption>{!!result && pasienNoBpjs}</Caption>
        <Caption>{!!result && pasienSex}</Caption>
        <Caption>{!!result && pasienTanggalLahir}</Caption>
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
        <Caption>{!!result && pasienSex}</Caption>
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
