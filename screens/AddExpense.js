import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Pressable } from 'react-native';
import { Header as HeaderRNE, Input, CheckBox, Overlay, Text, Icon } from 'react-native-elements';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { rnrw } from 'react-native-realm-wrapper';
import { MainButton, OkButton } from '../components/Buttons';
import { expensesRnrw } from '../Schemas';

function AddExpense({ navigation, route }) {
    const [data, setData] = useState({
        desc: "",
        amount: "",
        amount_: "",
        date: [],
        paymentDate: "Select a due date",
    });
    const amount = (arg1, arg2) => {
        if (isNaN(arg1)) {
            arg1 = "";
        }
        const fixAmount = arg1.toString().replace(/[^0-9]/g, "");
        const number = parseInt(fixAmount);
        if (arg2 == "blur") {
            if (isNaN(number)) {
                setData({ ...data, amount: "", amount_: "" });
            } else {
                setData({ ...data, amount: number, amount_: number.toFixed(2) });
            }
        } else {
            setData({ ...data, amount: number, amount_: fixAmount });
        }
    }
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
    const [visible, setVisible] = React.useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const handleConfirm = (date) => {
        setData({ ...data, date: date.toLocaleDateString() });
        hideDatePicker();
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const addData = async () => {
        if (data.desc == "" || data.amount == "" || isNaN(data.amount)) {
            alert("Description and amount are required.");
        } else {
            let id;
            await rnrw.nextID(expensesRnrw).then(value => { id = value; });
            rnrw.write(expensesRnrw, { id: id, description: data.desc, amount: data.amount, date: data.date })
                .then(value => {
                    if (value == "Success") {
                        toggleOverlay();
                    } else {
                        alert("Something went wrong. Please try again.");
                    }
                });
        }
    }

    useEffect(() => {
        if (typeof data.date == "string") {
            setData({ ...data, paymentDate: data.date });
        }
    }, [data.date]);

    return (
        <>
            <SafeAreaView>
                <HeaderRNE containerStyle={styles.header}
                    statusBarProps={{ backgroundColor: '#80bb55' }}
                    leftComponent={
                        <Pressable onPress={navigation.goBack}>
                            <Icon type='font-awesome' name="arrow-left" color="white" />
                        </Pressable>
                    }
                    centerComponent={{ text: 'Add new expense', style: styles.center }}
                />
            </SafeAreaView>
            <View>
                <Input
                    placeholder="Description"
                    leftIcon={{ type: 'font-awesome', name: 'comment' }}
                    onChangeText={value => setData({ ...data, desc: value })}
                />
                <Input
                    placeholder="Amount"
                    leftIcon={{ type: 'font-awesome', name: 'money' }}
                    value={data.amount_}
                    onChangeText={value => amount(value)}
                    onBlur={() => amount(data.amount, "blur")}
                />
                <Pressable onPress={showDatePicker}>
                    <Input
                        disabled
                        placeholder={data.paymentDate}
                        leftIcon={{ type: 'font-awesome', name: 'calendar' }}
                    />
                </Pressable>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                <MainButton text="Add Expense" func={addData} />
                <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                    <Text style={{ marginTop: 10 }}>Data added successfully.</Text>
                    <OkButton nav={navigation} route={route} />
                </Overlay>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#80bb55',
        paddingBottom: 10
    },
    center: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        width: 180
    },
});

export default AddExpense;