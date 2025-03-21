import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import showDialog from "../../utils/showDialog";
import {
    Text,
    Card,
    Title,
    Paragraph,
    Button,
    Chip,
    ActivityIndicator,
    Divider,
    useTheme,
    IconButton,
    Menu,
} from "react-native-paper";
// Import the web-compatible chart components instead of the originals
import {
    WebCompatibleBarChart,
    WebCompatibleLineChart,
} from "../../components/WebCompatibleChart";
import { Dimensions } from "react-native";
import { campaignAPI, leadAPI } from "../../api/apiClient";
import { PLATFORMS, CAMPAIGN_STATUSES } from "../../config";

const screenWidth = Dimensions.get("window").width;

const CampaignDetailScreen = ({ route, navigation }) => {
    const { campaignId } = route.params;
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [campaign, setCampaign] = useState(null);
    const [leads, setLeads] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [syncingMetrics, setSyncingMetrics] = useState(false);
    const [syncingLeads, setSyncingLeads] = useState(false);

    // Chart data
    const [metricsData, setMetricsData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
                strokeWidth: 2,
            },
        ],
    });

    const [platformData, setPlatformData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                colors: [],
            },
        ],
    });

    const loadCampaignData = async () => {
        try {
            setLoading(true);

            // Get campaign details
            const campaignResponse = await campaignAPI.getCampaign(campaignId);
            const campaignData = campaignResponse.data.data;
            setCampaign(campaignData);

            // Get leads for this campaign
            const leadsResponse = await leadAPI.getLeads();
            const allLeads = leadsResponse.data.data;
            const campaignLeads = allLeads.filter(
                (lead) => lead.campaign === campaignId
            );
            setLeads(campaignLeads);

            // Prepare chart data
            prepareChartData(campaignData);
        } catch (error) {
            console.error("Error loading campaign data:", error);
            showDialog(
                "Error",
                "Failed to load campaign data. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const prepareChartData = (campaignData) => {
        if (
            !campaignData ||
            !campaignData.platforms ||
            campaignData.platforms.length === 0
        ) {
            return;
        }

        // Prepare platform comparison data
        const platformLabels = [];
        const platformImpressions = [];
        const platformColors = [];

        campaignData.platforms.forEach((platform) => {
            const platformInfo = PLATFORMS.find(
                (p) => p.id === platform.platform
            );
            platformLabels.push(
                platformInfo ? platformInfo.name : platform.platform
            );
            platformImpressions.push(platform.metrics?.impressions || 0);
            platformColors.push(platformInfo ? platformInfo.color : "#999999");
        });

        setPlatformData({
            labels: platformLabels,
            datasets: [
                {
                    data: platformImpressions,
                    colors: platformColors,
                },
            ],
        });

        // Prepare metrics over time data (this would be real data in a production app)
        // Here we're just generating random data for demonstration
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const impressionsData = days.map(() =>
            Math.floor(Math.random() * 1000)
        );

        setMetricsData({
            labels: days,
            datasets: [
                {
                    data: impressionsData,
                    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
                    strokeWidth: 2,
                },
            ],
        });
    };

    const syncCampaignMetrics = async () => {
        try {
            setSyncingMetrics(true);
            await campaignAPI.syncCampaignMetrics(campaignId);
            await loadCampaignData();
            showDialog("Success", "Campaign metrics synced successfully");
        } catch (error) {
            console.error("Error syncing campaign metrics:", error);
            showDialog(
                "Error",
                "Failed to sync campaign metrics. Please try again."
            );
        } finally {
            setSyncingMetrics(false);
        }
    };

    const syncCampaignLeads = async () => {
        try {
            setSyncingLeads(true);
            const response = await campaignAPI.syncCampaignLeads(campaignId);
            const { newLeadsCount } = response.data.data;
            await loadCampaignData();
            showDialog(
                "Success",
                `${newLeadsCount} new leads synced successfully`
            );
        } catch (error) {
            console.error("Error syncing campaign leads:", error);
            showDialog(
                "Error",
                "Failed to sync campaign leads. Please try again."
            );
        } finally {
            setSyncingLeads(false);
        }
    };

    const handleEditCampaign = () => {
        setMenuVisible(false);
        navigation.navigate("CampaignCreate", { campaignId });
    };

    const handleDeleteCampaign = () => {
        setMenuVisible(false);
        showDialog(
            "Delete Campaign",
            "Are you sure you want to delete this campaign? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await campaignAPI.deleteCampaign(campaignId);
                            showDialog(
                                "Success",
                                "Campaign deleted successfully"
                            );
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error deleting campaign:", error);
                            showDialog(
                                "Error",
                                "Failed to delete campaign. Please try again."
                            );
                        }
                    },
                },
            ]
        );
    };

    const toggleCampaignStatus = async () => {
        if (!campaign) return;

        const newStatus = campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE";

        try {
            await campaignAPI.updateCampaign(campaignId, { status: newStatus });
            await loadCampaignData();
            showDialog(
                "Success",
                `Campaign ${newStatus.toLowerCase()} successfully`
            );
        } catch (error) {
            console.error("Error updating campaign status:", error);
            showDialog(
                "Error",
                "Failed to update campaign status. Please try again."
            );
        }
    };

    useEffect(() => {
        loadCampaignData();

        // Set up navigation options
        navigation.setOptions({
            title: "Campaign Details",
            headerRight: () => (
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <IconButton
                            icon="dots-vertical"
                            onPress={() => setMenuVisible(true)}
                        />
                    }
                >
                    <Menu.Item
                        onPress={handleEditCampaign}
                        title="Edit Campaign"
                    />
                    <Menu.Item
                        onPress={handleDeleteCampaign}
                        title="Delete Campaign"
                    />
                </Menu>
            ),
        });
    }, [campaignId, menuVisible]);

    const onRefresh = () => {
        setRefreshing(true);
        loadCampaignData();
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

    const getStatusLabel = (status) => {
        const statusObj = CAMPAIGN_STATUSES.find((s) => s.value === status);
        return statusObj ? statusObj.label : status;
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>
                    Loading campaign details...
                </Text>
            </View>
        );
    }

    if (!campaign) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Campaign not found</Text>
                <Button mode="contained" onPress={() => navigation.goBack()}>
                    Go Back
                </Button>
            </View>
        );
    }

    // Calculate total metrics across all platforms
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    let totalSpend = 0;

    campaign.platforms.forEach((platform) => {
        totalImpressions += platform.metrics?.impressions || 0;
        totalClicks += platform.metrics?.clicks || 0;
        totalConversions += platform.metrics?.conversions || 0;
        totalSpend += platform.metrics?.spend || 0;
    });

    const ctr =
        totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate =
        totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Card style={styles.headerCard}>
                <Card.Content>
                    <View style={styles.campaignHeader}>
                        <Title style={styles.campaignTitle}>
                            {campaign.name}
                        </Title>
                        <Chip
                            style={{
                                backgroundColor: getStatusColor(
                                    campaign.status
                                ),
                            }}
                            textStyle={{ color: "white" }}
                        >
                            {getStatusLabel(campaign.status)}
                        </Chip>
                    </View>

                    <Paragraph style={styles.campaignDescription}>
                        {campaign.description || "No description provided"}
                    </Paragraph>

                    <View style={styles.dateContainer}>
                        <Text style={styles.dateLabel}>Start Date:</Text>
                        <Text style={styles.dateValue}>
                            {new Date(campaign.startDate).toLocaleDateString()}
                        </Text>
                        {campaign.endDate && (
                            <>
                                <Text style={styles.dateLabel}>End Date:</Text>
                                <Text style={styles.dateValue}>
                                    {new Date(
                                        campaign.endDate
                                    ).toLocaleDateString()}
                                </Text>
                            </>
                        )}
                    </View>

                    <View style={styles.budgetContainer}>
                        <Text style={styles.budgetLabel}>Daily Budget:</Text>
                        <Text style={styles.budgetValue}>
                            ${campaign.budget.daily} {campaign.budget.currency}
                        </Text>
                        {campaign.budget.lifetime > 0 && (
                            <>
                                <Text style={styles.budgetLabel}>
                                    Lifetime Budget:
                                </Text>
                                <Text style={styles.budgetValue}>
                                    ${campaign.budget.lifetime}{" "}
                                    {campaign.budget.currency}
                                </Text>
                            </>
                        )}
                    </View>

                    <View style={styles.objectiveContainer}>
                        <Text style={styles.objectiveLabel}>Objective:</Text>
                        <Chip mode="outlined">{campaign.objective}</Chip>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button
                        mode={
                            campaign.status === "ACTIVE"
                                ? "outlined"
                                : "contained"
                        }
                        onPress={toggleCampaignStatus}
                    >
                        {campaign.status === "ACTIVE"
                            ? "Pause Campaign"
                            : "Activate Campaign"}
                    </Button>
                </Card.Actions>
            </Card>

            <Card style={styles.metricsCard}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>
                        Campaign Performance
                    </Title>

                    <View style={styles.metricsGrid}>
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
                                {ctr.toFixed(2)}%
                            </Text>
                            <Text style={styles.metricLabel}>CTR</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>
                                {totalConversions.toLocaleString()}
                            </Text>
                            <Text style={styles.metricLabel}>Conversions</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>
                                {conversionRate.toFixed(2)}%
                            </Text>
                            <Text style={styles.metricLabel}>Conv. Rate</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>
                                ${totalSpend.toFixed(2)}
                            </Text>
                            <Text style={styles.metricLabel}>Total Spend</Text>
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    <Title style={styles.chartTitle}>
                        Impressions Over Time
                    </Title>
                    <LineChart
                        data={metricsData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            // Use appropriate animation driver based on platform
                            useNativeDriver: shouldUseNativeDriver(),
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) =>
                                `rgba(25, 118, 210, ${opacity})`,
                            labelColor: (opacity = 1) =>
                                `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: theme.colors.primary,
                            },
                        }}
                        bezier
                        style={styles.chart}
                    />

                    <Divider style={styles.divider} />

                    <Title style={styles.chartTitle}>Platform Comparison</Title>
                    <BarChart
                        data={platformData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            // Use appropriate animation driver based on platform
                            useNativeDriver: shouldUseNativeDriver(),
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) =>
                                `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                        }}
                        style={styles.chart}
                        fromZero
                    />
                </Card.Content>
                <Card.Actions>
                    <Button
                        onPress={syncCampaignMetrics}
                        loading={syncingMetrics}
                        disabled={syncingMetrics}
                    >
                        Sync Metrics
                    </Button>
                </Card.Actions>
            </Card>

            <Card style={styles.platformsCard}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Platforms</Title>

                    {campaign.platforms.map((platform, index) => {
                        const platformInfo = PLATFORMS.find(
                            (p) => p.id === platform.platform
                        );
                        return (
                            <View key={index} style={styles.platformItem}>
                                <View
                                    style={[
                                        styles.platformIcon,
                                        {
                                            backgroundColor: platformInfo
                                                ? platformInfo.color
                                                : "#999999",
                                        },
                                    ]}
                                >
                                    <Text style={styles.platformIconText}>
                                        {platformInfo
                                            ? platformInfo.name.charAt(0)
                                            : platform.platform.charAt(0)}
                                    </Text>
                                </View>
                                <View style={styles.platformInfo}>
                                    <Text style={styles.platformName}>
                                        {platformInfo
                                            ? platformInfo.name
                                            : platform.platform}
                                    </Text>
                                    <Text style={styles.platformStatus}>
                                        Status:{" "}
                                        <Text
                                            style={{
                                                color: getStatusColor(
                                                    platform.status
                                                ),
                                            }}
                                        >
                                            {platform.status}
                                        </Text>
                                    </Text>
                                </View>
                                <View style={styles.platformMetrics}>
                                    <Text style={styles.platformMetricValue}>
                                        {platform.metrics?.impressions?.toLocaleString() ||
                                            0}
                                    </Text>
                                    <Text style={styles.platformMetricLabel}>
                                        Impressions
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </Card.Content>
            </Card>

            <Card style={styles.leadsCard}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>
                        Leads ({leads.length})
                    </Title>

                    {leads.length === 0 ? (
                        <Text style={styles.noLeadsText}>
                            No leads found for this campaign
                        </Text>
                    ) : (
                        leads.slice(0, 5).map((lead, index) => (
                            <View key={index} style={styles.leadItem}>
                                <View style={styles.leadInfo}>
                                    <Text style={styles.leadName}>
                                        {lead.firstName} {lead.lastName}
                                    </Text>
                                    <Text style={styles.leadEmail}>
                                        {lead.email}
                                    </Text>
                                </View>
                                <Chip style={styles.leadSource} size="small">
                                    {lead.source.platform}
                                </Chip>
                            </View>
                        ))
                    )}

                    {leads.length > 5 && (
                        <Text style={styles.moreLeadsText}>
                            + {leads.length - 5} more leads
                        </Text>
                    )}
                </Card.Content>
                <Card.Actions>
                    <Button
                        onPress={syncCampaignLeads}
                        loading={syncingLeads}
                        disabled={syncingLeads}
                    >
                        Sync Leads
                    </Button>
                    <Button
                        onPress={() =>
                            navigation.navigate("Leads", {
                                screen: "LeadList",
                                params: { campaignId },
                            })
                        }
                    >
                        View All Leads
                    </Button>
                </Card.Actions>
            </Card>

            <View style={styles.footer} />
        </ScrollView>
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
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        marginBottom: 20,
    },
    headerCard: {
        margin: 10,
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
        fontSize: 20,
    },
    campaignDescription: {
        marginBottom: 15,
        color: "#666",
    },
    dateContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10,
    },
    dateLabel: {
        fontWeight: "bold",
        marginRight: 5,
        width: "30%",
    },
    dateValue: {
        width: "65%",
        marginBottom: 5,
    },
    budgetContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10,
    },
    budgetLabel: {
        fontWeight: "bold",
        marginRight: 5,
        width: "30%",
    },
    budgetValue: {
        width: "65%",
        marginBottom: 5,
    },
    objectiveContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    objectiveLabel: {
        fontWeight: "bold",
        marginRight: 10,
    },
    metricsCard: {
        margin: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 15,
    },
    metricsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    metricItem: {
        width: "30%",
        alignItems: "center",
        marginBottom: 15,
    },
    metricValue: {
        fontWeight: "bold",
        fontSize: 16,
    },
    metricLabel: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },
    divider: {
        marginVertical: 15,
    },
    chartTitle: {
        fontSize: 16,
        marginBottom: 10,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    platformsCard: {
        margin: 10,
        elevation: 2,
    },
    platformItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    platformIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    platformIconText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
    platformInfo: {
        flex: 1,
    },
    platformName: {
        fontWeight: "bold",
        marginBottom: 3,
    },
    platformStatus: {
        fontSize: 12,
    },
    platformMetrics: {
        alignItems: "center",
    },
    platformMetricValue: {
        fontWeight: "bold",
    },
    platformMetricLabel: {
        fontSize: 10,
        color: "#666",
    },
    leadsCard: {
        margin: 10,
        elevation: 2,
    },
    noLeadsText: {
        textAlign: "center",
        marginVertical: 20,
        color: "#666",
    },
    leadItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    leadInfo: {
        flex: 1,
    },
    leadName: {
        fontWeight: "bold",
        marginBottom: 3,
    },
    leadEmail: {
        fontSize: 12,
        color: "#666",
    },
    leadSource: {
        marginLeft: 10,
    },
    moreLeadsText: {
        textAlign: "center",
        marginTop: 10,
        color: "#666",
        fontStyle: "italic",
    },
    footer: {
        height: 20,
    },
});

export default CampaignDetailScreen;
