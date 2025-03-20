import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import {
    Text,
    Card,
    Title,
    Paragraph,
    Button,
    useTheme,
    ActivityIndicator,
} from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { campaignAPI, leadAPI, platformAPI } from "../api/apiClient";
import { PLATFORMS } from "../config";

const screenWidth = Dimensions.get("window").width;

const DashboardScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [leads, setLeads] = useState([]);
    const [connectedPlatforms, setConnectedPlatforms] = useState({});
    const [stats, setStats] = useState({
        activeCampaigns: 0,
        totalLeads: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalSpend: 0,
    });

    // Chart data
    const [chartData, setChartData] = useState({
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 0],
                color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
                strokeWidth: 2,
            },
        ],
    });

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Get campaigns
            const campaignsResponse = await campaignAPI.getCampaigns();
            const campaignsData = campaignsResponse.data.data;
            setCampaigns(campaignsData);

            // Get leads
            const leadsResponse = await leadAPI.getLeads();
            const leadsData = leadsResponse.data.data;
            setLeads(leadsData);

            // Get connected platforms
            const platformsResponse = await platformAPI.getConnectedPlatforms();
            const platformsData = platformsResponse.data.data;
            setConnectedPlatforms(platformsData);

            // Calculate stats
            const activeCampaigns = campaignsData.filter(
                (c) => c.status === "ACTIVE"
            ).length;
            const totalLeads = leadsData.length;

            let totalImpressions = 0;
            let totalClicks = 0;
            let totalSpend = 0;

            // Calculate totals from all campaigns
            campaignsData.forEach((campaign) => {
                campaign.platforms.forEach((platform) => {
                    totalImpressions += platform.metrics?.impressions || 0;
                    totalClicks += platform.metrics?.clicks || 0;
                    totalSpend += platform.metrics?.spend || 0;
                });
            });

            setStats({
                activeCampaigns,
                totalLeads,
                totalImpressions,
                totalClicks,
                totalSpend,
            });

            // Generate chart data (this would be real data in a production app)
            // Here we're just generating random data for demonstration
            const leadsByDay = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ];

            setChartData({
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                    {
                        data: leadsByDay,
                        color: (opacity = 1) =>
                            `rgba(25, 118, 210, ${opacity})`,
                        strokeWidth: 2,
                    },
                ],
            });
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadDashboardData();
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading dashboard...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                <Title style={styles.headerTitle}>Welcome, {user?.name}</Title>
                <Paragraph style={styles.headerSubtitle}>
                    Here's your campaign overview
                </Paragraph>
            </View>

            <View style={styles.statsContainer}>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Title style={styles.statValue}>
                            {stats.activeCampaigns}
                        </Title>
                        <Paragraph style={styles.statLabel}>
                            Active Campaigns
                        </Paragraph>
                    </Card.Content>
                </Card>

                <Card style={styles.statCard}>
                    <Card.Content>
                        <Title style={styles.statValue}>
                            {stats.totalLeads}
                        </Title>
                        <Paragraph style={styles.statLabel}>
                            Total Leads
                        </Paragraph>
                    </Card.Content>
                </Card>

                <Card style={styles.statCard}>
                    <Card.Content>
                        <Title style={styles.statValue}>
                            ${stats.totalSpend.toFixed(2)}
                        </Title>
                        <Paragraph style={styles.statLabel}>
                            Total Spend
                        </Paragraph>
                    </Card.Content>
                </Card>
            </View>

            <Card style={styles.chartCard}>
                <Card.Content>
                    <Title style={styles.chartTitle}>Leads This Week</Title>
                    <LineChart
                        data={chartData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
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
                </Card.Content>
            </Card>

            <Card style={styles.platformsCard}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>
                        Connected Platforms
                    </Title>
                    <View style={styles.platformsList}>
                        {PLATFORMS.map((platform) => (
                            <View key={platform.id} style={styles.platformItem}>
                                <View
                                    style={[
                                        styles.platformIcon,
                                        { backgroundColor: platform.color },
                                    ]}
                                >
                                    <Text style={styles.platformIconText}>
                                        {platform.name.charAt(0)}
                                    </Text>
                                </View>
                                <Text style={styles.platformName}>
                                    {platform.name}
                                </Text>
                                <View
                                    style={[
                                        styles.connectionStatus,
                                        {
                                            backgroundColor: connectedPlatforms[
                                                platform.id.toLowerCase()
                                            ]
                                                ? "#4CAF50"
                                                : "#9E9E9E",
                                        },
                                    ]}
                                >
                                    <Text style={styles.connectionStatusText}>
                                        {connectedPlatforms[
                                            platform.id.toLowerCase()
                                        ]
                                            ? "Connected"
                                            : "Not Connected"}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={() => navigation.navigate("Platforms")}>
                        Manage Connections
                    </Button>
                </Card.Actions>
            </Card>

            <Card style={styles.actionsCard}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Quick Actions</Title>
                </Card.Content>
                <Card.Actions style={styles.actionsContainer}>
                    <Button
                        mode="contained"
                        onPress={() =>
                            navigation.navigate("Campaigns", {
                                screen: "CampaignCreate",
                            })
                        }
                        style={styles.actionButton}
                    >
                        Create Campaign
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() =>
                            navigation.navigate("Campaigns", {
                                screen: "CampaignList",
                            })
                        }
                        style={styles.actionButton}
                    >
                        View Campaigns
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() =>
                            navigation.navigate("Leads", { screen: "LeadList" })
                        }
                        style={styles.actionButton}
                    >
                        View Leads
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
    header: {
        padding: 20,
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#666",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 5,
        elevation: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    statLabel: {
        textAlign: "center",
        fontSize: 12,
    },
    chartCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    platformsCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    platformsList: {
        marginTop: 10,
    },
    platformItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    platformIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    platformIconText: {
        color: "white",
        fontWeight: "bold",
    },
    platformName: {
        flex: 1,
    },
    connectionStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    connectionStatusText: {
        color: "white",
        fontSize: 12,
    },
    actionsCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
    },
    actionsContainer: {
        flexDirection: "column",
        alignItems: "stretch",
    },
    actionButton: {
        marginVertical: 5,
    },
    footer: {
        height: 20,
    },
});

export default DashboardScreen;
