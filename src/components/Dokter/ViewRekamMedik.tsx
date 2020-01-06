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
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import { NavigationParams, NavigationRoute } from 'react-navigation';
import { UserContext } from '../../App';
import Hero from '../Hero';
import { getProviders } from '../../util/helpers';

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

  if (!user) {
    return null;
  }
  // ++++++++++++++++++ ambil data pasien 
  useEffect(() => {
    const ref = database().ref(`users`).orderByChild('userTanggalBooking2').equalTo(q.userTanggalBooking2);
    ref.on('value', onSnapshot);
    return () => { ref.off() }
  }, [items]);

  function onSnapshot(snapshot) {
    const list = [];
    snapshot.forEach(item => {
      list.push({
        key: item.val().userUid,
        ...item.val(),
      });
    });
    setItems(list);
    setLoading(false);
  }

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
    setLoadingSelectedDiagnosa(true)
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Title>{q.userName}</Title>
        <Button mode='outlined' disabled={(itemsFilteredObat.length > 0 && itemsFilteredDiagnosa.length > 0) ? false : true} >
          Submit
        </Button>
        <View style={styles.spaceV10} />
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon={itemsFilteredObat.length > 0 ? "check-box" : "check-box-outline-blank"} color={Colors.grey800} size={20} />
          <Paragraph>Diagnosa Obat</Paragraph>
        </View> */}
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
                  <Title>{item.itemNamaObat}</Title>
                  <Paragraph>{item.itemHargaJualObat}</Paragraph>
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
              onPress={() => setOpenDiagDiagnosa(!openDiagDiagnosa)} />
          </View>
          <FlatList data={itemsDiagnosa} renderItem={({ item, index }) =>
            <View style={styles.lists}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton icon={item.selectedDiagnosa ? "check-box" : "check-box-outline-blank"} color={Colors.grey800} size={20}
                  onPress={() => onSelectDiagnosa(index)} />
                <View>
                  <Title>{item.itemNamaDiagnosa}</Title>
                  <Paragraph>{item.itemHargaJualDiagnosa}</Paragraph>
                </View>
              </View>
            </View>
          } />
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
    paddingHorizontal: 20,
    backgroundColor: '#F6F7F8',
    elevation: 4,
    // marginBottom: 10,
  },
  contentRowIconRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  }
});

export default withTheme(Profile);
