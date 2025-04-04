import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    ScrollView,
    Platform,
    Alert,
} from "react-native";
import { getAnimationConfig } from "../../utils/animationUtils";
import showDialog from "../../utils/showDialog";
import {
    Text,
    Card,
    Title,
    Paragraph,
    Button,
    Chip,
    FAB,
    ActivityIndicator,
    Searchbar,
    useTheme,
    Banner,
} from "react-native-paper";
import { campaignAPI } from "../../api/apiClient";
import { CAMPAIGN_STATUSES } from "../../config";
import { generateDummyCampaigns } from "../../utils/dummyData";

const CampaignListScreen = ({ navigation }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [showDummyData, setShowDummyData] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            const response = await campaignAPI.getCampaigns();
            const campaignsData = response.data.data;
            setCampaigns(campaignsData);
            setFilteredCampaigns(campaignsData);
        } catch (error) {
            console.error("Error loading campaigns:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    useEffect(() => {
        // Apply filters when campaigns, search query, or status filter changes
        let filtered = [...campaigns];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter((campaign) =>
                campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter(
                (campaign) => campaign.status === statusFilter
            );
        }

        setFilteredCampaigns(filtered);
    }, [campaigns, searchQuery, statusFilter]);

    const onRefresh = () => {
        setRefreshing(true);
        loadCampaigns();
    };

    const handleDeleteCampaign = (id) => {
        // Show confirmation dialog
        if (Platform.OS === "web") {
            if (
                confirm(
                    "Are you sure you want to delete this campaign? This action cannot be undone."
                )
            ) {
                deleteCampaign(id);
            }
        } else {
            Alert.alert(
                "Delete Campaign",
                "Are you sure you want to delete this campaign? This action cannot be undone.",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => deleteCampaign(id),
                    },
                ]
            );
        }
    };

    const deleteCampaign = async (id) => {
        try {
            setLoading(true);
            const response = await campaignAPI.deleteCampaign(id);
            if (response.data.success) {
                // Show success message
                showDialog("Success", "Campaign deleted successfully");
                // Refresh the campaign list
                loadCampaigns();
            } else {
                showDialog(
                    "Error",
                    response.data.message || "Failed to delete campaign"
                );
            }
        } catch (error) {
            console.error("Error deleting campaign:", error);
            showDialog(
                "Error",
                error.response?.data?.message ||
                    "Failed to delete campaign. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "ACTIVE":
                return "#4CAF50";
            case "PAUSED":
                return "#FF9800";
            case "DRAFT":
                return "#9E9E9E";
            case "COMPLETED":
                return "#2196F3";
            case "ARCHIVED":
                return "#757575";
            default:
                return "#9E9E9E";
        }
    };

    const renderCampaignItem = ({ item }) => {
        // Calculate total metrics across all platforms
        let totalImpressions = 0;
        let totalClicks = 0;
        let totalSpend = 0;

        item.platforms.forEach((platform) => {
            totalImpressions += platform.metrics?.impressions || 0;
            totalClicks += platform.metrics?.clicks || 0;
            totalSpend += platform.metrics?.spend || 0;
        });

        return (
            <Card
                style={styles.campaignCard}
                onPress={() =>
                    navigation.navigate({
                        name: "CampaignDetail",
                        params: { id: item._id },
                    })
                }
            >
                <Card.Content>
                    <View style={styles.campaignHeader}>
                        <Title style={styles.campaignTitle}>{item.name}</Title>
                        <Chip
                            style={{
                                backgroundColor: getStatusColor(item.status),
                            }}
                            textStyle={{ color: "white" }}
                        >
                            {item.status}
                        </Chip>
                    </View>

                    <Paragraph style={styles.campaignDescription}>
                        {item.description || "No description provided"}
                    </Paragraph>

                    <View style={styles.platformsContainer}>
                        {item.platforms.map((platform, index) => (
                            <Chip
                                key={index}
                                style={styles.platformChip}
                                mode="outlined"
                            >
                                {platform.platform}
                            </Chip>
                        ))}
                    </View>

                    <View style={styles.metricsContainer}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>
                                {totalImpressions.toLocaleString()}
                            </Text>
                            <Text style={styles.metricLabel}>Impressions</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>
                                {totalClicks.toLocaleString()}
                            </Text>
                            <Text style={styles.metricLabel}>Clicks</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>
                                ${totalSpend.toFixed(2)}
                            </Text>
                            <Text style={styles.metricLabel}>Spend</Text>
                        </View>
                    </View>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                    <Button
                        onPress={() =>
                            navigation.navigate({
                                name: "CampaignDetail",
                                params: { id: item._id },
                            })
                        }
                    >
                        View Details
                    </Button>
                    <Button
                        mode="outlined"
                        textColor="#D32F2F"
                        style={styles.deleteButton}
                        onPress={() => handleDeleteCampaign(item._id)}
                    >
                        Delete
                    </Button>
                </Card.Actions>
            </Card>
        );
    };

    const renderEmptyList = () => {
        // Generate dummy campaigns if needed
        const dummyCampaigns = generateDummyCampaigns(3);

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No campaigns found</Text>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate("CampaignCreate")}
                    style={styles.createButton}
                >
                    Create Campaign
                </Button>

                <Text style={styles.orText}>or</Text>

                <Button
                    mode="outlined"
                    onPress={() => {
                        setShowDummyData(true);
                        setCampaigns(dummyCampaigns);
                        setFilteredCampaigns(dummyCampaigns);
                    }}
                    style={styles.dummyButton}
                >
                    Show Sample Campaigns
                </Button>
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading campaigns...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {showDummyData && (
                <Banner
                    visible={true}
                    actions={[
                        {
                            label: "Hide Samples",
                            onPress: () => {
                                setShowDummyData(false);
                                setCampaigns([]);
                                setFilteredCampaigns([]);
                            },
                        },
                    ]}
                    icon="information"
                >
                    Showing sample campaign data. These are not real campaigns.
                </Banner>
            )}

            <Searchbar
                placeholder="Search campaigns"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            <View style={styles.filtersContainer}>
                <Text style={styles.filtersLabel}>Filter by status:</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersScroll}
                >
                    <Chip
                        selected={statusFilter === null}
                        onPress={() => setStatusFilter(null)}
                        style={styles.filterChip}
                    >
                        All
                    </Chip>
                    {CAMPAIGN_STATUSES.map((status) => (
                        <Chip
                            key={status.value}
                            selected={statusFilter === status.value}
                            onPress={() => setStatusFilter(status.value)}
                            style={styles.filterChip}
                        >
                            {status.label}
                        </Chip>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredCampaigns}
                renderItem={renderCampaignItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmptyList}
                // Configure animations properly for all platforms
                {...getAnimationConfig()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        {...getAnimationConfig()}
                    />
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate("CampaignCreate")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
    },
    searchBar: {
        margin: 10,
        elevation: 2,
    },
    filtersContainer: {
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    filtersLabel: {
        marginBottom: 5,
        fontWeight: "bold",
    },
    filtersScroll: {
        flexDirection: "row",
    },
    filterChip: {
        marginRight: 8,
    },
    listContainer: {
        padding: 10,
        paddingBottom: 80, // Add padding for FAB
    },
    campaignCard: {
        marginBottom: 10,
        elevation: 2,
    },
    campaignHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    campaignTitle: {
        flex: 1,
        fontSize: 18,
    },
    campaignDescription: {
        marginBottom: 10,
        color: "#666",
    },
    platformsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10,
    },
    platformChip: {
        marginRight: 5,
        marginBottom: 5,
    },
    metricsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
        paddingTop: 10,
    },
    metricItem: {
        alignItems: "center",
        flex: 1,
    },
    metricValue: {
        fontWeight: "bold",
        fontSize: 16,
    },
    metricLabel: {
        fontSize: 12,
        color: "#666",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    orText: {
        fontSize: 14,
        color: "#666",
        marginVertical: 10,
    },
    createButton: {
        paddingHorizontal: 20,
    },
    dummyButton: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
    cardActions: {
        justifyContent: "space-between",
    },
    deleteButton: {
        borderColor: "#D32F2F",
    },
});

export default CampaignListScreen;
