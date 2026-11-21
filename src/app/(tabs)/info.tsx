import { router } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Clock,
  Flame,
  Globe,
  LogOut,
  MapPin,
  MessageCircle,
  Navigation,
  Palette,
  Phone,
  Utensils,
  Wifi,
  type LucideIcon,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { restaurant } from '@/data/restaurant';
import { restaurantName } from '@/data/sample';
import { useRtl } from '@/hooks/useRtl';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, screenPadding } from '@/theme/spacing';
import { groupHours, openStatus } from '@/utils/hours';

const MAP_HEIGHT = 230;

/** 12 · Info — map, open status, contact actions, hours, address, Wi-Fi and settings. */
export default function InfoScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row, start } = useRtl();
  const language = useSettingsStore((s) => s.language);

  const { lat, lng } = restaurant.coordinates;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const status = openStatus(restaurant.hours);
  const today = new Date().getDay();
  const days = t('info.days', { returnObjects: true }) as string[];

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Map placeholder — tap for directions */}
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={t('info.directions')}
          onPress={() => Linking.openURL(mapsUrl)}
          style={[styles.map, { backgroundColor: colors.accentSoft }]}>
          <View style={[styles.road, { top: 150, transform: [{ rotate: '-8deg' }], backgroundColor: colors.surface }]} />
          <View style={[styles.road, { top: 60, height: 8, transform: [{ rotate: '4deg' }], backgroundColor: colors.surface }]} />
          <View style={[styles.roadV, { left: 120, transform: [{ rotate: '10deg' }], backgroundColor: colors.surface }]} />
          <View style={[styles.roadV, { right: 90, width: 10, transform: [{ rotate: '-6deg' }], backgroundColor: colors.surface }]} />
          <SafeAreaView edges={['top']} style={styles.pinWrap} pointerEvents="none">
            <View style={[styles.pin, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
              <Flame size={24} color={colors.onColor} />
            </View>
          </SafeAreaView>
        </Pressable>

        <View style={[styles.sheet, { backgroundColor: colors.bg }]}>
          {/* Name + status */}
          <View style={[styles.rowCenter, { flexDirection: row, gap: 14 }]}>
            <View style={[styles.logo, { backgroundColor: colors.accent }]}>
              <Flame size={26} color={colors.gold} />
            </View>
            <View style={{ flex: 1, alignItems: start }}>
              <AppText variant="title">{restaurantName[language]}</AppText>
              <AppText variant="caption" weight="regular" color="muted">
                {restaurant.cuisine[language]}
              </AppText>
            </View>
          </View>

          <View style={{ alignItems: start }}>
            <View
              style={[
                styles.status,
                { flexDirection: row, backgroundColor: status.open ? colors.accentSoft : colors.primarySoft },
              ]}>
              <View style={[styles.dot, { backgroundColor: status.open ? '#2F9E5B' : colors.primary }]} />
              <AppText variant="caption" weight="semibold" color={status.open ? 'accentText' : 'primary'}>
                {status.open ? t('info.openNow', { time: status.closesAt }) : t('info.closed')}
              </AppText>
            </View>
          </View>

          {/* Quick actions */}
          <View style={[styles.actions, { flexDirection: row }]}>
            <Action icon={Phone} label={t('info.call')} onPress={() => Linking.openURL(`tel:${restaurant.phone}`)} />
            <Action
              icon={MessageCircle}
              label={t('info.whatsapp')}
              onPress={() => Linking.openURL(`https://wa.me/${restaurant.whatsapp}`)}
            />
            <Action icon={Navigation} label={t('info.directions')} onPress={() => Linking.openURL(mapsUrl)} />
          </View>

          {/* Opening hours */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={[styles.rowCenter, { flexDirection: row, gap: 8 }]}>
              <Clock size={18} color={colors.ink} />
              <AppText variant="body" weight="semibold">
                {t('info.hours')}
              </AppText>
            </View>
            {groupHours(restaurant.hours).map((g) => {
              const isToday = g.days.includes(today);
              const label =
                g.days.length > 1 ? `${days[g.days[0]]} – ${days[g.days[g.days.length - 1]]}` : days[g.days[0]];
              return (
                <View key={g.days.join()} style={[styles.hoursRow, { flexDirection: row }]}>
                  <AppText variant="bodySmall" weight={isToday ? 'semibold' : 'regular'} color={isToday ? 'primary' : 'muted'}>
                    {isToday ? `${label}  (${t('info.today')})` : label}
                  </AppText>
                  <AppText variant="bodySmall" weight={isToday ? 'semibold' : 'medium'} color={isToday ? 'primary' : 'ink'}>
                    {g.hours ? `${g.hours.open} – ${g.hours.close}` : t('info.closedDay')}
                  </AppText>
                </View>
              );
            })}
          </View>

          <InfoRow icon={MapPin} title={restaurant.address[language]} subtitle={restaurant.addressNote[language]} onPress={() => Linking.openURL(mapsUrl)} />
          <InfoRow icon={Wifi} title={t('info.wifi')} subtitle={t('info.network', { name: restaurant.wifi.network })} />

          {/* Settings */}
          <View style={{ alignItems: start, marginTop: 8 }}>
            <AppText variant="heading">{t('info.settings')}</AppText>
          </View>
          <SettingsRows />
        </View>
      </ScrollView>
    </View>
  );
}

function SettingsRows() {
  const { t } = useTranslation();
  const theme = useSettingsStore((s) => s.theme);
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const table = useSettingsStore((s) => s.tableNumber);
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <>
      {user ? (
        <InfoRow icon={LogOut} title={t('auth.signedInAs', { name: user.name })} subtitle={user.email} value={t('auth.signOut')} onPress={signOut} />
      ) : (
        <InfoRow icon={CircleUser} title={t('auth.account')} value={t('auth.guestAccount')} onPress={() => router.push('/login')} />
      )}
      <InfoRow
        icon={Palette}
        title={t('info.appearance')}
        value={t(`info.themes.${theme}`)}
        onPress={() => router.push('/appearance')}
      />
      <InfoRow
        icon={Globe}
        title={t('info.language')}
        value={language === 'en' ? 'English' : 'العربية'}
        onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      />
      <InfoRow
        icon={Utensils}
        title={t('info.table')}
        value={table ?? t('info.noTable')}
        onPress={() => router.push('/scan')}
      />
    </>
  );
}

