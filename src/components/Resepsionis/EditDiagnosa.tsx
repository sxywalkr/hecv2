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

function EditDiagnosa({ theme, route, navigation }: Props) {
  const {q, r} = route.params;
  const [error, setError] = useState('');
  const [itemIdDiagnosa, setItemIdDiagnosa] = useState(q === 'New' ? '' : r.itemIdDiagnosa)
  const [itemIcdDiagnosa, setItemIcdDiagnosa] = useState(q === 'New' ? '' : r.itemIcdDiagnosa)
  const [itemNamaDiagnosa, setItemNamaDiagnosa] = useState(q === 'New' ? '' : r.itemNamaDiagnosa)
  const [itemHargaBeliDiagnosa, setItemHargaBeliDiagnosa] = useState(q === 'New' ? '' : r.itemHargaBeliDiagnosa)
  const [itemHargaJualDiagnosa, setItemHargaJualDiagnosa] = useState(q === 'New' ? '' : r.itemHargaJualDiagnosa)
  const [itemKodeBpjsDiagnosa, setItemKodeBpjsDiagnosa] = useState(q === 'New' ? '' : r.itemKodeBpjsDiagnosa)
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
        const itemQ = database().ref(`diagnosa`).push();
        const a = q === 'New' ? itemQ.key : itemIdDiagnosa
        await database().ref('diagnosa/' + a).set({
          itemIdDiagnosa: a,
          itemIcdDiagnosa,
          itemNamaDiagnosa,
          itemHargaBeliDiagnosa,
          itemHargaJualDiagnosa,
          itemKodeBpjsDiagnosa,
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
        <Title>Diagnosa</Title>
        <Paragraph>
          Input data Diagnosa.
        </Paragraph>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Nama Diagnosa"
          value={itemNamaDiagnosa}
          onChangeText={setItemNamaDiagnosa}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kode Icd Diagnosa"
          value={itemIcdDiagnosa}
          onChangeText={setItemIcdDiagnosa}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Harga Beli Diagnosa"
          value={itemHargaBeliDiagnosa}
          onChangeText={setItemHargaBeliDiagnosa}
          keyboardType='decimal-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Harga Jual Diagnosa"
          value={itemHargaJualDiagnosa}
          onChangeText={setItemHargaJualDiagnosa}
          keyboardType='number-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kode BPJS Diagnosa"
          value={itemKodeBpjsDiagnosa}
          onChangeText={setItemKodeBpjsDiagnosa}
        />
        <Button
          disabled={!itemNamaDiagnosa || !itemIcdDiagnosa || !itemHargaBeliDiagnosa || !itemHargaJualDiagnosa || !itemKodeBpjsDiagnosa}
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

export default EditDiagnosa;
