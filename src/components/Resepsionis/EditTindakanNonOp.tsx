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

function EditTindakanNonOp({ theme, route, navigation }: Props) {
  const {q, r} = route.params;
  const [error, setError] = useState('');
  const [itemIdTindakanNonOp, setItemIdTindakanNonOp] = useState(q === 'New' ? '' : r.itemIdTindakanNonOp)
  const [itemIcdTindakanNonOp, setItemIcdTindakanNonOp] = useState(q === 'New' ? '' : r.itemIcdTindakanNonOp)
  const [itemNamaTindakanNonOp, setItemNamaTindakanNonOp] = useState(q === 'New' ? '' : r.itemNamaTindakanNonOp)
  const [itemHargaBeliTindakanNonOp, setItemHargaBeliTindakanNonOp] = useState(q === 'New' ? '' : r.itemHargaBeliTindakanNonOp)
  const [itemHargaJualTindakanNonOp, setItemHargaJualTindakanNonOp] = useState(q === 'New' ? '' : r.itemHargaJualTindakanNonOp)
  const [itemKodeBpjsTindakanNonOp, setItemKodeBpjsTindakanNonOp] = useState(q === 'New' ? '' : r.itemKodeBpjsTindakanNonOp)
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
        const itemQ = database().ref(`hecRefTindakanNonOp`).push();
        const a = q === 'New' ? itemQ.key : itemIdTindakanNonOp
        await database().ref('hecRefTindakanNonOp/' + a).set({
          itemIdTindakanNonOp: a,
          itemIcdTindakanNonOp,
          itemNamaTindakanNonOp,
          itemHargaBeliTindakanNonOp,
          itemHargaJualTindakanNonOp,
          itemKodeBpjsTindakanNonOp,
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
        <Title>Tindakan Non Operasi</Title>
        <Paragraph>
          Input data Tindakan Non Operasi
        </Paragraph>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Nama Tindakan Non Operasi"
          value={itemNamaTindakanNonOp}
          onChangeText={setItemNamaTindakanNonOp}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kode Icd Tindakan Non Operasi"
          value={itemIcdTindakanNonOp}
          onChangeText={setItemIcdTindakanNonOp}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Harga Beli Tindakan Non Operasi"
          value={itemHargaBeliTindakanNonOp}
          onChangeText={setItemHargaBeliTindakanNonOp}
          keyboardType='decimal-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Harga Jual Tindakan Non Operasi"
          value={itemHargaJualTindakanNonOp}
          onChangeText={setItemHargaJualTindakanNonOp}
          keyboardType='number-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kode BPJS Tindakan Non Operasi"
          value={itemKodeBpjsTindakanNonOp}
          onChangeText={setItemKodeBpjsTindakanNonOp}
        />
        <Button
          disabled={!itemNamaTindakanNonOp || !itemIcdTindakanNonOp || !itemHargaBeliTindakanNonOp || !itemHargaJualTindakanNonOp || !itemKodeBpjsTindakanNonOp}
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

export default EditTindakanNonOp;
