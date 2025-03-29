import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TouchableOpacity,
    Animated,
} from "react-native";
import {
    Button,
    Text,
    Card,
    IconButton,
    Title,
    Chip,
    useTheme,
    ActivityIndicator,
    TextInput,
    Surface,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { uploadAPI } from "../api/apiClient";
import showDialog from "../utils/showDialog";
import { commonStyles, getShadow } from "../utils/styleUtils";
import theme from "../theme/theme";

const CALL_TO_ACTIONS = [
    "LEARN_MORE",
    "SIGN_UP",
    "DOWNLOAD",
    "SHOP_NOW",
    "BOOK_TRAVEL",
    "CONTACT_US",
    "DONATE_NOW",
    "GET_OFFER",
    "GET_QUOTE",
    "SUBSCRIBE",
];

const CreativeAssetUploader = ({ assets = [], onChange, maxAssets = 5 }) => {
    const theme = useTheme();
    const [uploading, setUploading] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Request permissions for media library
    const requestPermissions = async () => {
        if (Platform.OS !== "web") {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                showDialog(
                    "Permission Required",
                    "Sorry, we need camera roll permissions to upload images and videos."
                );
                return false;
            }
        }
        return true;
    };

    // Pick an image from the device
    const pickImage = async () => {
        // Prevent multiple calls if already uploading
        if (uploading) return;

        if (assets.length >= maxAssets) {
            showDialog(
                "Limit Reached",
                `You can only upload up to ${maxAssets} assets.`
            );
            return;
        }

        // Set uploading to true to prevent multiple picker launches
        setUploading(true);

        try {
            // Check permissions first
            const hasPermission = await requestPermissions();
            if (!hasPermission) {
                setUploading(false);
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                await uploadAsset(selectedImage.uri, "IMAGE");
            } else {
                // If user cancels, we need to reset uploading state
                setUploading(false);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            showDialog("Error", "Failed to pick image. Please try again.");
            setUploading(false);
        }
    };

    // Pick a video from the device
    const pickVideo = async () => {
        // Prevent multiple calls if already uploading
        if (uploading) return;

        if (assets.length >= maxAssets) {
            showDialog(
                "Limit Reached",
                `You can only upload up to ${maxAssets} assets.`
            );
            return;
        }

        // Show a message that only images are supported with FreeImageHost
        showDialog(
            "Feature Limitation",
            "Currently, only image uploads are supported. Video uploads will be available in a future update."
        );
        return;

        // Keeping the code below for future implementation
        /*
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedVideo = result.assets[0];
                await uploadAsset(selectedVideo.uri, "VIDEO");
            }
        } catch (error) {
            console.error("Error picking video:", error);
            showDialog("Error", "Failed to pick video. Please try again.");
        }
        */
    };

    // Upload asset to server
    const uploadAsset = async (uri, type) => {
        // uploading state is already set to true in pickImage
        try {
            // For web platform, we need to handle file differently
            if (Platform.OS === "web") {
                // For web, we need to use DocumentPicker
                const result = await DocumentPicker.getDocumentAsync({
                    type: type === "IMAGE" ? "image/*" : "video/*",
                    copyToCacheDirectory: false,
                });

                if (result.canceled) {
                    setUploading(false);
                    return;
                }

                const file = result.assets[0];

                // For web, we need to get the actual file object
                const response = await fetch(file.uri);
                const blob = await response.blob();

                const formData = new FormData();
                formData.append("file", blob, file.name);

                const uploadResponse = await uploadAPI.uploadFile(formData);

                if (uploadResponse.data.success) {
                    const newAsset = {
                        type,
                        url: uploadResponse.data.data.url,
                        title: `Image ${assets.length + 1}`,
                        description: "",
                        callToAction: "LEARN_MORE",
                    };

                    onChange([...assets, newAsset]);
                    showDialog("Success", "Asset uploaded successfully");
                }
            } else {
                // For mobile platforms
                // Check if it's an image (FreeImageHost only supports images)
                if (type !== "IMAGE") {
                    setUploading(false);
                    showDialog(
                        "Feature Limitation",
                        "Currently, only image uploads are supported. Video uploads will be available in a future update."
                    );
                    return;
                }
                const filename = uri.split("/").pop();
                const match = /\\.(\w+)$/.exec(filename);
                const fileType = match
                    ? `${type.toLowerCase()}/${match[1]}`
                    : "image/jpeg";

                // Create form data
                const formData = new FormData();
                formData.append("file", {
                    uri,
                    name: filename,
                    type: fileType,
                });

                const uploadResponse = await uploadAPI.uploadFile(formData);

                if (uploadResponse.data.success) {
                    const newAsset = {
                        type,
                        url: uploadResponse.data.data.url,
                        title: `Image ${assets.length + 1}`,
                        description: "",
                        callToAction: "LEARN_MORE",
                    };

                    onChange([...assets, newAsset]);
                    showDialog("Success", "Asset uploaded successfully");
                }
            }
        } catch (error) {
            console.error("Error uploading asset:", error);
            showDialog("Error", "Failed to upload asset. Please try again.");
        } finally {
            // Reset uploading state when done
            setUploading(false);
        }
    };

    // Remove an asset
    const removeAsset = (index) => {
        const updatedAssets = [...assets];
        updatedAssets.splice(index, 1);
        onChange(updatedAssets);
    };

    // Update asset details
    const updateAssetDetails = (index, field, value) => {
        const updatedAssets = [...assets];
        updatedAssets[index] = {
            ...updatedAssets[index],
            [field]: value,
        };
        onChange(updatedAssets);
    };

    // Animation value for card scale
    const [scaleAnim] = useState(() => new Animated.Value(1));

    // Animation for card press
    const animatePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Render asset card
    const renderAssetCard = (asset, index) => {
        const isSelected = selectedAsset === index;

        return (
            <Animated.View
                key={index}
                style={[{ transform: [{ scale: scaleAnim }] }]}
            >
                <Surface
                    style={[
                        styles.assetCard,
                        getShadow(isSelected ? 4 : 2),
                        isSelected && {
                            borderColor: theme.colors.primary,
                            borderWidth: 2,
                        },
                    ]}
                >
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            animatePress();
                            setSelectedAsset(index);
                            setEditMode(true);
                        }}
                        style={styles.cardTouchable}
                    >
                        <View style={styles.assetHeader}>
                            <Title style={styles.assetTitle} numberOfLines={1}>
                                {asset.title || `Asset ${index + 1}`}
                            </Title>
                            <IconButton
                                icon="delete"
                                size={20}
                                color={theme.colors.error}
                                onPress={() => removeAsset(index)}
                                style={styles.deleteButton}
                            />
                        </View>

                        {asset.type === "IMAGE" ? (
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: asset.url }}
                                    style={styles.assetPreview}
                                    resizeMode="cover"
                                />
                            </View>
                        ) : (
                            <View style={styles.videoPreview}>
                                <IconButton
                                    icon="play"
                                    size={40}
                                    color="#fff"
                                />
                                <Text style={styles.videoLabel}>Video</Text>
                            </View>
                        )}

                        <View style={styles.chipContainer}>
                            <Chip
                                style={[
                                    styles.assetTypeChip,
                                    { backgroundColor: theme.colors.primary },
                                ]}
                                textStyle={{ color: "white" }}
                            >
                                {asset.type}
                            </Chip>

                            {asset.callToAction && (
                                <Chip
                                    style={[
                                        styles.ctaChip,
                                        {
                                            backgroundColor:
                                                theme.colors.secondary,
                                        },
                                    ]}
                                    textStyle={{ color: "white" }}
                                >
                                    {asset.callToAction}
                                </Chip>
                            )}
                        </View>
                    </TouchableOpacity>
                </Surface>
            </Animated.View>
        );
    };

    // Render asset editor
    const renderAssetEditor = () => {
        if (selectedAsset === null || !editMode) return null;

        const asset = assets[selectedAsset];

        return (
            <Surface style={[styles.editorCard, getShadow(3)]}>
                <View style={styles.editorHeader}>
                    <Title style={styles.editorTitle}>Edit Asset Details</Title>
                    <IconButton
                        icon="close"
                        size={24}
                        onPress={() => setEditMode(false)}
                        style={styles.closeButton}
                    />
                </View>
                <View style={styles.editorContent}>
                    <TextInput
                        label="Title"
                        value={asset.title}
                        onChangeText={(text) =>
                            updateAssetDetails(selectedAsset, "title", text)
                        }
                        mode="outlined"
                        style={styles.input}
                        theme={{ colors: { primary: theme.colors.primary } }}
                    />

                    <TextInput
                        label="Description"
                        value={asset.description}
                        onChangeText={(text) =>
                            updateAssetDetails(
                                selectedAsset,
                                "description",
                                text
                            )
                        }
                        mode="outlined"
                        style={styles.input}
                        multiline
                        numberOfLines={3}
                        theme={{ colors: { primary: theme.colors.primary } }}
                    />

                    <Text style={styles.label}>Call to Action</Text>
                    <View style={styles.ctaContainer}>
                        {CALL_TO_ACTIONS.map((cta) => (
                            <Chip
                                key={cta}
                                selected={asset.callToAction === cta}
                                onPress={() =>
                                    updateAssetDetails(
                                        selectedAsset,
                                        "callToAction",
                                        cta
                                    )
                                }
                                style={styles.ctaOption}
                                selectedColor={theme.colors.primary}
                                textStyle={{
                                    color:
                                        asset.callToAction === cta
                                            ? "white"
                                            : theme.colors.text,
                                    fontWeight:
                                        asset.callToAction === cta
                                            ? "bold"
                                            : "normal",
                                }}
                            >
                                {cta}
                            </Chip>
                        ))}
                    </View>

                    <Button
                        mode="contained"
                        onPress={() => setEditMode(false)}
                        style={styles.doneButton}
                        color={theme.colors.primary}
                        labelStyle={{ color: "white", fontWeight: "bold" }}
                    >
                        Save Changes
                    </Button>
                </View>
            </Surface>
        );
    };

    // Animation for fade-in effect
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Surface style={styles.headerContainer}>
                <Title style={styles.title}>Creative Assets</Title>
                <Text style={styles.subtitle}>
                    Add images to create engaging ads for your campaign
                </Text>
            </Surface>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    icon="image"
                    onPress={pickImage}
                    style={styles.uploadButton}
                    disabled={uploading || assets.length >= maxAssets}
                    color={theme.colors.primary}
                    labelStyle={{ color: "white", fontWeight: "bold" }}
                    contentStyle={{ height: 45, justifyContent: "center" }}
                >
                    Upload Image
                </Button>

                <Button
                    mode="contained"
                    icon="video"
                    onPress={pickVideo}
                    style={styles.uploadButton}
                    disabled={uploading || assets.length >= maxAssets}
                    color={theme.colors.secondary}
                    labelStyle={{ color: "white", fontWeight: "bold" }}
                    contentStyle={{ height: 45, justifyContent: "center" }}
                >
                    Upload Video
                </Button>
            </View>

            {uploading && (
                <Surface style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary}
                        animating={true}
                    />
                    <Text style={styles.loadingText}>Uploading asset...</Text>
                </Surface>
            )}

            {assets.length > 0 ? (
                <View style={styles.assetsContainer}>
                    {assets.map((asset, index) =>
                        renderAssetCard(asset, index)
                    )}
                </View>
            ) : (
                <Surface style={styles.emptyContainer}>
                    <IconButton
                        icon="image-multiple"
                        size={40}
                        color={theme.colors.textLight}
                    />
                    <Text style={styles.emptyText}>
                        No creative assets added yet. Upload images or videos to
                        create engaging ads for your campaign.
                    </Text>
                </Surface>
            )}

            {renderAssetEditor()}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
    },
    headerContainer: {
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        ...getShadow(2),
    },
    title: {
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: theme.typography.fontWeights.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: theme.typography.fontSizes.md,
        color: theme.colors.textSecondary,
    },
    buttonContainer: {
        flexDirection: "row",
        marginBottom: theme.spacing.lg,
        justifyContent: "center",
    },
    uploadButton: {
        marginHorizontal: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        ...getShadow(2),
        minWidth: 150,
    },
    loadingContainer: {
        alignItems: "center",
        marginVertical: theme.spacing.lg,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        ...getShadow(1),
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: theme.typography.fontSizes.md,
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeights.medium,
    },
    assetsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    assetCard: {
        width: "48%",
        marginBottom: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        overflow: "hidden",
    },
    cardTouchable: {
        padding: theme.spacing.md,
    },
    assetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing.sm,
    },
    assetTitle: {
        fontSize: theme.typography.fontSizes.md,
        fontWeight: theme.typography.fontWeights.semibold,
        flex: 1,
        color: theme.colors.text,
    },
    deleteButton: {
        margin: 0,
        padding: 0,
    },
    imageContainer: {
        borderRadius: theme.borderRadius.sm,
        overflow: "hidden",
        ...getShadow(1),
    },
    assetPreview: {
        height: 140,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.background,
    },
    videoPreview: {
        height: 140,
        backgroundColor: "#000",
        borderRadius: theme.borderRadius.sm,
        marginVertical: theme.spacing.sm,
        justifyContent: "center",
        alignItems: "center",
        ...getShadow(1),
    },
    videoLabel: {
        color: "#fff",
        fontWeight: theme.typography.fontWeights.medium,
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: theme.spacing.sm,
    },
    assetTypeChip: {
        marginRight: theme.spacing.xs,
        marginBottom: theme.spacing.xs,
        height: 28,
    },
    ctaChip: {
        marginBottom: theme.spacing.xs,
        height: 28,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background,
        ...getShadow(1),
    },
    emptyText: {
        textAlign: "center",
        marginTop: theme.spacing.md,
        fontSize: theme.typography.fontSizes.md,
        color: theme.colors.textSecondary,
        fontStyle: "italic",
        maxWidth: 300,
    },
    editorCard: {
        marginTop: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        overflow: "hidden",
    },
    editorHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing.md,
        backgroundColor: theme.colors.primary,
    },
    editorTitle: {
        color: "white",
        fontSize: theme.typography.fontSizes.lg,
        fontWeight: theme.typography.fontWeights.bold,
    },
    closeButton: {
        margin: 0,
    },
    editorContent: {
        padding: theme.spacing.md,
    },
    input: {
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
    },
    label: {
        marginBottom: theme.spacing.sm,
        fontWeight: theme.typography.fontWeights.semibold,
        fontSize: theme.typography.fontSizes.md,
        color: theme.colors.text,
    },
    ctaContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: theme.spacing.lg,
    },
    ctaOption: {
        margin: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    doneButton: {
        marginTop: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: theme.spacing.xs,
        ...getShadow(2),
    },
});

export default CreativeAssetUploader;
