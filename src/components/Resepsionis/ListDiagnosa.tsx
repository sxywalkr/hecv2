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

interface Props {
  theme: Theme;
  navigation: NavigationParams;
}

function ListDiagnosa({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  if (!user) {
    return null;
  }

  useEffect(() => {
    const ref = database().ref(`diagnosa`)
    ref.on('value', onSnapshot);
    return () => { ref.off() }
  }, [items]);

  function onSnapshot(snapshot) {
    const list = [];
    snapshot.forEach(item => {
      list.push({
        key: item.val().itemIdDiagnosa,
        ...item.val(),
      });
    });
    setItems(list);
    setLoading(false);
  }

  function onDeleteItem(p) {
    Alert.alert(
      'Konfirmasi',
      'Yakin ingin menghapus diagnosa ' + p.itemNamaDiagnosa + ' ?',
      [
        {
          text: 'Cancel',
          // onPress: () => hideDateTimePicker(),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const ref = database().ref(`diagnosa/${p.itemIdDiagnosa}`)
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
            <Title>{item.itemNamaDiagnosa}</Title>
            <Paragraph>{item.itemHargaJualDiagnosa}</Paragraph>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button onPress={() => navigation.navigate('ResepsionisEditDiagnosa', { q: 'Edit', r: item })}>Edit</Button>
            <Button onPress={() => onDeleteItem(item)}>Hapus</Button>
          </View>
        </View>
      } />
      <FAB
        color="#fff"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="add"
        onPress={() => navigation.navigate('ResepsionisEditDiagnosa', { q: 'New', r: 'New' })}
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

export default withTheme(ListDiagnosa);
