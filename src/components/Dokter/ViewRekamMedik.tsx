import dayjs from 'dayjs';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
  Avatar,
  Caption,
  FAB,
  Portal,
  Provider,
  Headline,
  Subheading,
  Paragraph,
  Button,
  Theme,
  Title,
  withTheme,
  IconButton,
  Colors,
  List,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import { NavigationParams, NavigationRoute } from 'react-navigation';
import { UserContext } from '../../App';
import Hero from '../Hero';
import { getProviders } from '../../util/helpers';
import DateTimePicker from "react-native-modal-datetime-picker";


interface Props {
  theme: Theme;
  navigation: NavigationParams;
  route: NavigationRoute;
}

function Profile({ theme, navigation, route }: Props) {
  const { q } = route.params;
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [loadingObat, setLoadingObat] = useState(true);
  const [loadingDiagnosa, setLoadingDiagnosa] = useState(true);
  const [loadingSelectedObat, setLoadingSelectedObat] = useState(true);
  const [loadingSelectedDiagnosa, setLoadingSelectedDiagnosa] = useState(true);
  const [items, setItems] = useState([]);
  const [itemsObat, setItemsObat] = useState([]);
  const [itemsDiagnosa, setItemsDiagnosa] = useState([]);
  const [itemsFilteredObat, setItemsFilteredObat] = useState([]);
  const [itemsFilteredDiagnosa, setItemsFilteredDiagnosa] = useState([]);
  const [itemsTindakan, setItemsTindakan] = useState([]);
  const [openFab, setOpenFab] = useState(false);
  const [openDiagObat, setOpenDiagObat] = useState(false);
  const [openDiagTindakan, setOpenDiagTindakan] = useState(false);
  const [selectedItemsObat, setSelectedItemsObat] = useState([]);
  const [selectedItemsTindakan, setSelectedItemsTindakan] = useState([]);
  const [bookingDateOka, setBookingDateOka] = useState();
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)

  if (!user) {
    return null;
  }
  // ++++++++++++++++++ ambil data pasien  0001430503648
  useEffect(() => {
    // const ref = database().ref(`users`).orderByChild('userTanggalBooking2').equalTo(q.userTanggalBooking2);
    // console.log(q)
    // console.log(q)
    database().ref(`hecAntrian/indexes/${q.antrianTanggalBooking9}/detail/${q.antrianNomor}`).remove();
    const delUserBpjs = database().ref(`userBpjs`).orderByChild('userBpjsNomorReferensi').equalTo(q.antrianUserBpjsNomorReferensi)
    delUserBpjs.once('value', (snap1) => {
      // console.log('', snap1.val())
      // console.log(Object.keys(snap1.val()))
      if (snap1.exists()) {
        database().ref(`userBpjs/${Object.keys(snap1.val())}`).remove();
      }
    })
    const ref = database().ref(`users/${q.antrianUserUid}`);
    ref.once('value', onSnapshot2);
    return () => { ref.off() }
  }, [items]);

  function onSnapshot2(snapshot) {
    // console.log(snapshot.val())
    const list = [];
    // snapshot.forEach(item => {
    list.push({
      key: snapshot.val().userUid,
      ...snapshot.val(),
    });
    // });
    setItems(list);
    // hapus pasien dari antrian
    
    setLoading(false);
  }
  // function onSnapshot(snapshot) {
  //   // console.log(snapshot.val())
  //   const list = [];
  //   snapshot.forEach(item => {
  //     list.push({
  //       key: item.val().userUid,
  //       ...item.val(),
  //     });
  //   });
  //   // console.log(list)
  //   setItems(list);
  //   setLoading(false);
  // }

  // ++++++++++++++++++ ambil data obat 
  useEffect(() => {
    const ref = database().ref(`obat`)
    ref.on('value', onSnapshotObat);
    return () => { ref.off() }
  }, [loadingObat]);

  function onSnapshotObat(snapshot) {
    const list = [];
    snapshot.forEach(item => {
      list.push({
        key: item.val().itemIdObat,
        selectedObat: false,
        selectedJumlahObat: 0,
        ...item.val(),
      });
    });
    setItemsObat(list);
    setLoadingObat(false);
  }
  // ++++++++++++++++++ ambil data diagnosa
  useEffect(() => {
    const ref = database().ref(`diagnosa`)
    ref.on('value', onSnapshotDiagnosa);
    return () => { ref.off() }
  }, [loadingDiagnosa]);

  function onSnapshotDiagnosa(snapshot) {
    const list = [];
    snapshot.forEach(item => {
      list.push({
        key: item.val().itemIdDiagnosa,
        selectedDiagnosa: false,
        ...item.val(),
      });
    });
    setItemsDiagnosa(list);
    setLoadingDiagnosa(false);
  }
  // ++++++++++++++++++ proses filter obat
  useEffect(() => {
    const filteredObat = itemsObat.filter((el) => el.selectedObat === true)
    setItemsFilteredObat(filteredObat)
    setLoadingSelectedObat(false)
  }, [loadingSelectedObat])

  const onSelectObat = (q) => {
    itemsObat[q].selectedObat = !itemsObat[q].selectedObat
    itemsObat[q].selectedJumlahObat = 1
    setLoadingSelectedObat(true)
  }
  // ++++++++++++++++++ proses filter diagnosa
  useEffect(() => {
    const filteredDiagnosa = itemsDiagnosa.filter((el) => el.selectedDiagnosa === true)
    setItemsFilteredDiagnosa(filteredDiagnosa)
    setLoadingSelectedDiagnosa(false)
  }, [loadingSelectedDiagnosa])

  const onSelectDiagnosa = (q) => {
    itemsDiagnosa[q].selectedDiagnosa = !itemsDiagnosa[q].selectedDiagnosa
    // console.log(dayjs().month()+1)
    setLoadingSelectedDiagnosa(true)
  }
  // ++++++++++++++++++ proses show date time picker
  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true)
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false)
  };
  // ++++++++++++++++++ proses ke apotek
  const onSubmitRekamMedik = () => {
    const a = database().ref('rekamMedikPasien').push();
    database().ref('rekamMedikPasien/' + a.key).update({
      rekamMedikId: a.key,
      rekamMedikTanggal: dayjs().format(),
      rekamMedikTanggal2: dayjs().format("YYYY-MM-DD"),
      rekamMedikBulan: dayjs().month() + 1,
      rekamMedikIdPasien: q.key,
      rekamMedikNamaPasien: q.userName,
      rekamMedikStatusPasien: q.userStatusPasien,
      rekamMedikObat: JSON.stringify(itemsFilteredObat),
      rekamMedikDiagnosa: JSON.stringify(itemsFilteredDiagnosa),
      rekamMedikIdDokter: user.uid,
      rekamMedikNamaDokter: user.displayName ? user.displayName : user.email,
      rekamMedikKeOka: false,
      rekamMedikFlag: 'Poli OK, Apotek NOK, Billing NOK',
    });
    database().ref('users/' + q.key).update({
      userFlagActivity: 'Antri Apotek',
      userTanggalBooking: '',
      userTanggalBooking2: '',
    })
    navigation.navigate('AppHome')
  }

  // ++++++++++++++++++ proses ke oka
  const onSubmitRekamMedikKeOka = date => {
    console.log(items[0])
    const a0 = dayjs(date).format('YYYY-MM-DD')
    const a = database().ref('hecKamarOperasi').push();
    database().ref('hecKamarOperasi').push({
      hecKoId: a.key,
      hecKoKodeBooking: items[0].userUid,
      hecKoTanggalOperasi: a0,
      hecKoJenisTindakan: 'operasi mata',
      hecKoKodePoli: 'MAT',
      hecKoNamaPoli: 'MATA',
      hecKoTerlaksana: 0,
      hecKoUserUid: items[0].userUid,
      hecKoUserNoBpjs: items[0].userNoBpjs
    })
    database().ref('rekamMedikPasien/' + a.key).update({
      rekamMedikId: a.key,
      rekamMedikTanggal: dayjs().format(),
      rekamMedikTanggal2: dayjs().format("YYYY-MM-DD"),
      rekamMedikBulan: dayjs().month() + 1,
      rekamMedikIdPasien: q.key,
      rekamMedikNamaPasien: q.userName,
      rekamMedikStatusPasien: q.userStatusPasien,
      rekamMedikObat: JSON.stringify(itemsFilteredObat),
      rekamMedikDiagnosa: JSON.stringify(itemsFilteredDiagnosa),
      rekamMedikIdDokter: user.uid,
      rekamMedikNamaDokter: user.displayName ? user.displayName : user.email,
      rekamMedikKeOka: true,
      rekamMedikFlag: 'Poli OK, Oka Nok, Apotek NOK, Billing NOK',
    });
    // database().ref('okaRoom/' + a.key).update({
    //   okaId: a.key,
    //   okaTanggal: dayjs().format(),
    //   okaTanggal2: dayjs().format("YYYY-MM-DD"),
    //   okaBulan: dayjs().month() + 1,
    //   okaIdPasien: q.key,
    //   okaNamaPasien: q.userName,
    //   okaStatusPasien: q.userStatusPasien,
    //   okaObat: JSON.stringify(itemsFilteredObat),
    //   okaDiagnosa: JSON.stringify(itemsFilteredDiagnosa),
    //   okaIdDokter: user.uid,
    //   okaNamaDokter: user.displayName ? user.displayName : user.email,
    //   okaFlag: 'Poli OK, Oka NOK, Apotek NOK, Billing NOK',
    // });
    database().ref('users/' + q.key).update({
      userFlagActivity: 'Antri Oka',
      userTanggalBooking: '',
      userTanggalBooking2: '',
    })
    navigation.navigate('AppHome')
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {!!items[0] && <Title>{items[0].userName}</Title>}
        {/* {console.log(items)} */}
        <View style={{ flexDirection: 'row' }}>
          <Button style={{ flex: 1 }} mode='outlined' disabled={(itemsFilteredObat.length > 0 && itemsFilteredDiagnosa.length > 0) ? false : true}
            onPress={() => onSubmitRekamMedik()} >
            Ke Apotek
          </Button>
          <Button style={{ flex: 1 }} mode='outlined'
            // disabled={(itemsFilteredObat.length > 0 && itemsFilteredDiagnosa.length > 0) ? false : true}
            onPress={() => showDateTimePicker()} >
            Ke Oka
        </Button>
        </View>
        <View style={styles.spaceV10} />
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon={itemsFilteredObat.length > 0 ? "check-box" : "check-box-outline-blank"} color={Colors.grey800} size={20} />
          <Paragraph>Diagnosa Obat</Paragraph>
        </View> */}
      </View>
      <View>
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={onSubmitRekamMedikKeOka}
          onCancel={hideDateTimePicker}
        />
      </View>
      <View style={styles.spaceV10} />
      {!!openDiagObat &&
        <View style={styles.content}>
          <View style={styles.contentRowIconRight}>
            <Title>Diagnosa Obat</Title>
            <IconButton icon="refresh" color={Colors.grey800} size={20}
              onPress={() => setLoadingObat(true)} />
            <IconButton icon="close" color={Colors.red500} size={20}
              onPress={() => setOpenDiagObat(!openDiagObat)} />
          </View>
          <FlatList data={itemsObat} renderItem={({ item, index }) =>
            <View style={styles.lists}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton icon={item.selectedObat ? "check-box" : "check-box-outline-blank"} color={Colors.grey800} size={20}
                  onPress={() => onSelectObat(index)} />
                <View>
                  <Subheading>{item.itemNamaObat}</Subheading>
                  <Caption>{item.itemHargaJualObat}</Caption>
                </View>
              </View>
            </View>
          } />
        </View>
      }
      <View style={styles.spaceV10} />
      {!!openDiagTindakan &&
        <View style={styles.content}>
          <View style={styles.contentRowIconRight}>
            <Title>Tindakan</Title>
            <IconButton icon="refresh" color={Colors.grey800} size={20}
              onPress={() => setLoadingDiagnosa(true)} />
            <IconButton icon="close" color={Colors.red500} size={20}
              onPress={() => setOpenDiagTindakan(!openDiagTindakan)} />
          </View>
          <FlatList data={itemsDiagnosa} renderItem={({ item, index }) =>
            <View style={styles.lists}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton icon={item.selectedDiagnosa ? "check-box" : "check-box-outline-blank"} color={Colors.grey800} size={20}
                  onPress={() => onSelectDiagnosa(index)} />
                <View>
                  <Subheading>{item.itemNamaDiagnosa}</Subheading>
                  <Caption>{item.itemHargaJualDiagnosa}</Caption>
                </View>
              </View>
              <View style={styles.spaceV10} />
            </View>
          } />
          <View style={styles.spaceV10} />
        </View>
      }

      <Provider>
        <Portal>
          <FAB.Group
            open={openFab}
            icon={openFab ? 'settings' : 'add'}
            // icon="settings"
            actions={[
              { icon: 'star', label: 'Tambah Diagnose Obat', onPress: () => setOpenDiagObat(!openDiagObat) },
              { icon: 'email', label: 'Tambah Diagnosa Tindakan', onPress: () => setOpenDiagTindakan(!openDiagTindakan) },
            ]}
            onStateChange={({ open }) => setOpenFab(open)}
            onPress={() => {
              if (openFab) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      </Provider>
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
    // paddingHorizontal: 20,
    backgroundColor: '#F6F7F8',
    elevation: 4,
    // marginBottom: 10,
  },
  contentRowIconRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
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
  center: {
    width: '100%',
    alignItems: 'center',
  },
  spaceV10: {
    margin: 6,
  },
  lists: {
    backgroundColor: '#F6F7F8',
    // elevation: 4,
    flexDirection: 'column',
    // justifyContent: 'space-evenly',
    // marginVertical: 4,
    // paddingHorizontal: 3,
  },
});

export default withTheme(Profile);
