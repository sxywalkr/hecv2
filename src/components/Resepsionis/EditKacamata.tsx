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

function EditKacamata({ theme, route, navigation }: Props) {
  const {q, r} = route.params;
  const [error, setError] = useState('');
  const [itemIdKacamata, setItemIdKacamata] = useState(q === 'New' ? '' : r.itemIdKacamata)
  const [itemIcdKacamata, setItemIcdKacamata] = useState(q === 'New' ? '' : r.itemIcdKacamata)
  const [itemNamaKacamata, setItemNamaKacamata] = useState(q === 'New' ? '' : r.itemNamaKacamata)
  const [itemHargaBeliKacamata, setItemHargaBeliKacamata] = useState(q === 'New' ? '' : r.itemHargaBeliKacamata)
  const [itemHargaJualKacamata, setItemHargaJualKacamata] = useState(q === 'New' ? '' : r.itemHargaJualKacamata)
  const [itemKodeBpjsKacamata, setItemKodeBpjsKacamata] = useState(q === 'New' ? '' : r.itemKodeBpjsKacamata)
  const [savingItem, setSavingItem] = useState(false);

  
  useEffect(() => {
    if (error) {
      Alert.alert('Pesan Error', error);
    }
  }, [error]);

  async function handleSubmitItem() {
    if (!savingItem) {
      try {
        setSavingItem(true)
        const itemQ = database().ref(`hecRefKacamata`).push();
        const a = q === 'New' ? itemQ.key : itemIdKacamata
        await database().ref('hecRefKacamata/' + a).set({
          itemIdKacamata: a,
          itemIcdKacamata,
          itemNamaKacamata,
          itemHargaBeliKacamata,
          itemHargaJualKacamata,
          itemKodeBpjsKacamata,
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
        <Title>Kacamata</Title>
        <Paragraph>
          Input data Kacamata
        </Paragraph>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Nama Kacamata"
          value={itemNamaKacamata}
          onChangeText={setItemNamaKacamata}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kode Icd Kacamata"
          value={itemIcdKacamata}
          onChangeText={setItemIcdKacamata}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Harga Beli Kacamata"
          value={itemHargaBeliKacamata}
          onChangeText={setItemHargaBeliKacamata}
          keyboardType='decimal-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Harga Jual Kacamata"
          value={itemHargaJualKacamata}
          onChangeText={setItemHargaJualKacamata}
          keyboardType='number-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kode BPJS Kacamata"
          value={itemKodeBpjsKacamata}
          onChangeText={setItemKodeBpjsKacamata}
        />
        <Button
          disabled={!itemNamaKacamata || !itemIcdKacamata || !itemHargaBeliKacamata || !itemHargaJualKacamata || !itemKodeBpjsKacamata}
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

export default EditKacamata;
