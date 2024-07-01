import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../UI/Button';
import Input from './Input';

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
    const [enteredFirstName, setEnteredFirstName] = useState('');
    const [enteredLastName, setEnteredLastName] = useState('');
    const {
        email: emailIsInvalid,
        password: passwordIsInvalid,
        confirmPassword: passwordsDontMatch,
        firstName: firstNameIsInvalid,
        lastName: lastNameIsInvalid,
    } = credentialsInvalid;

    function updateInputValueHandler(inputType, enteredValue) {
        switch (inputType) {
            case 'email':
                setEnteredEmail(enteredValue);
                break;
            case 'password':
                setEnteredPassword(enteredValue);
                break;
            case 'confirmPassword':
                setEnteredConfirmPassword(enteredValue);
                break;
            case 'firstName':
                setEnteredFirstName(enteredValue)
                break;
            case 'lastName':
                setEnteredLastName(enteredValue)
                break;
        }
    }

    function submitHandler() {
        onSubmit({
            email: enteredEmail,
            password: enteredPassword,
            confirmPassword: enteredConfirmPassword,
            lastName: enteredLastName,
            firstName: enteredFirstName
        });
    }

    return (
        <View style={styles.form}>
            <View>
                {!isLogin && (
                    <Input
                        label="First Name"
                        onUpdateValue={updateInputValueHandler.bind(
                            this,
                            'firstName'
                        )}
                        value={enteredFirstName}
                        isInvalid={firstNameIsInvalid}
                        placeholder='FirstName'
                    />
                )}
                {!isLogin && (
                    <Input
                        label="Last Name"
                        onUpdateValue={updateInputValueHandler.bind(
                            this,
                            'lastName'
                        )}
                        placeholder='LastName'
                        value={enteredLastName}
                        isInvalid={lastNameIsInvalid}
                    />
                )}
                <Input
                    label="Email Address"
                    onUpdateValue={updateInputValueHandler.bind(this, 'email')}
                    value={enteredEmail}
                    keyboardType="email-address"
                    isInvalid={emailIsInvalid}
                    placeholder="Email"
                />
                <Input
                    label="Password"
                    onUpdateValue={updateInputValueHandler.bind(this, 'password')}
                    secure
                    value={enteredPassword}
                    isInvalid={passwordIsInvalid}
                    placeholder="Password"
                />
                {!isLogin && (
                    <Input
                        label="Confirm Password"
                        onUpdateValue={updateInputValueHandler.bind(
                            this,
                            'confirmPassword'
                        )}
                        secure
                        value={enteredConfirmPassword}
                        isInvalid={passwordsDontMatch}
                    />
                )}

                <View style={styles.buttons}>
                    <Button onPress={submitHandler}>
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </Button>
                </View>
            </View>
        </View>
    );
}

export default AuthForm;

const styles = StyleSheet.create({
    buttons: {
        marginTop: 20,
    },
});