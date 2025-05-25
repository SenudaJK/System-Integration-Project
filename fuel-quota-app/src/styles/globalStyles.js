import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { fonts, fontSizes } from "./fonts";

export const globalStyles = StyleSheet.create({
    // Container styles
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    safeContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },

    // Card styles
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.bold,
        color: colors.text,
        marginBottom: 8,
    },

    // Text styles
    heading1: {
        fontSize: fontSizes.huge,
        fontFamily: fonts.bold,
        color: colors.text,
        marginBottom: 16,
    },
    heading2: {
        fontSize: fontSizes.xxxl,
        fontFamily: fonts.bold,
        color: colors.text,
        marginBottom: 12,
    },
    heading3: {
        fontSize: fontSizes.xxl,
        fontFamily: fonts.bold,
        color: colors.text,
        marginBottom: 8,
    },
    bodyText: {
        fontSize: fontSizes.md,
        fontFamily: fonts.regular,
        color: colors.text,
        lineHeight: 20,
    },
    caption: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.regular,
        color: colors.textSecondary,
    },

    // Button styles
    button: {
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 50,
    },
    buttonPrimary: {
        backgroundColor: colors.primary,
    },
    buttonSecondary: {
        backgroundColor: colors.secondary,
    },
    buttonOutline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: colors.primary,
    },
    buttonText: {
        fontSize: fontSizes.md,
        fontFamily: fonts.medium,
        textAlign: "center",
    },
    buttonTextPrimary: {
        color: colors.white,
    },
    buttonTextOutline: {
        color: colors.primary,
    },

    // Input styles
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: fontSizes.md,
        fontFamily: fonts.regular,
        backgroundColor: colors.surface,
        minHeight: 50,
    },
    inputFocused: {
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    inputError: {
        borderColor: colors.error,
    },

    // Layout styles
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    column: {
        flexDirection: "column",
    },
    centered: {
        alignItems: "center",
        justifyContent: "center",
    },

    // Spacing styles
    margin: {
        margin: 16,
    },
    marginHorizontal: {
        marginHorizontal: 16,
    },
    marginVertical: {
        marginVertical: 16,
    },
    padding: {
        padding: 16,
    },
    paddingHorizontal: {
        paddingHorizontal: 16,
    },
    paddingVertical: {
        paddingVertical: 16,
    },

    // Shadow styles
    shadow: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    shadowLarge: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
});
