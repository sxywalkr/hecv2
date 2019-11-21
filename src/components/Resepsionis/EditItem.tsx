import auth from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View, Image, PixelRatio } from 'react-native';
import {
  Button,
  Paragraph,
  TextInput,
  Title,
  Theme,
} from 'react-native-paper';
import { NavigationParams, NavigationRoute } from 'react-navigation';
import database from '@react-native-firebase/database';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
interface Props {
  theme: Theme;
  navigation: NavigationParams;
  route: NavigationRoute;
}

function EditItem({ theme, route, navigation }: Props) {
  const {q, r} = route.params;
  const [error, setError] = useState('');
  const [itemIdObat, setItemIdObat] = useState(q === 'New' ? '' : r.itemIdObat)
  const [itemNamaObat, setItemNamaObat] = useState(q === 'New' ? '' : r.itemNamaObat)
  const [itemHargaBeliObat, setItemHargaBeliObat] = useState(q === 'New' ? '' : r.itemHargaBeliObat)
  const [itemHargaJualObat, setItemHargaJualObat] = useState(q === 'New' ? '' : r.itemHargaJualObat)
  const [itemJumlahObat, setItemJumlahObat] = useState(q === 'New' ? '' : r.itemJumlahObat)
  const [itemKodeBpjsObat, setItemKodeBpjsObat] = useState(q === 'New' ? '' : r.itemKodeBpjsObat)
  const [savingItem, setSavingItem] = useState(false);

  // console.log(r)

  useEffect(() => {
    if (error) {
      Alert.alert('Pesan Error', error);
    }
  }, [error]);

  async function handleSubmitItem() {
    if (!savingItem) {
      try {
        setSavingItem(true)
        const itemQ = database().ref(`obat`).push();
        const a = q === 'New' ? itemQ.key : itemIdObat
        await database().ref('obat/' + a).set({
          itemIdObat: a,
          itemNamaObat,
          itemHargaBeliObat,
          itemHargaJualObat,
          itemJumlahObat,
          itemKodeBpjsObat,
        });
        navigation.navigate('AppHome')
      } catch (e) {
        setError(e.message)
      } finally {
        setSavingItem(false)
      }
    }

  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title>Obat</Title>
        <Paragraph>
          Input data obat.
        </Paragraph>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Nama Obat"
          value={itemNamaObat}
          onChangeText={setItemNamaObat}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Harga Beli Obat"
          value={itemHargaBeliObat}
          onChangeText={setItemHargaBeliObat}
          keyboardType='decimal-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Harga Jual Obat"
          value={itemHargaJualObat}
          onChangeText={setItemHargaJualObat}
          keyboardType='number-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Jumlah Obat"
          value={itemJumlahObat}
          onChangeText={setItemJumlahObat}
          keyboardType='number-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kode BPJS Obat"
          value={itemKodeBpjsObat}
          onChangeText={setItemKodeBpjsObat}
        />
        <Button
          disabled={!itemNamaObat || !itemHargaBeliObat || !itemHargaJualObat || !itemJumlahObat || !itemKodeBpjsObat}
          mode="outlined"
          loading={savingItem}
          onPress={handleSubmitItem}
          style={styles.button}>
          Simpan
        </Button>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  banner: {
    backgroundColor: '#ffebee',
  },
  input: {
    marginTop: 20,
  },
  button: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  actions: {
    backgroundColor: '#F6F7F8',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },
});

export default EditItem;
