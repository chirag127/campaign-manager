import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
    Menu,
    IconButton,
} from "react-native-paper";
import { leadAPI, campaignAPI } from "../../api/apiClient";
import { LEAD_STATUSES } from "../../config";

const LeadDetailScreen = ({ route, navigation }) => {
    const { leadId } = route.params;
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [lead, setLead] = useState(null);
    const [campaign, setCampaign] = useState(null);
    const [statusMenuVisible, setStatusMenuVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const loadLeadData = async () => {
        try {
            setLoading(true);

            // Get lead details
            const leadResponse = await leadAPI.getLead(leadId);
            const leadData = leadResponse.data.data;
            setLead(leadData);

            // Get campaign details
            const campaignResponse = await campaignAPI.getCampaign(
                leadData.campaign
            );
            const campaignData = campaignResponse.data.data;
            setCampaign(campaignData);
        } catch (error) {
            console.error("Error loading lead data:", error);
            showDialog("Error", "Failed to load lead data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeadData();

        // Set up navigation options
        navigation.setOptions({
            title: "Lead Details",
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
                    <Menu.Item onPress={handleDeleteLead} title="Delete Lead" />
                </Menu>
            ),
        });
    }, [leadId, menuVisible]);

    const handleUpdateStatus = async (newStatus) => {
        try {
            await leadAPI.updateLead(leadId, { status: newStatus });
            setStatusMenuVisible(false);
            await loadLeadData();
            showDialog("Success", "Lead status updated successfully");
        } catch (error) {
            console.error("Error updating lead status:", error);
            showDialog(
                "Error",
                "Failed to update lead status. Please try again."
            );
        }
    };

    const handleDeleteLead = () => {
        setMenuVisible(false);
        showDialog(
            "Delete Lead",
            "Are you sure you want to delete this lead? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await leadAPI.deleteLead(leadId);
                            showDialog("Success", "Lead deleted successfully");
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error deleting lead:", error);
                            showDialog(
                                "Error",
                                "Failed to delete lead. Please try again."
                            );
                        }
                    },
                },
            ]
        );
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading lead details...</Text>
            </View>
        );
    }

    if (!lead) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Lead not found</Text>
                <Button mode="contained" onPress={() => navigation.goBack()}>
                    Go Back
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.leadCard}>
                <Card.Content>
                    <View style={styles.leadHeader}>
                        <Title style={styles.leadName}>
                            {lead.firstName} {lead.lastName}
                        </Title>
                        <Menu
                            visible={statusMenuVisible}
                            onDismiss={() => setStatusMenuVisible(false)}
                            anchor={
                                <Chip
                                    style={{
                                        backgroundColor: getStatusColor(
                                            lead.status
                                        ),
                                    }}
                                    textStyle={{ color: "white" }}
                                    onPress={() => setStatusMenuVisible(true)}
                                >
                                    {getStatusLabel(lead.status)}
                                </Chip>
                            }
                        >
                            {LEAD_STATUSES.map((status) => (
                                <Menu.Item
                                    key={status.value}
                                    onPress={() =>
                                        handleUpdateStatus(status.value)
                                    }
                                    title={status.label}
                                />
                            ))}
                        </Menu>
                    </View>

                    <View style={styles.contactInfo}>
                        <View style={styles.contactItem}>
                            <Text style={styles.contactLabel}>Email:</Text>
                            <Text style={styles.contactValue}>
                                {lead.email}
                            </Text>
                        </View>

                        {lead.phone && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>Phone:</Text>
                                <Text style={styles.contactValue}>
                                    {lead.phone}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.sourceInfo}>
                        <Text style={styles.sectionTitle}>
                            Source Information
                        </Text>

                        <View style={styles.sourceItem}>
                            <Text style={styles.sourceLabel}>Platform:</Text>
                            <Chip style={styles.sourceChip}>
                                {lead.source.platform}
                            </Chip>
                        </View>

                        <View style={styles.sourceItem}>
                            <Text style={styles.sourceLabel}>Campaign:</Text>
                            <Text style={styles.sourceValue}>
                                {campaign?.name || "Unknown Campaign"}
                            </Text>
                        </View>

                        {lead.source.adId && (
                            <View style={styles.sourceItem}>
                                <Text style={styles.sourceLabel}>Ad ID:</Text>
                                <Text style={styles.sourceValue}>
                                    {lead.source.adId}
                                </Text>
                            </View>
                        )}

                        <View style={styles.sourceItem}>
                            <Text style={styles.sourceLabel}>Created:</Text>
                            <Text style={styles.sourceValue}>
                                {new Date(lead.createdAt).toLocaleString()}
                            </Text>
                        </View>
                    </View>

                    {lead.additionalInfo && lead.additionalInfo.size > 0 && (
                        <>
                            <Divider style={styles.divider} />

                            <View style={styles.additionalInfo}>
                                <Text style={styles.sectionTitle}>
                                    Additional Information
                                </Text>

                                {Array.from(lead.additionalInfo.entries()).map(
                                    ([key, value], index) => (
                                        <View
                                            key={index}
                                            style={styles.additionalItem}
                                        >
                                            <Text
                                                style={styles.additionalLabel}
                                            >
                                                {key}:
                                            </Text>
                                            <Text
                                                style={styles.additionalValue}
                                            >
                                                {value}
                                            </Text>
                                        </View>
                                    )
                                )}
                            </View>
                        </>
                    )}
                </Card.Content>
                <Card.Actions>
                    <Button
                        icon="email"
                        onPress={() =>
                            showDialog("Contact", `Send email to ${lead.email}`)
                        }
                    >
                        Email
                    </Button>
                    {lead.phone && (
                        <Button
                            icon="phone"
                            onPress={() =>
                                showDialog("Contact", `Call ${lead.phone}`)
                            }
                        >
                            Call
                        </Button>
                    )}
                    <Button
                        icon="file-document"
                        onPress={() =>
                            showDialog(
                                "Notes",
                                "Add notes functionality would be implemented here"
                            )
                        }
                    >
                        Add Notes
                    </Button>
                </Card.Actions>
            </Card>

            <Card style={styles.campaignCard}>
                <Card.Content>
                    <Text style={styles.sectionTitle}>Campaign Details</Text>

                    {campaign ? (
                        <>
                            <Title style={styles.campaignTitle}>
                                {campaign.name}
                            </Title>
                            <Paragraph style={styles.campaignDescription}>
                                {campaign.description ||
                                    "No description provided"}
                            </Paragraph>

                            <View style={styles.campaignDetails}>
                                <View style={styles.campaignDetailItem}>
                                    <Text style={styles.campaignDetailLabel}>
                                        Status:
                                    </Text>
                                    <Chip size="small">{campaign.status}</Chip>
                                </View>

                                <View style={styles.campaignDetailItem}>
                                    <Text style={styles.campaignDetailLabel}>
                                        Objective:
                                    </Text>
                                    <Text style={styles.campaignDetailValue}>
                                        {campaign.objective}
                                    </Text>
                                </View>

                                <View style={styles.campaignDetailItem}>
                                    <Text style={styles.campaignDetailLabel}>
                                        Start Date:
                                    </Text>
                                    <Text style={styles.campaignDetailValue}>
                                        {new Date(
                                            campaign.startDate
                                        ).toLocaleDateString()}
                                    </Text>
                                </View>

                                {campaign.endDate && (
                                    <View style={styles.campaignDetailItem}>
                                        <Text
                                            style={styles.campaignDetailLabel}
                                        >
                                            End Date:
                                        </Text>
                                        <Text
                                            style={styles.campaignDetailValue}
                                        >
                                            {new Date(
                                                campaign.endDate
                                            ).toLocaleDateString()}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </>
                    ) : (
                        <Text style={styles.noCampaignText}>
                            Campaign information not available
                        </Text>
                    )}
                </Card.Content>
                {campaign && (
                    <Card.Actions>
                        <Button
                            onPress={() =>
                                navigation.navigate("Campaigns", {
                                    screen: "CampaignDetail",
                                    params: { id: campaign._id },
                                })
                            }
                        >
                            View Campaign
                        </Button>
                    </Card.Actions>
                )}
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
    leadCard: {
        margin: 10,
        elevation: 2,
    },
    leadHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    leadName: {
        flex: 1,
        fontSize: 20,
    },
    contactInfo: {
        marginBottom: 10,
    },
    contactItem: {
        flexDirection: "row",
        marginBottom: 5,
    },
    contactLabel: {
        fontWeight: "bold",
        width: 60,
    },
    contactValue: {
        flex: 1,
    },
    divider: {
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    sourceInfo: {
        marginBottom: 10,
    },
    sourceItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    sourceLabel: {
        fontWeight: "bold",
        width: 80,
    },
    sourceValue: {
        flex: 1,
    },
    sourceChip: {
        height: 30,
    },
    additionalInfo: {
        marginBottom: 10,
    },
    additionalItem: {
        flexDirection: "row",
        marginBottom: 8,
    },
    additionalLabel: {
        fontWeight: "bold",
        width: 120,
    },
    additionalValue: {
        flex: 1,
    },
    campaignCard: {
        margin: 10,
        elevation: 2,
    },
    campaignTitle: {
        fontSize: 18,
        marginBottom: 5,
    },
    campaignDescription: {
        marginBottom: 10,
        color: "#666",
    },
    campaignDetails: {
        marginTop: 5,
    },
    campaignDetailItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    campaignDetailLabel: {
        fontWeight: "bold",
        width: 80,
    },
    campaignDetailValue: {
        flex: 1,
    },
    noCampaignText: {
        fontStyle: "italic",
        color: "#666",
        textAlign: "center",
        marginVertical: 20,
    },
    footer: {
        height: 20,
    },
});

export default LeadDetailScreen;
