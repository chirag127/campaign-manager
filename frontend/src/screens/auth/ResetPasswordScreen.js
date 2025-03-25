import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { authAPI } from "../../api/apiClient";
import showDialog from "../../utils/showDialog";

const ResetPasswordScreen = ({ navigation, route }) => {
    // Get email from route params if available
    const initialEmail = route.params?.email || "";

    const [email, setEmail] = useState(initialEmail);
    const [resetCode, setResetCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Update email if it changes in route params
        if (route.params?.email) {
            setEmail(route.params.email);
        }
    }, [route.params?.email]);

    const handleResetPassword = async () => {
        // Validate inputs
        if (!email || !resetCode || !password || !confirmPassword) {
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

        setIsLoading(true);

        try {
            // First verify the reset code
            await authAPI.verifyResetCode(email, resetCode);

            // Then reset the password
            await authAPI.resetPassword(email, resetCode, password);

            showDialog(
                "Success",
                "Your password has been reset successfully. Please login with your new password."
            );

            // Navigate to login screen
            navigation.navigate("Login");
        } catch (error) {
            console.error("Reset password error:", error);

            // Extract error message
            const errorMessage =
                error.response?.data?.message ||
                "Failed to reset password. Please try again.";

            showDialog("Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <Title style={styles.title}>Reset Password</Title>
                <Text style={styles.subtitle}>
                    Enter the reset code sent to your email and your new password
                </Text>

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    disabled={!!initialEmail}
                />

                <TextInput
                    label="Reset Code"
                    value={resetCode}
                    onChangeText={setResetCode}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="number-pad"
                />

                <TextInput
                    label="New Password"
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
                    onPress={handleResetPassword}
                    style={styles.button}
                    loading={isLoading}
                    disabled={isLoading}
                    labelStyle={styles.buttonLabel}
                >
                    {isLoading ? "Resetting password..." : "Reset Password"}
                </Button>

                <TouchableOpacity
                    onPress={() => navigation.navigate("ForgotPassword")}
                    style={styles.linkContainer}
                >
                    <Text style={styles.link}>Didn't receive a code?</Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text>Remember your password? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
        paddingTop: 40,
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

export default ResetPasswordScreen;
