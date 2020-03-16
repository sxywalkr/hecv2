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
        // const ref = database().ref(`users`).orderByChild('userTanggalBooking2').equalTo('2020-03-10');
        // console.log(q)
        const ref = database().ref(`hecAntrian/indexes/${q}/detail`);
        // const ref = database().ref(`hecAntrian/indexes/2020-03-13/detail`);
        ref.on('value', onSnapshot);
        return () => { ref.off() }
    }, [items]);

    function onSnapshot(snapshot) {
        const list = [];
        snapshot.forEach(item => {
            if (item.val()) {
                list.push({
                    key: item.val().antrianUserUid,
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
                <FlatList data={items} renderItem={({ item }) =>
                    <View style={styles.lists}>
                        <View>
                            <Title>Nama Pasien : {item.antrianUserNama}</Title>
                            <Paragraph>Nomor antrian : {item.antrianNomor}</Paragraph>
                            <Paragraph>Nomor referensi : {item.antrianUserBpjsNomorReferensi}</Paragraph>
                        </View>
                        <Button onPress={() => navigation.navigate('DokterViewRekamMedik', { q: item })}>Proses</Button>
                        {/* {console.log(item)} */}
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
});

export default withTheme(ListBooking);
