import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TouchableOpacity,
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
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { uploadAPI } from "../api/apiClient";
import showDialog from "../utils/showDialog";

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
        if (assets.length >= maxAssets) {
            showDialog(
                "Limit Reached",
                `You can only upload up to ${maxAssets} assets.`
            );
            return;
        }

        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                await uploadAsset(selectedImage.uri, "IMAGE");
            }
        } catch (error) {
            console.error("Error picking image:", error);
            showDialog("Error", "Failed to pick image. Please try again.");
        }
    };

    // Pick a video from the device
    const pickVideo = async () => {
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
        setUploading(true);
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

    // Render asset card
    const renderAssetCard = (asset, index) => {
        const isSelected = selectedAsset === index;

        return (
            <Card
                key={index}
                style={[
                    styles.assetCard,
                    isSelected && {
                        borderColor: theme.colors.primary,
                        borderWidth: 2,
                    },
                ]}
                onPress={() => {
                    setSelectedAsset(index);
                    setEditMode(true);
                }}
            >
                <Card.Content>
                    <View style={styles.assetHeader}>
                        <Title style={styles.assetTitle} numberOfLines={1}>
                            {asset.title || `Asset ${index + 1}`}
                        </Title>
                        <IconButton
                            icon="delete"
                            size={20}
                            onPress={() => removeAsset(index)}
                        />
                    </View>

                    {asset.type === "IMAGE" ? (
                        <Image
                            source={{ uri: asset.url }}
                            style={styles.assetPreview}
                        />
                    ) : (
                        <View style={styles.videoPreview}>
                            <IconButton icon="play" size={40} color="#fff" />
                            <Text style={styles.videoLabel}>Video</Text>
                        </View>
                    )}

                    <Chip style={styles.assetTypeChip}>{asset.type}</Chip>

                    {asset.callToAction && (
                        <Chip style={styles.ctaChip}>{asset.callToAction}</Chip>
                    )}
                </Card.Content>
            </Card>
        );
    };

    // Render asset editor
    const renderAssetEditor = () => {
        if (selectedAsset === null || !editMode) return null;

        const asset = assets[selectedAsset];

        return (
            <Card style={styles.editorCard}>
                <Card.Title title="Edit Asset Details" />
                <Card.Content>
                    <TextInput
                        label="Title"
                        value={asset.title}
                        onChangeText={(text) =>
                            updateAssetDetails(selectedAsset, "title", text)
                        }
                        mode="outlined"
                        style={styles.input}
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
                            >
                                {cta}
                            </Chip>
                        ))}
                    </View>

                    <Button
                        mode="contained"
                        onPress={() => setEditMode(false)}
                        style={styles.doneButton}
                    >
                        Done
                    </Button>
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Creative Assets</Title>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    icon="image"
                    onPress={pickImage}
                    style={styles.uploadButton}
                    disabled={uploading || assets.length >= maxAssets}
                >
                    Upload Image
                </Button>

                <Button
                    mode="contained"
                    icon="video"
                    onPress={pickVideo}
                    style={styles.uploadButton}
                    disabled={uploading || assets.length >= maxAssets}
                >
                    Upload Video
                </Button>
            </View>

            {uploading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary}
                    />
                    <Text style={styles.loadingText}>Uploading asset...</Text>
                </View>
            )}

            {assets.length > 0 ? (
                <View style={styles.assetsContainer}>
                    {assets.map((asset, index) =>
                        renderAssetCard(asset, index)
                    )}
                </View>
            ) : (
                <Text style={styles.emptyText}>
                    No creative assets added yet. Upload images or videos to
                    create ads.
                </Text>
            )}

            {renderAssetEditor()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    title: {
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    uploadButton: {
        marginRight: 8,
    },
    loadingContainer: {
        alignItems: "center",
        marginVertical: 16,
    },
    loadingText: {
        marginTop: 8,
    },
    assetsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    assetCard: {
        width: "48%",
        marginBottom: 16,
        marginRight: "2%",
    },
    assetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    assetTitle: {
        fontSize: 16,
        flex: 1,
    },
    assetPreview: {
        height: 120,
        borderRadius: 4,
        marginVertical: 8,
    },
    videoPreview: {
        height: 120,
        backgroundColor: "#000",
        borderRadius: 4,
        marginVertical: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    videoLabel: {
        color: "#fff",
    },
    assetTypeChip: {
        alignSelf: "flex-start",
        marginBottom: 4,
    },
    ctaChip: {
        alignSelf: "flex-start",
    },
    emptyText: {
        textAlign: "center",
        marginVertical: 24,
        fontStyle: "italic",
    },
    editorCard: {
        marginTop: 16,
    },
    input: {
        marginBottom: 12,
    },
    label: {
        marginBottom: 8,
        fontWeight: "bold",
    },
    ctaContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 16,
    },
    ctaOption: {
        margin: 4,
    },
    doneButton: {
        marginTop: 8,
    },
});

export default CreativeAssetUploader;
