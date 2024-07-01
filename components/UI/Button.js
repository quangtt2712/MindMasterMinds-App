import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlobalStyles } from '../../constants/style';

function Button({ disabled, children, onPress }) {
    return (
        <Pressable
            disabled={disabled}
            style={
                ({ pressed }) => [styles.button, pressed && styles.pressed, (disabled && styles.disabled)]

            }
            onPress={onPress}
        >
            <View>
                <Text style={styles.buttonText}>{children}</Text>
            </View>
        </Pressable>
    );
}

export default Button;

const styles = StyleSheet.create({
    disabled: {
        backgroundColor: '#ccc'
    },
    button: {
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: GlobalStyles.colors.backgroundColorPrimary100,
        elevation: 2,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    pressed: {
        opacity: 0.7,
    },
    buttonText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 8
    },
});