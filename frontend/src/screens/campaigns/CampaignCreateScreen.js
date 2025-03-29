import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Animated } from "react-native";
import {
    TextInput,
    Button,
    Text,
    Title,
    Chip,
    HelperText,
    Divider,
    Switch,
    useTheme,
    ActivityIndicator,
    Menu,
    Checkbox,
    Surface,
} from "react-native-paper";
import { commonStyles, getShadow } from "../../utils/styleUtils";
import theme from "../../theme/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { campaignAPI, platformAPI } from "../../api/apiClient";
import {
    PLATFORMS,
    CAMPAIGN_OBJECTIVES,
    CAMPAIGN_STATUSES,
} from "../../config";
import showDialog from "../../utils/showDialog";
import CreativeAssetUploader from "../../components/CreativeAssetUploader";

const CampaignCreateScreen = ({ route, navigation }) => {
    const { campaignId } = route.params || {};
    const theme = useTheme();
    const isEditing = !!campaignId;

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [objective, setObjective] = useState("");
    const [objectiveMenuVisible, setObjectiveMenuVisible] = useState(false);
    const [status, setStatus] = useState("DRAFT");
    const [statusMenuVisible, setStatusMenuVisible] = useState(false);
    const [dailyBudget, setDailyBudget] = useState("");
    const [lifetimeBudget, setLifetimeBudget] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [hasEndDate, setHasEndDate] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [availablePlatforms, setAvailablePlatforms] = useState([]);
    const [connectedPlatforms, setConnectedPlatforms] = useState({});
    const [creativeAssets, setCreativeAssets] = useState([]);

    // UI state
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Load campaign data if editing
    useEffect(() => {
        const loadCampaignData = async () => {
            if (!isEditing) {
                return;
            }

            try {
                setLoading(true);

                // Get campaign details
                const campaignResponse = await campaignAPI.getCampaign(
                    campaignId
                );
                const campaignData = campaignResponse.data.data;

                // Set form values
                setName(campaignData.name);
                setDescription(campaignData.description || "");
                setObjective(campaignData.objective);
                setStatus(campaignData.status);
                setDailyBudget(campaignData.budget.daily.toString());
                setLifetimeBudget(
                    campaignData.budget.lifetime
                        ? campaignData.budget.lifetime.toString()
                        : ""
                );
                setCurrency(campaignData.budget.currency);
                setStartDate(new Date(campaignData.startDate));

                if (campaignData.endDate) {
                    setEndDate(new Date(campaignData.endDate));
                    setHasEndDate(true);
                }

                // Set selected platforms
                const platforms = campaignData.platforms.map((p) => p.platform);
                setSelectedPlatforms(platforms);

                // Set creative assets if available
                if (
                    campaignData.creativeAssets &&
                    campaignData.creativeAssets.length > 0
                ) {
                    setCreativeAssets(campaignData.creativeAssets);
                }
            } catch (error) {
                console.error("Error loading campaign data:", error);
                "Error", "Failed to load campaign data. Please try again.";
            } finally {
                setLoading(false);
            }
        };

        loadCampaignData();
    }, [campaignId, isEditing]);

    // Load available platforms
    useEffect(() => {
        const loadPlatforms = async () => {
            try {
                // Get connected platforms
                const platformsResponse =
                    await platformAPI.getConnectedPlatforms();
                const platformsData = platformsResponse.data.data;
                setConnectedPlatforms(platformsData);

                // Filter available platforms to only show connected ones
                const available = PLATFORMS.filter(
                    (platform) => platformsData[platform.id.toLowerCase()]
                );
                setAvailablePlatforms(available);
            } catch (error) {
                console.error("Error loading platforms:", error);
            }
        };

        loadPlatforms();
    }, []);

    // Set navigation title
    useEffect(() => {
        navigation.setOptions({
            title: isEditing ? "Edit Campaign" : "Create Campaign",
        });
    }, [isEditing, navigation]);

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Campaign name is required";
        }

        if (!objective) {
            newErrors.objective = "Please select a campaign objective";
        }

        if (
            !dailyBudget ||
            isNaN(parseFloat(dailyBudget)) ||
            parseFloat(dailyBudget) <= 0
        ) {
            newErrors.dailyBudget = "Please enter a valid daily budget";
        }

        if (hasEndDate && (!endDate || endDate <= startDate)) {
            newErrors.endDate = "End date must be after start date";
        }

        if (selectedPlatforms.length === 0) {
            newErrors.platforms = "Please select at least one platform";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            const campaignData = {
                name,
                description,
                objective,
                status,
                budget: {
                    daily: parseFloat(dailyBudget),
                    lifetime: lifetimeBudget ? parseFloat(lifetimeBudget) : 0,
                    currency,
                },
                startDate,
                endDate: hasEndDate ? endDate : null,
                platforms: selectedPlatforms.map((platform) => ({
                    platform,
                    status: "PENDING",
                })),
                creativeAssets: creativeAssets,
            };

            let response;
            if (isEditing) {
                response = await campaignAPI.updateCampaign(
                    campaignId,
                    campaignData
                );

                // Check if there were any platform errors
                const hasErrors = checkForPlatformErrors(response.data.data);

                if (!hasErrors) {
                    showDialog("Success", "Campaign updated successfully");
                    navigation.goBack();
                }
            } else {
                response = await campaignAPI.createCampaign(campaignData);
                console.log(
                    "Campaign creation response:",
                    JSON.stringify(response.data)
                );

                // Check for platform errors in the response
                if (
                    response.data.platformErrors &&
                    response.data.platformErrors.length > 0
                ) {
                    console.log(
                        "Platform errors found in response:",
                        response.data.platformErrors
                    );

                    // Create a message with all platform errors
                    const errorMessages = response.data.platformErrors.map(
                        (platform) => `${platform.platform}: ${platform.error}`
                    );

                    const errorMessage =
                        "The campaign was created but there were errors with some platforms:\n\n" +
                        errorMessages.join("\n\n") +
                        "\n\nYou can still edit the campaign and try again.";

                    showDialog("Platform Errors", errorMessage);
                } else {
                    // Check if there are any platforms with errors in the campaign data
                    const hasErrors = checkForPlatformErrors(
                        response.data.data
                    );

                    if (!hasErrors) {
                        showDialog("Success", "Campaign created successfully");
                    }
                }

                // Navigate back regardless of errors
                // This ensures the user sees the campaign in the list
                navigation.goBack();
            }
        } catch (error) {
            console.error("Error saving campaign:", error);
            console.log("Error response:", error.response?.data);

            // Display more specific error message if available
            let errorMessage = "Failed to save campaign. Please try again.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
                console.log("Using error message from response:", errorMessage);
            } else if (error.message) {
                errorMessage = error.message;
                console.log(
                    "Using error message from error object:",
                    errorMessage
                );
            }

            showDialog("Error", errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Check if any platforms have errors and show them
    const checkForPlatformErrors = (campaign) => {
        console.log("Checking for platform errors in:", campaign);

        if (
            !campaign ||
            !campaign.platforms ||
            campaign.platforms.length === 0
        ) {
            console.log("No campaign or platforms to check");
            return false;
        }

        // Log all platforms for debugging
        campaign.platforms.forEach((platform, index) => {
            console.log(
                `Platform ${index}:`,
                platform.platform,
                "Status:",
                platform.status,
                "Error:",
                platform.error
            );
        });

        const platformsWithErrors = campaign.platforms.filter(
            (platform) => platform.status === "ERROR" && platform.error
        );

        console.log("Platforms with errors:", platformsWithErrors);

        if (platformsWithErrors.length > 0) {
            // Create a message with all platform errors
            const errorMessages = platformsWithErrors.map(
                (platform) => `${platform.platform}: ${platform.error}`
            );

            const errorMessage =
                "The campaign was created but there were errors with some platforms:\n\n" +
                errorMessages.join("\n\n") +
                "\n\nYou can still edit the campaign and try again.";

            console.log("Showing error dialog with message:", errorMessage);

            showDialog("Platform Errors", errorMessage);

            return true;
        }

        return false;
    };

    const togglePlatform = (platformId) => {
        if (selectedPlatforms.includes(platformId)) {
            setSelectedPlatforms(
                selectedPlatforms.filter((id) => id !== platformId)
            );
        } else {
            setSelectedPlatforms([...selectedPlatforms, platformId]);
        }
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                    animating={true}
                />
                <Text style={styles.loadingText}>Loading campaign data...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Animated.View
                style={[styles.formContainer, { opacity: fadeAnim }]}
            >
                <Surface
                    style={[
                        {
                            padding: theme.spacing.md,
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.spacing.md,
                        },
                        getShadow(2),
                    ]}
                >
                    <Title style={styles.formTitle}>
                        {isEditing ? "Edit Campaign" : "Create New Campaign"}
                    </Title>

                    <TextInput
                        label="Campaign Name *"
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                        style={styles.input}
                        error={!!errors.name}
                    />
                    {errors.name && (
                        <HelperText type="error">{errors.name}</HelperText>
                    )}

                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        style={styles.input}
                        multiline
                        numberOfLines={3}
                    />

                    <Text style={styles.sectionTitle}>Campaign Settings</Text>

                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownLabel}>Objective *</Text>
                        <Menu
                            visible={objectiveMenuVisible}
                            onDismiss={() => setObjectiveMenuVisible(false)}
                            anchor={
                                <Button
                                    mode="outlined"
                                    onPress={() =>
                                        setObjectiveMenuVisible(true)
                                    }
                                    style={[
                                        styles.dropdownButton,
                                        errors.objective && styles.errorBorder,
                                    ]}
                                >
                                    {objective
                                        ? CAMPAIGN_OBJECTIVES.find(
                                              (obj) => obj.value === objective
                                          )?.label
                                        : "Select Objective"}
                                </Button>
                            }
                        >
                            {CAMPAIGN_OBJECTIVES.map((obj) => (
                                <Menu.Item
                                    key={obj.value}
                                    onPress={() => {
                                        setObjective(obj.value);
                                        setObjectiveMenuVisible(false);
                                    }}
                                    title={obj.label}
                                />
                            ))}
                        </Menu>
                    </View>
                    {errors.objective && (
                        <HelperText type="error">{errors.objective}</HelperText>
                    )}

                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownLabel}>Status</Text>
                        <Menu
                            visible={statusMenuVisible}
                            onDismiss={() => setStatusMenuVisible(false)}
                            anchor={
                                <Button
                                    mode="outlined"
                                    onPress={() => setStatusMenuVisible(true)}
                                    style={styles.dropdownButton}
                                >
                                    {
                                        CAMPAIGN_STATUSES.find(
                                            (s) => s.value === status
                                        )?.label
                                    }
                                </Button>
                            }
                        >
                            {CAMPAIGN_STATUSES.map((s) => (
                                <Menu.Item
                                    key={s.value}
                                    onPress={() => {
                                        setStatus(s.value);
                                        setStatusMenuVisible(false);
                                    }}
                                    title={s.label}
                                />
                            ))}
                        </Menu>
                    </View>

                    <Text style={styles.sectionTitle}>Budget</Text>

                    <View style={styles.budgetContainer}>
                        <TextInput
                            label="Daily Budget *"
                            value={dailyBudget}
                            onChangeText={setDailyBudget}
                            mode="outlined"
                            style={styles.budgetInput}
                            keyboardType="numeric"
                            error={!!errors.dailyBudget}
                            left={<TextInput.Affix text="$" />}
                        />
                        <TextInput
                            label="Currency"
                            value={currency}
                            onChangeText={setCurrency}
                            mode="outlined"
                            style={styles.currencyInput}
                        />
                    </View>
                    {errors.dailyBudget && (
                        <HelperText type="error">
                            {errors.dailyBudget}
                        </HelperText>
                    )}

                    <TextInput
                        label="Lifetime Budget (Optional)"
                        value={lifetimeBudget}
                        onChangeText={setLifetimeBudget}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        left={<TextInput.Affix text="$" />}
                    />

                    <Text style={styles.sectionTitle}>Schedule</Text>

                    <View style={styles.dateContainer}>
                        <Text style={styles.dateLabel}>Start Date *</Text>
                        <Button
                            mode="outlined"
                            onPress={() => setShowStartDatePicker(true)}
                            style={styles.dateButton}
                        >
                            {startDate.toLocaleDateString()}
                        </Button>
                    </View>

                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowStartDatePicker(false);
                                if (selectedDate) {
                                    setStartDate(selectedDate);
                                }
                            }}
                        />
                    )}

                    <View style={styles.switchContainer}>
                        <Switch
                            value={hasEndDate}
                            onValueChange={setHasEndDate}
                        />
                        <Text style={styles.switchLabel}>Set End Date</Text>
                    </View>

                    {hasEndDate && (
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateLabel}>End Date *</Text>
                            <Button
                                mode="outlined"
                                onPress={() => setShowEndDatePicker(true)}
                                style={[
                                    styles.dateButton,
                                    errors.endDate && styles.errorBorder,
                                ]}
                            >
                                {endDate
                                    ? endDate.toLocaleDateString()
                                    : "Select End Date"}
                            </Button>
                        </View>
                    )}

                    {hasEndDate && errors.endDate && (
                        <HelperText type="error">{errors.endDate}</HelperText>
                    )}

                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowEndDatePicker(false);
                                if (selectedDate) {
                                    setEndDate(selectedDate);
                                }
                            }}
                        />
                    )}

                    <Text style={styles.sectionTitle}>Platforms *</Text>

                    {availablePlatforms.length === 0 ? (
                        <View style={styles.noPlatformsContainer}>
                            <Text style={styles.noPlatformsText}>
                                No platforms connected. Please connect to
                                platforms in the Platforms tab.
                            </Text>
                            <Button
                                mode="contained"
                                onPress={() => navigation.navigate("Platforms")}
                                style={styles.connectButton}
                            >
                                Connect Platforms
                            </Button>
                        </View>
                    ) : (
                        <View style={styles.platformsContainer}>
                            {availablePlatforms.map((platform) => (
                                <View
                                    key={platform.id}
                                    style={styles.platformItem}
                                >
                                    <Checkbox
                                        status={
                                            selectedPlatforms.includes(
                                                platform.id
                                            )
                                                ? "checked"
                                                : "unchecked"
                                        }
                                        onPress={() =>
                                            togglePlatform(platform.id)
                                        }
                                        color={platform.color}
                                    />
                                    <Text
                                        style={styles.platformName}
                                        onPress={() =>
                                            togglePlatform(platform.id)
                                        }
                                    >
                                        {platform.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {errors.platforms && (
                        <HelperText type="error">{errors.platforms}</HelperText>
                    )}

                    <Text style={styles.sectionTitle}>Creative Assets</Text>
                    <Text style={styles.helperText}>
                        Upload images or videos to create ads for your campaign.
                        These will be used to create ads on the selected
                        platforms.
                    </Text>

                    <CreativeAssetUploader
                        assets={creativeAssets}
                        onChange={setCreativeAssets}
                        maxAssets={5}
                    />

                    <Divider style={styles.divider} />

                    <View style={styles.buttonContainer}>
                        <Button
                            mode="outlined"
                            onPress={() => navigation.goBack()}
                            style={styles.button}
                            disabled={submitting}
                            color={theme.colors.textSecondary}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            style={styles.button}
                            loading={submitting}
                            disabled={
                                submitting || availablePlatforms.length === 0
                            }
                            color={theme.colors.primary}
                            labelStyle={{ color: "white", fontWeight: "bold" }}
                        >
                            {isEditing ? "Update Campaign" : "Create Campaign"}
                        </Button>
                    </View>
                </Surface>
            </Animated.View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: theme.typography.fontSizes.md,
        color: theme.colors.primary,
    },
    formContainer: {
        padding: theme.spacing.md,
        maxWidth: 800,
        alignSelf: "center",
        width: "100%",
    },
    formTitle: {
        fontSize: theme.typography.fontSizes.xxl,
        fontWeight: theme.typography.fontWeights.bold,
        marginBottom: theme.spacing.lg,
        color: theme.colors.primary,
        textAlign: "center",
    },
    input: {
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSizes.lg,
        fontWeight: theme.typography.fontWeights.bold,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        color: theme.colors.primary,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
        paddingLeft: theme.spacing.sm,
    },
    helperText: {
        marginBottom: theme.spacing.md,
        fontSize: theme.typography.fontSizes.sm,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    dropdownContainer: {
        marginBottom: theme.spacing.md,
    },
    dropdownLabel: {
        marginBottom: theme.spacing.xs,
        fontSize: theme.typography.fontSizes.md,
        color: theme.colors.text,
    },
    dropdownButton: {
        width: "100%",
        justifyContent: "flex-start",
        borderColor: theme.colors.border,
        borderWidth: 1,
    },
    budgetContainer: {
        flexDirection: "row",
        marginBottom: theme.spacing.md,
    },
    budgetInput: {
        flex: 3,
        marginRight: theme.spacing.md,
        backgroundColor: theme.colors.surface,
    },
    currencyInput: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    dateContainer: {
        marginBottom: theme.spacing.md,
    },
    dateLabel: {
        marginBottom: theme.spacing.xs,
        fontSize: theme.typography.fontSizes.md,
        color: theme.colors.text,
    },
    dateButton: {
        width: "100%",
        justifyContent: "flex-start",
        borderColor: theme.colors.border,
        borderWidth: 1,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        ...getShadow(1),
    },
    switchLabel: {
        marginLeft: theme.spacing.sm,
        fontSize: theme.typography.fontSizes.md,
        color: theme.colors.text,
    },
    platformsContainer: {
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        ...getShadow(1),
    },
    platformItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.sm,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.background,
    },
    platformName: {
        marginLeft: theme.spacing.sm,
        fontSize: theme.typography.fontSizes.md,
        color: theme.colors.text,
    },
    noPlatformsContainer: {
        alignItems: "center",
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        ...getShadow(2),
    },
    noPlatformsText: {
        textAlign: "center",
        marginBottom: theme.spacing.md,
        fontSize: theme.typography.fontSizes.md,
        color: theme.colors.textSecondary,
    },
    connectButton: {
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.sm,
    },
    divider: {
        marginVertical: theme.spacing.lg,
        backgroundColor: theme.colors.border,
        height: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: theme.spacing.xl,
        marginTop: theme.spacing.lg,
    },
    button: {
        flex: 1,
        marginHorizontal: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: theme.spacing.xs,
        ...getShadow(2),
    },
    errorBorder: {
        borderColor: theme.colors.error,
    },
});

export default CampaignCreateScreen;
