import { View, Text, TextInput, StyleSheet } from 'react-native';

import { GlobalStyles } from '../../constants/style';

function Input({
    label,
    keyboardType,
    secure,
    onUpdateValue,
    value,
    isInvalid,
    placeholder
}) {
    return (
        <View style={styles.inputContainer}>
            <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
                {label}
            </Text>
            <TextInput
                placeholder={placeholder}
                style={[styles.input, isInvalid && styles.inputInvalid]}
                autoCapitalize='none'
                // autoCapitalize="none"
                keyboardType={keyboardType}
                secureTextEntry={secure}
                onChangeText={onUpdateValue}
                value={value}
            />
        </View>
    );
}

export default Input;

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 8,

    },
    label: {
        color: 'black',
        marginBottom: 4,
        fontWeight: 600
    },
    labelInvalid: {
        color: GlobalStyles.colors.error500,
    },
    input: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        borderRadius: 4,
        fontSize: 16,
        borderColor: '#ccc',
        borderWidth: 1,

    },
    inputInvalid: {
        backgroundColor: GlobalStyles.colors.error100,
    },
});