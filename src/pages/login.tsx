import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/use-profile';

export function Login() {
    const [username, setUsername] = useState('emilys');
    const [password, setPassword] = useState('emilyspass');
    const { login, isLoading, error, token } = useAuth();

    const handleLogin = async () => {
        console.log('Attempting login...');
        try {
            const result = await login(username, password);
            console.log('Login successful!', {
                storedToken: token, 
                returnedToken: result.token 
            });
        } catch (error) {
            console.error('Login error in component:', error);
        }
    };

    useEffect(() => {
        console.log('Token updated in Login component:', token);
    }, [token]);


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Usuário"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    
                </View>
            ) : (
                <Button 
                    title="Entrar" 
                    onPress={handleLogin} 
                    disabled={isLoading}
                />
            )}
            
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    loadingText: {
        marginTop: 8,
    },
});