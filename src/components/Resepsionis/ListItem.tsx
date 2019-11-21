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
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Hero from '../Hero';
// import { getProviders } from '../../util/helpers';

interface Props {
  theme: Theme;
  navigation: NavigationParams;
}

function ListBooking({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  // const [userRole, setUserRole] = useState('')

  if (!user) {
    return null;
  }

  useEffect(() => {
    // Create reference
    const ref = database().ref(`obat`)
    // .orderByChild('userFlagActivity').equalTo('Booking Antrian');
    ref.on('value', onSnapshot);
    return () => { ref.off() }
  }, [items]);

  function onSnapshot(snapshot) {
    const list = [];
    snapshot.forEach(item => {
      // console.log(item.val().userTanggalBooking2)
      list.push({
        key: item.val().itemIdObat,
        ...item.val(),
      });
    });
    setItems(list);
    setLoading(false);
  }

  function onDeleteItem(p) {
    Alert.alert(
      'Konfirmasi',
      'Yakin ingin menghapus obat ' + p.itemNamaObat + ' ?',
      [
        {
          text: 'Cancel',
          // onPress: () => hideDateTimePicker(),
          style: 'cancel',
        },
        {
          text: 'OK', onPress: () => {
            const ref = database().ref(`obat/${p.itemIdObat}`)
            ref.remove();
          }
        }
      ],
      { cancelable: false },
    )
  }


  if (loading) {
    return <ActivityIndicator style={styles.container} animating={true} />;
  }

  return (
    <View style={styles.container} >
      <FlatList data={items} renderItem={({ item }) =>
        <View style={styles.lists}>
          <View>
            <Title>{item.itemNamaObat}</Title>
            <Paragraph>{item.itemHargaJualObat}</Paragraph>
          </View>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            {/* <Button onPress={() => navigation.navigate({routeName: 'ResepsionisEditItem', params : { q: 'Edit', r: item }})}>Edit</Button> */}
            <Button onPress={() => navigation.navigate('ResepsionisEditItem', {q: 'Edit', r: item })}>Edit</Button>
            <Button onPress={() => onDeleteItem(item)}>Hapus</Button>
          </View>
        </View>
      } />
      <FAB
        color="#fff"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="add"
        onPress={() => navigation.navigate('ResepsionisEditItem', { q: 'New', r: 'New' })}
      />
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
    flexDirection: 'row',
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

export default withTheme(ListBooking);