function Action({ icon: Icon, label, onPress }: { icon: LucideIcon; label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: colors.surface, borderColor: colors.line, opacity: pressed ? 0.8 : 1 },
      ]}>
      <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft }]}>
        <Icon size={17} color={colors.primary} />
      </View>
      <AppText variant="caption" weight="semibold">
        {label}
      </AppText>
    </Pressable>
  );
}

function InfoRow({
  icon: Icon,
  title,
  subtitle,
  value,
  onPress,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const { isRTL, row, start } = useRtl();
  const Chevron = isRTL ? ChevronLeft : ChevronRight;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.infoRow,
        { flexDirection: row, backgroundColor: colors.surface, opacity: pressed ? 0.85 : 1 },
      ]}>
      <View style={[styles.infoIcon, { backgroundColor: colors.bg }]}>
        <Icon size={17} color={colors.ink} />
      </View>
      <View style={{ flex: 1, alignItems: start }}>
        <AppText variant="bodySmall" weight="semibold">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" weight="regular" color="muted" style={{ fontSize: 12 }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="bodySmall" color="muted">
          {value}
        </AppText>
      ) : null}
      {onPress ? <Chevron size={16} color={colors.muted} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 32 },
  map: { height: MAP_HEIGHT, overflow: 'hidden' },
  road: { position: 'absolute', left: -40, right: -40, height: 14 },
  roadV: { position: 'absolute', top: -40, bottom: -40, width: 12 },
  pinWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  pin: { width: 52, height: 52, borderRadius: 26, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  sheet: {
    marginTop: -24,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: screenPadding,
    paddingTop: 24,
    gap: 14,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  rowCenter: { alignItems: 'center' },
  logo: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  status: { alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  dot: { width: 8, height: 8, borderRadius: 4 },
  actions: { gap: 10 },
  action: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 12, borderRadius: radius.md, borderWidth: 1 },
  actionIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  card: { padding: 16, gap: 10, borderRadius: radius.lg - 2 },
  hoursRow: { justifyContent: 'space-between' },
  infoRow: { alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderRadius: radius.lg - 2 },
  infoIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
