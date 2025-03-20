import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Title, Snackbar } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const { login, error, isLoading } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            setSnackbarMessage("Please enter both email and password");
            setSnackbarVisible(true);
            return;
        }

        const success = await login(email, password);

        if (!success && error) {
            setSnackbarMessage(error);
            setSnackbarVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Title style={styles.title}>Campaign Manager</Title>
                <Text style={styles.subtitle}>Sign in to your account</Text>

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    right={
                        <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                />

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    style={styles.button}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Sign In
                </Button>

                <View style={styles.registerContainer}>
                    <Text>Don't have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.registerText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: "Close",
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30,
        color: "#666",
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        paddingVertical: 6,
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    registerText: {
        color: "#1976D2",
        fontWeight: "bold",
    },
});

export default LoginScreen;
