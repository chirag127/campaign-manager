import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import { Button, Text, Title, useTheme } from "react-native-paper";

/**
 * Custom dialog box component for web platform
 *
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the dialog is visible
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {Array} props.buttons - Array of button objects with text, style, and onPress properties
 * @param {function} props.onDismiss - Function to call when dialog is dismissed
 */
const DialogBox = ({ visible, title, message, buttons = [], onDismiss }) => {
    const theme = useTheme();

    // Default button if none provided
    const defaultButtons = [{ text: "OK", onPress: onDismiss }];

    const dialogButtons = buttons.length > 0 ? buttons : defaultButtons;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <View style={styles.centeredView}>
                <View
                    style={[
                        styles.modalView,
                        { backgroundColor: theme.colors.surface },
                    ]}
                >
                    <Title style={styles.title}>{title}</Title>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {dialogButtons.map((button, index) => (
                            <Button
                                key={index}
                                mode={
                                    button.style === "destructive"
                                        ? "contained"
                                        : "text"
                                }
                                buttonColor={
                                    button.style === "destructive"
                                        ? theme.colors.error
                                        : undefined
                                }
                                textColor={
                                    button.style === "destructive"
                                        ? "white"
                                        : theme.colors.primary
                                }
                                onPress={() => {
                                    if (button.onPress) button.onPress();
                                    if (!button.preventDismiss) onDismiss();
                                }}
                                style={styles.button}
                            >
                                {button.text}
                            </Button>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        margin: 20,
        borderRadius: 8,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minWidth: 300,
        maxWidth: "80%",
    },
    title: {
        marginBottom: 12,
        textAlign: "center",
    },
    message: {
        marginBottom: 20,
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "100%",
        marginTop: 8,
    },
    button: {
        marginLeft: 8,
    },
});

export default DialogBox;
