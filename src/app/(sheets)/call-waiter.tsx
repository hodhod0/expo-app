import { router } from 'expo-router';
import { BellRing, Check, Droplet, QrCode, ReceiptText, Sparkles, Utensils, type LucideIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { sendWaiterRequest, type WaiterRequestType } from '@/api/waiter';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useRtl } from '@/hooks/useRtl';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, screenPadding } from '@/theme/spacing';

const OPTIONS: { type: WaiterRequestType; icon: LucideIcon; label: string }[] = [
  { type: 'call', icon: BellRing, label: 'waiter.call' },
  { type: 'bill', icon: ReceiptText, label: 'waiter.bill' },
  { type: 'water', icon: Droplet, label: 'waiter.water' },
  { type: 'clean', icon: Sparkles, label: 'waiter.clean' },
];

type Status = 'idle' | 'sending' | 'sent';

/** 09 · Call Waiter */
export default function CallWaiterSheet() {
  const { t } = useTranslation();
  const { colors, fonts, isRTL } = useTheme();
  const { row, start } = useRtl();
  const insets = useSafeAreaInsets();
  const table = useSettingsStore((s) => s.tableNumber);
  const [type, setType] = useState<WaiterRequestType>('call');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  // Close the sheet a moment after the confirmation shows.
  useEffect(() => {
    if (status !== 'sent') return;
    const timer = setTimeout(() => router.back(), 2200);
    return () => clearTimeout(timer);
  }, [status]);

  const onSend = async () => {
    setStatus('sending');
    await sendWaiterRequest({ type, table, note: note.trim() || undefined });
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <View style={[styles.root, styles.sent, { backgroundColor: colors.bg }]}>
        <Animated.View entering={ZoomIn.springify().damping(9)} style={[styles.sentIcon, { backgroundColor: colors.accent }]}>
          <Check size={36} color={colors.onColor} strokeWidth={2.5} />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(150).duration(300)} style={styles.sentText}>
          <AppText variant="title" style={styles.center}>
            {t('waiter.onTheWay')}
          </AppText>
          <AppText color="muted" style={styles.center}>
            {table ? t('waiter.eta', { table }) : t('waiter.etaNoTable')}
          </AppText>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: start, gap: 8 }}>
          {table ? (
            <View style={[styles.tableChip, { flexDirection: row, backgroundColor: colors.accentSoft }]}>
              <Utensils size={14} color={colors.accentText} />
              <AppText variant="caption" weight="semibold" color="accentText">
                {t('order.table', { number: table })}
              </AppText>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/scan')}
              style={[styles.tableChip, { flexDirection: row, backgroundColor: colors.primarySoft }]}>
              <QrCode size={14} color={colors.primary} />
              <AppText variant="caption" weight="semibold" color="primary">
                {`${t('waiter.noTable')} · ${t('waiter.scanTable')}`}
              </AppText>
            </Pressable>
          )}
          <AppText variant="title">{t('waiter.title')}</AppText>
        </View>

        <View style={[styles.grid, { flexDirection: row }]}>
          {OPTIONS.map(({ type: optionType, icon: Icon, label }) => {
            const on = optionType === type;
            return (
              <Pressable
                key={optionType}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => setType(optionType)}
                style={[
                  styles.option,
                  {
                    alignItems: start,
                    backgroundColor: colors.surface,
                    borderColor: on ? colors.primary : colors.line,
                    borderWidth: on ? 2 : 1,
                  },
                ]}>
                <View style={[styles.optionIcon, { backgroundColor: on ? colors.primary : colors.primarySoft }]}>
                  <Icon size={20} color={on ? colors.onColor : colors.primary} />
                </View>
                <AppText variant="bodySmall" weight="semibold">
                  {t(label)}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder={t('waiter.note')}
          placeholderTextColor={colors.muted}
          maxLength={140}
          style={[
            styles.note,
            {
              color: colors.ink,
              fontFamily: fonts.regular,
              backgroundColor: colors.surface,
              borderColor: colors.line,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
        <Button
          label={status === 'sending' ? t('waiter.sending') : t('waiter.send')}
          disabled={status === 'sending'}
          onPress={onSend}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: screenPadding, paddingTop: 20, gap: 18 },
  tableChip: { alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  grid: { flexWrap: 'wrap', gap: 12 },
  option: { flexBasis: '47%', flexGrow: 1, gap: 12, padding: 16, borderRadius: radius.lg },
  optionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  note: { height: 52, paddingHorizontal: 16, borderWidth: 1, borderRadius: radius.md, fontSize: 15 },
  footer: { paddingHorizontal: screenPadding, paddingTop: 8 },
  sent: { alignItems: 'center', justifyContent: 'center', gap: 12, padding: screenPadding },
  sentIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  sentText: { gap: 12, alignItems: 'center' },
  center: { textAlign: 'center' },
});
