import {
  StyleSheet,
} from "react-native";
import { colors, spacing, typography } from "@/theme";


export const styles = StyleSheet.create({
  stepTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
    marginBottom: 2,
    marginHorizontal: spacing.base,
  },
  stepSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    marginHorizontal: spacing.base,
  },
  backRow: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  backLabel: {
    ...typography.body,
    color: colors.accent,
  },
  searchInput: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...typography.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hint: {
    ...typography.caption,
    color: colors.textDisabled,
    textAlign: "center",
    marginTop: spacing.lg,
    marginHorizontal: spacing.base,
  },
  centered: {
    alignItems: "center",
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  listItemLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  listItemSub: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  lineBadge: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  lineBadgeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});
