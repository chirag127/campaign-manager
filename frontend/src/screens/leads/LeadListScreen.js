import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    ScrollView,
} from "react-native";
import { getAnimationConfig } from "../../utils/animationUtils";
import {
    Text,
    Card,
    Title,
    Paragraph,
    Button,
    Chip,
    ActivityIndicator,
    Searchbar,
    useTheme,
    Menu,
    Divider,
    Banner,
} from "react-native-paper";
import { leadAPI, campaignAPI } from "../../api/apiClient";
import { LEAD_STATUSES } from "../../config";
import {
    generateDummyLeads,
    generateDummyCampaigns,
} from "../../utils/dummyData";

const LeadListScreen = ({ route, navigation }) => {
    const { campaignId } = route.params || {};
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    const [campaignFilter, setCampaignFilter] = useState(campaignId || null);
    const [campaignMenuVisible, setCampaignMenuVisible] = useState(false);
    const [showDummyData, setShowDummyData] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);

            // Get all leads
            const leadsResponse = await leadAPI.getLeads();
            const leadsData = leadsResponse.data.data;
            setLeads(leadsData);

            // Get all campaigns for filtering
            const campaignsResponse = await campaignAPI.getCampaigns();
            const campaignsData = campaignsResponse.data.data;
            setCampaigns(campaignsData);
        } catch (error) {
            console.error("Error loading leads:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        // Apply filters when leads, search query, status filter, or campaign filter changes
        let filtered = [...leads];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (lead) =>
                    `${lead.firstName} ${lead.lastName}`
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter((lead) => lead.status === statusFilter);
        }

        // Apply campaign filter
        if (campaignFilter) {
            filtered = filtered.filter(
                (lead) => lead.campaign === campaignFilter
            );
        }

        setFilteredLeads(filtered);
    }, [leads, searchQuery, statusFilter, campaignFilter]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "NEW":
                return "#2196F3";
            case "CONTACTED":
                return "#FF9800";
            case "QUALIFIED":
                return "#4CAF50";
            case "CONVERTED":
                return "#8BC34A";
            case "DISQUALIFIED":
                return "#F44336";
            default:
                return "#9E9E9E";
        }
    };

    const getStatusLabel = (status) => {
        const statusObj = LEAD_STATUSES.find((s) => s.value === status);
        return statusObj ? statusObj.label : status;
    };

    const getCampaignName = (campaignId) => {
        const campaign = campaigns.find((c) => c._id === campaignId);
        return campaign ? campaign.name : "Unknown Campaign";
    };

    const renderLeadItem = ({ item }) => (
        <Card
            style={styles.leadCard}
            onPress={() =>
                navigation.navigate("LeadDetail", { leadId: item._id })
            }
        >
            <Card.Content>
                <View style={styles.leadHeader}>
                    <Title style={styles.leadName}>
                        {item.firstName} {item.lastName}
                    </Title>
                    <Chip
                        style={{ backgroundColor: getStatusColor(item.status) }}
                        textStyle={{ color: "white" }}
                    >
                        {getStatusLabel(item.status)}
                    </Chip>
                </View>

                <Paragraph style={styles.leadEmail}>{item.email}</Paragraph>
                {item.phone && (
                    <Paragraph style={styles.leadPhone}>{item.phone}</Paragraph>
                )}

                <Divider style={styles.divider} />

                <View style={styles.leadDetails}>
                    <View style={styles.leadDetailItem}>
                        <Text style={styles.leadDetailLabel}>Source:</Text>
                        <Chip size="small" style={styles.sourceChip}>
                            {item.source.platform}
                        </Chip>
                    </View>

                    <View style={styles.leadDetailItem}>
                        <Text style={styles.leadDetailLabel}>Campaign:</Text>
                        <Text style={styles.leadDetailValue}>
                            {getCampaignName(item.campaign)}
                        </Text>
                    </View>

                    <View style={styles.leadDetailItem}>
                        <Text style={styles.leadDetailLabel}>Created:</Text>
                        <Text style={styles.leadDetailValue}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </Card.Content>
            <Card.Actions>
                <Button
                    onPress={() =>
                        navigation.navigate("LeadDetail", { leadId: item._id })
                    }
                >
                    View Details
                </Button>
            </Card.Actions>
        </Card>
    );

    const renderEmptyList = () => {
        // Generate dummy data if needed
        const dummyCampaigns = generateDummyCampaigns(2);
        const dummyLeads = generateDummyLeads(
            5,
            campaignFilter ||
                (dummyCampaigns.length > 0 ? dummyCampaigns[0]._id : null)
        );

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No leads found</Text>
                {campaignFilter && (
                    <Button
                        mode="contained"
                        onPress={() => setCampaignFilter(null)}
                        style={styles.clearFilterButton}
                    >
                        Clear Campaign Filter
                    </Button>
                )}

                <Text style={styles.orText}>or</Text>

                <Button
                    mode="outlined"
                    onPress={() => {
                        setShowDummyData(true);
                        // If we don't have campaigns yet, add the dummy ones
                        if (campaigns.length === 0) {
                            setCampaigns(dummyCampaigns);
                        }
                        setLeads(dummyLeads);
                        setFilteredLeads(dummyLeads);
                    }}
                    style={styles.dummyButton}
                >
                    Show Sample Leads
                </Button>
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading leads...</Text>
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
                                setLeads([]);
                                setFilteredLeads([]);
                                // Only clear campaigns if they were dummy ones
                                if (
                                    campaigns.some((c) =>
                                        c._id.startsWith("sample-")
                                    )
                                ) {
                                    setCampaigns([]);
                                }
                            },
                        },
                    ]}
                    icon="information"
                >
                    Showing sample lead data. These are not real leads.
                </Banner>
            )}

            <Searchbar
                placeholder="Search leads"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            <View style={styles.filtersContainer}>
                <View style={styles.filterRow}>
                    <Text style={styles.filtersLabel}>Status:</Text>
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
                        {LEAD_STATUSES.map((status) => (
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

                <View style={styles.filterRow}>
                    <Text style={styles.filtersLabel}>Campaign:</Text>
                    <Menu
                        visible={campaignMenuVisible}
                        onDismiss={() => setCampaignMenuVisible(false)}
                        anchor={
                            <Button
                                mode="outlined"
                                onPress={() => setCampaignMenuVisible(true)}
                                style={styles.campaignFilterButton}
                            >
                                {campaignFilter
                                    ? getCampaignName(campaignFilter)
                                    : "All Campaigns"}
                            </Button>
                        }
                    >
                        <Menu.Item
                            onPress={() => {
                                setCampaignFilter(null);
                                setCampaignMenuVisible(false);
                            }}
                            title="All Campaigns"
                        />
                        <Divider />
                        {campaigns.map((campaign) => (
                            <Menu.Item
                                key={campaign._id}
                                onPress={() => {
                                    setCampaignFilter(campaign._id);
                                    setCampaignMenuVisible(false);
                                }}
                                title={campaign.name}
                            />
                        ))}
                    </Menu>
                </View>
            </View>

            <FlatList
                data={filteredLeads}
                renderItem={renderLeadItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmptyList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
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
    filterRow: {
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
    campaignFilterButton: {
        width: "100%",
        justifyContent: "flex-start",
    },
    listContainer: {
        padding: 10,
    },
    leadCard: {
        marginBottom: 10,
        elevation: 2,
    },
    leadHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    leadName: {
        flex: 1,
        fontSize: 18,
    },
    leadEmail: {
        marginBottom: 3,
    },
    leadPhone: {
        marginBottom: 5,
    },
    divider: {
        marginVertical: 10,
    },
    leadDetails: {
        marginTop: 5,
    },
    leadDetailItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    leadDetailLabel: {
        fontWeight: "bold",
        marginRight: 5,
        width: 80,
    },
    leadDetailValue: {
        flex: 1,
    },
    sourceChip: {
        height: 24,
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
    clearFilterButton: {
        paddingHorizontal: 20,
    },
    orText: {
        fontSize: 14,
        color: "#666",
        marginVertical: 10,
    },
    dummyButton: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
});

export default LeadListScreen;
