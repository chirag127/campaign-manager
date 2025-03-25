import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import showDialog from "../../utils/showDialog";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { register, error, isLoading } = useContext(AuthContext);

    const handleRegister = async () => {
        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            showDialog("Validation Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            showDialog("Validation Error", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            showDialog(
                "Validation Error",
                "Password must be at least 6 characters"
            );
            return;
        }

        try {
            // Call the register function - it will handle auth state and errors
            // The isLoading state will be set to true in the AuthContext
            const success = await register(name, email, password);

            // If registration was successful, the navigation will be handled by the AppNavigator
            // which will show the loading screen during the transition

            // If registration was not successful, the error will be shown by the register function
            // No need to handle it here
        } catch (error) {
            console.log("Registration error:", error);

            // Extract error message
            const errorMessage =
                error.response?.data?.message ||
                "Registration failed. Please try again.";

            // Show error dialog
            showDialog("Registration Failed", errorMessage);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <Title style={styles.title}>Create Account</Title>
                <Text style={styles.subtitle}>Sign up to get started</Text>

                <TextInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                />

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

                <TextInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
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
                    onPress={handleRegister}
                    style={styles.button}
                    loading={isLoading}
                    disabled={isLoading}
                    labelStyle={styles.buttonLabel}
                >
                    {isLoading ? "Creating account..." : "Sign Up"}
                </Button>

                <View style={styles.loginContainer}>
                    <Text>Already have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.loginText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
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
        paddingTop: 60,
        paddingBottom: 40,
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
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    loginText: {
        color: "#1976D2",
        fontWeight: "bold",
    },
});

export default RegisterScreen;
