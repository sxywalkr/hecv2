import dayjs from 'dayjs';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationParams, NavigationRoute } from 'react-navigation';
import { UserContext } from '../../App';
import Hero from '../Hero';
import { getProviders } from '../../util/helpers';

interface Props {
    theme: Theme;
    navigation: NavigationParams;
    route: NavigationRoute;
}

function ListBooking({ theme, route, navigation }: Props) {
    const { q } = route.params;
    const user = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    // const [userRole, setUserRole] = useState('')

    if (!user) {
        return null;
    }

    useEffect(() => {
        // console.log(q)
        const ref = database().ref(`hecKamarOperasi`).orderByChild('hecKoTanggalOperasi').equalTo(q);
        ref.on('value', onSnapshot);
        return () => { ref.off() }
    }, [items]);

    function onSnapshot(snapshot) {
        const list = [];
        snapshot.forEach(item => {
            list.push({
                key: item.val().okaId,
                ...item.val(),
            });
        });
        setItems(list);
        setLoading(false);
    }

    function onProsesApotek(p) {
        database().ref(`okRoom/${p.rekamMedikId}`)
            .update({
                rekamMedikFlag: 'Oka OK, Apotek NOK, Billing NOK',
            })
        database().ref(`users/${p.rekamMedikIdPasien}`)
            .update({
                userFlagActivity: 'Antri Apotek',
            })
        navigation.navigate('AppHome')
    }

    if (loading) {
        return <ActivityIndicator style={styles.container} animating={true} />;
    }

    return (
        <View style={styles.container} >
            {items.length > 0 ?
                <FlatList data={items} renderItem={({ item }) =>
                    <View style={styles.lists}>
                        <View>
                            <Title>{item.hecKoUserName}</Title>
                            <Paragraph>{item.hecKoJenisTindakan}</Paragraph>
                            <View style={styles.spaceV10} />
                            {/* <Subheading>Obat</Subheading> */}
                            {/* <Caption>Total Harga Obat : {JSON.parse(item.okaObat).map(el => el.itemHargaJualObat).reduce((a, b) => parseInt(a) + parseInt(b), 0)}</Caption> */}
                            {/* {JSON.parse(item.okaObat).map((el, key) =>
                                <View key={key}>
                                    <Subheading>Nama Obat: {el.itemNamaObat}</Subheading>
                                    <Caption>Jumlah Obat: {el.selectedJumlahObat}</Caption>
                                    <Caption>Harga Obat: {el.itemHargaJualObat}</Caption>
                                </View>
                            )} */}

                        </View>
                        <Button 
                            // disabled={item.okaFlag=='Poli OK, Oka OK, Apotek NOK, Billing NOK' ? true : false}
                            onPress={() => navigation.navigate('OkaViewRekamMedik', { q: item })}>Proses</Button>
                    </View>
                } />
                : <Title>Tidak ada pasien</Title>}
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
        flexDirection: 'column',
        // justifyContent: 'space-evenly',
        marginVertical: 4,
        paddingHorizontal: 3,
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
    spaceV10: {
        margin: 6,
    }
});

export default withTheme(ListBooking);
