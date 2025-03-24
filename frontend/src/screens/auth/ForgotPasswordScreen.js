import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { authAPI } from "../../api/apiClient";
import showDialog from "../../utils/showDialog";

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!email) {
            showDialog("Validation Error", "Please enter your email address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await authAPI.forgotPassword(email);

            showDialog(
                "Reset Code Sent",
                "A password reset code has been sent to your email address. Please check your inbox."
            );

            // Navigate to reset password screen with email pre-filled
            navigation.navigate("ResetPassword", { email });
        } catch (error) {
            console.error("Forgot password error:", error);

            // Extract error message
            const errorMessage =
                error.response?.data?.message ||
                "Failed to send reset code. Please try again.";

            showDialog("Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAlreadyHaveCode = () => {
        navigation.navigate("ResetPassword", { email });
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Title style={styles.title}>Forgot Password</Title>
                <Text style={styles.subtitle}>
                    Enter your email address to receive a password reset code
                </Text>

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Button
                    mode="contained"
                    onPress={handleForgotPassword}
                    style={styles.button}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Send Reset Code
                </Button>

                <TouchableOpacity
                    onPress={handleAlreadyHaveCode}
                    style={styles.linkContainer}
                >
                    <Text style={styles.link}>Already have a reset code?</Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text>Remember your password? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.loginText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    linkContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    link: {
        color: "#1976D2",
        fontWeight: "bold",
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

export default ForgotPasswordScreen;
