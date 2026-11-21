import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';
import { Camera, Flashlight, FlashlightOff, Utensils, X } from 'lucide-react-native';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useRtl } from '@/hooks/useRtl';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, screenPadding } from '@/theme/spacing';
import { isValidTableNumber, parseTableQr } from '@/utils/parseTableQr';

const FRAME = 250;
const WHITE = '#FFFFFF';
const CAMERA_BG = '#14110E';

/** 08 · Scan Table QR — camera scan with manual table-number entry as a fallback. */
export default function ScanScreen() {
  const { t } = useTranslation();
  const { colors, fonts, isRTL } = useTheme();
  const { row, start } = useRtl();
  const insets = useSafeAreaInsets();
  const setTableNumber = useSettingsStore((s) => s.setTableNumber);
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [manual, setManual] = useState('');
  const [error, setError] = useState<string | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 2500);
    return () => clearTimeout(timer);
  }, [error]);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const join = (table: string) => {
    if (handled.current) return;
    handled.current = true;
    setTableNumber(table.trim());
    close();
  };

  const onScanned = ({ data }: BarcodeScanningResult) => {
    if (handled.current) return;
    const table = parseTableQr(data);
    if (table) join(table);
    else setError(t('scan.notTable'));
  };

  const granted = permission?.granted ?? false;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.root, { backgroundColor: CAMERA_BG }]}>
      <View style={styles.cameraArea}>
        {granted && (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={torch}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={onScanned}
          />
        )}

        {/* Top bar */}
        <View style={[styles.topBar, { top: insets.top + 12, flexDirection: row }]}>
          <RoundButton label={t('scan.close')} onPress={close}>
            <X size={20} color={WHITE} />
          </RoundButton>
          <AppText variant="heading" style={{ color: WHITE }}>
            {t('scan.title')}
          </AppText>
          {granted && Platform.OS !== 'web' ? (
            <RoundButton label={t('scan.torch')} onPress={() => setTorch((v) => !v)}>
              {torch ? <FlashlightOff size={20} color={WHITE} /> : <Flashlight size={20} color={WHITE} />}
            </RoundButton>
          ) : (
            <View style={styles.roundPlaceholder} />
          )}
        </View>

        {granted ? (
          <View style={styles.center} pointerEvents="none">
            <View style={styles.frame}>
              <Corner style={{ top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5, borderTopLeftRadius: 18 }} />
              <Corner style={{ top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5, borderTopRightRadius: 18 }} />
              <Corner style={{ bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5, borderBottomLeftRadius: 18 }} />
              <Corner
                style={{ bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5, borderBottomRightRadius: 18 }}
              />
              <View style={[styles.scanLine, { backgroundColor: colors.primary }]} />
            </View>
            <AppText style={[styles.hint, { color: error ? colors.gold : WHITE }]}>{error ?? t('scan.hint')}</AppText>
            {Platform.OS === 'web' && (
              <AppText variant="caption" style={[styles.hint, { color: WHITE, opacity: 0.7 }]}>
                {t('scan.webNote')}
              </AppText>
            )}
          </View>
        ) : (
          permission && (
            <View style={styles.center}>
              <View style={[styles.permIcon, { backgroundColor: colors.accent }]}>
                <Camera size={30} color={WHITE} />
              </View>
              <AppText variant="title" style={[styles.hint, { color: WHITE }]}>
                {t('scan.permissionTitle')}
              </AppText>
              <AppText style={[styles.hint, { color: WHITE, opacity: 0.75 }]}>{t('scan.permissionText')}</AppText>
              <Button
                label={permission.canAskAgain ? t('scan.allow') : t('scan.openSettings')}
                onPress={() => (permission.canAskAgain ? requestPermission() : Linking.openSettings())}
                style={styles.permButton}
              />
            </View>
          )
        )}
      </View>

      {/* Manual entry */}
      <View style={[styles.card, { backgroundColor: colors.bg, paddingBottom: 24 + insets.bottom }]}>
        <View style={{ alignItems: start }}>
          <AppText variant="body" weight="semibold">
            {t('scan.manualTitle')}
          </AppText>
        </View>
        <View style={[styles.manualRow, { flexDirection: row }]}>
          <View
            style={[
              styles.input,
              { flexDirection: row, backgroundColor: colors.surface, borderColor: colors.primary },
            ]}>
            <Utensils size={18} color={colors.muted} />
            <TextInput
              value={manual}
              onChangeText={setManual}
              placeholder={t('scan.placeholder')}
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              maxLength={10}
              returnKeyType="go"
              onSubmitEditing={() => isValidTableNumber(manual) && join(manual)}
              style={[
                styles.inputText,
                { color: colors.ink, fontFamily: fonts.bold, textAlign: isRTL ? 'right' : 'left' },
              ]}
            />
          </View>
          <Button
            label={t('scan.join')}
            disabled={!isValidTableNumber(manual)}
            onPress={() => join(manual)}
            style={[styles.joinButton, { opacity: isValidTableNumber(manual) ? 1 : 0.5 }]}
          />
        </View>
        <View style={{ alignItems: start }}>
          <AppText variant="caption" weight="regular" color="muted">
            {t('scan.browseHint')}
          </AppText>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Corner({ style }: { style: object }) {
  return <View style={[styles.corner, style]} />;
}

function RoundButton({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.round}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  cameraArea: { flex: 1, overflow: 'hidden' },
  topBar: {
    position: 'absolute',
    left: screenPadding,
    right: screenPadding,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  round: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundPlaceholder: { width: 44 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: screenPadding },
  frame: { width: FRAME, height: FRAME, marginBottom: 12 },
  corner: { position: 'absolute', width: 46, height: 46, borderColor: WHITE },
  scanLine: { position: 'absolute', top: FRAME / 2, left: 20, right: 20, height: 3, borderRadius: 2 },
  hint: { textAlign: 'center', lineHeight: 22 },
  permIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  permButton: { alignSelf: 'stretch', marginTop: 8 },
  card: {
    paddingHorizontal: screenPadding,
    paddingTop: 24,
    gap: 14,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  manualRow: { gap: 12, alignItems: 'center' },
  input: {
    width: 130,
    height: 56,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  inputText: { flex: 1, fontSize: 18, height: '100%' },
  joinButton: { flex: 1 },
});
