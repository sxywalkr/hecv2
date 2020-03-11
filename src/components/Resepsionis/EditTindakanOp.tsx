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

function EditTindakanOp({ theme, route, navigation }: Props) {
  const {q, r} = route.params;
  const [error, setError] = useState('');
  const [itemIdTindakanOp, setItemIdTindakanOp] = useState(q === 'New' ? '' : r.itemIdTindakanOp)
  const [itemIcdTindakanOp, setItemIcdTindakanOp] = useState(q === 'New' ? '' : r.itemIcdTindakanOp)
  const [itemNamaTindakanOp, setItemNamaTindakanOp] = useState(q === 'New' ? '' : r.itemNamaTindakanOp)
  const [itemHargaBeliTindakanOp, setItemHargaBeliTindakanOp] = useState(q === 'New' ? '' : r.itemHargaBeliTindakanOp)
  const [itemHargaJualTindakanOp, setItemHargaJualTindakanOp] = useState(q === 'New' ? '' : r.itemHargaJualTindakanOp)
  const [itemKodeBpjsTindakanOp, setItemKodeBpjsTindakanOp] = useState(q === 'New' ? '' : r.itemKodeBpjsTindakanOp)
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
        const itemQ = database().ref(`hecRefTindakanOp`).push();
        const a = q === 'New' ? itemQ.key : itemIdTindakanOp
        await database().ref('hecRefTindakanOp/' + a).set({
          itemIdTindakanOp: a,
          itemIcdTindakanOp,
          itemNamaTindakanOp,
          itemHargaBeliTindakanOp,
          itemHargaJualTindakanOp,
          itemKodeBpjsTindakanOp,
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
        <Title>Tindakan Operasi</Title>
        <Paragraph>
          Input data Tindakan Operasi
        </Paragraph>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Nama Tindakan Operasi"
          value={itemNamaTindakanOp}
          onChangeText={setItemNamaTindakanOp}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kode Icd Tindakan Operasi"
          value={itemIcdTindakanOp}
          onChangeText={setItemIcdTindakanOp}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Harga Beli Tindakan Operasi"
          value={itemHargaBeliTindakanOp}
          onChangeText={setItemHargaBeliTindakanOp}
          keyboardType='decimal-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Harga Jual Tindakan Operasi"
          value={itemHargaJualTindakanOp}
          onChangeText={setItemHargaJualTindakanOp}
          keyboardType='number-pad'
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Kode BPJS Tindakan Operasi"
          value={itemKodeBpjsTindakanOp}
          onChangeText={setItemKodeBpjsTindakanOp}
        />
        <Button
          disabled={!itemNamaTindakanOp || !itemIcdTindakanOp || !itemHargaBeliTindakanOp || !itemHargaJualTindakanOp || !itemKodeBpjsTindakanOp}
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

export default EditTindakanOp;
