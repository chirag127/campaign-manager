import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import showDialog from "../../utils/showDialog";
import { authAPI } from "../../api/apiClient";
import { Platform } from "react-native";
import LegalFooter from "../../components/LegalFooter";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login, error, isLoading } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            // Use dialog for validation errors
            showDialog(
                "Validation Error",
                "Please enter both email and password"
            );
            return;
        }

        try {
            // Call the login function directly - it will handle auth state and errors
            // The isLoading state will be set to true in the AuthContext
            const success = await login(email, password);

            // If login was successful, the navigation will be handled by the AppNavigator
            // which will show the loading screen during the transition

            // If login was not successful, the error will be shown by the login function
            // No need to handle it here
        } catch (error) {
            console.log("Login error:", error);

            // Extract error message
            const errorMessage =
                error.response?.data?.message ||
                "Invalid credentials. Please check your email and password.";

            // Show error dialog
            showDialog("Login Failed", errorMessage);
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

                <TouchableOpacity
                    onPress={() => navigation.navigate("ForgotPassword")}
                    style={styles.forgotPasswordContainer}
                >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    style={styles.button}
                    loading={isLoading}
                    disabled={isLoading}
                    labelStyle={styles.buttonLabel}
                >
                    {isLoading ? "Signing in..." : "Sign In"}
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
            <LegalFooter />
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
        paddingVertical: 8,
        borderRadius: 8,
        elevation: 2,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: "bold",
        paddingVertical: 4,
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
    forgotPasswordContainer: {
        alignItems: "flex-end",
        marginBottom: 10,
    },
    forgotPasswordText: {
        color: "#1976D2",
        fontWeight: "bold",
    },
});

export default LoginScreen;
