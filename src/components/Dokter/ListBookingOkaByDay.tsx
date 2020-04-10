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

    if (!user) {
        return null;
    }

    useEffect(() => {
        const ref = database().ref(`hecKamarOperasi`).orderByChild('hecKoTanggalOperasi').equalTo(q);
        ref.once('value', onSnapshot);
        return () => { ref.off() }
    }, [items]);

    function onSnapshot(snapshot) {
        const list = [];
        snapshot.forEach(item => {
            if (item.val()) {
                list.push({
                    key: item.val().hecKoId,
                    ...item.val(),
                });
            }
        });
        setItems(list);
        setLoading(false);
    }

    if (loading) {
        return <ActivityIndicator style={styles.container} animating={true} />;
    }

    return (
        <View style={styles.container} >
            {items.length > 0 ?
                <View>
                    <Title>Antrian Kamar Operasi Klinik Mata Hasanuddin</Title>
                    <Subheading>Tanggal : {dayjs(q).format('DD MMM YYYY')}</Subheading>
                    <View style={styles.space10} />
                    <FlatList data={items} renderItem={({ item }) =>
                        <View style={styles.lists}>
                            <View>
                                <Title>Nama Pasien : {item.hecKoUserName}</Title>
                                <Paragraph>Nomor Antrian : {item.hecKoNomorAntrian}</Paragraph>
                                <Paragraph>Nomor BPJS : {item.hecKoUserNoBpjs}</Paragraph>
                                <Paragraph>Jenis Tindakan : {item.hecKoJenisTindakan}</Paragraph>
                            </View>
                        </View>
                    } />
                </View>
                : <Title>Tidak ada antrian booking</Title>}
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
    space10: {
        height: 15,
        width: 15
    }
});

export default withTheme(ListBooking);
