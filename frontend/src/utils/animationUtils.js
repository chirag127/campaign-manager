import { Platform } from "react-native";

/**
 * Helper function to determine if useNativeDriver should be used
 * This helps avoid warnings on web platform where native driver isn't available
 *
 * @returns {boolean} Whether to use native driver for animations
 */
export const shouldUseNativeDriver = () => {
    // Only use native driver on iOS and Android, not on web
    return Platform.OS !== "web";
};

/**
 * Get animation config with appropriate useNativeDriver setting
 *
 * @param {Object} config - Animation configuration
 * @returns {Object} Animation configuration with proper useNativeDriver setting
 */
export const getAnimationConfig = (config = {}) => {
    return {
        ...config,
        useNativeDriver: shouldUseNativeDriver(),
    };
};

/**
 * Default animation configurations for common animations
 */
export const AnimationPresets = {
    fade: {
        opacity: {
            from: 0,
            to: 1,
            duration: 300,
            useNativeDriver: shouldUseNativeDriver(),
        },
    },
    slide: {
        translateX: {
            from: 100,
            to: 0,
            duration: 300,
            useNativeDriver: shouldUseNativeDriver(),
        },
    },
    scale: {
        scale: {
            from: 0.8,
            to: 1,
            duration: 300,
            useNativeDriver: shouldUseNativeDriver(),
        },
    },
};
