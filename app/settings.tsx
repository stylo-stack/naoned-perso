import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenHeader, HeaderButton } from '@/components/ScreenHeader';
import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/i18n';
import { colors, spacing, typography } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  async function handleSelectLanguage(lang: SupportedLanguage) {
    await setLanguage(lang);
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t('settings.title')}
        rightAction={<HeaderButton label={t('common.close')} onPress={() => router.back()} />}
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={styles.row}
            onPress={() => handleSelectLanguage(lang)}
            activeOpacity={0.7}
          >
            <Text style={styles.rowLabel}>{t(`settings.languages.${lang}`)}</Text>
            {language === lang && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  check: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '600',
  },
});
