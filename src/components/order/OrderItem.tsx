import { Image } from 'expo-image';
import { Pencil } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useRtl } from '@/hooks/useRtl';
import { useOrderStore, type OrderLine } from '@/store/useOrderStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';
import { formatPrice } from '@/utils/format';

import { QuantityStepper } from './QuantityStepper';

/** Figma "Order Item": photo, name, kitchen note (tap to edit), line price, quantity stepper. */
export function OrderItem({ line }: { line: OrderLine }) {
  const { t } = useTranslation();
  const { colors, fonts, isRTL } = useTheme();
  const { row, start } = useRtl();
  const setQuantity = useOrderStore((s) => s.setQuantity);
  const setNote = useOrderStore((s) => s.setNote);
  const [editing, setEditing] = useState(false);

  return (
    <View style={[styles.card, { flexDirection: row, backgroundColor: colors.surface }]}>
      <View style={[styles.photo, { backgroundColor: line.tint ?? colors.line }]}>
        {line.imageUrl ? <Image source={line.imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
      </View>

      <View style={[styles.info, { alignItems: start }]}>
        <AppText variant="body" weight="semibold" numberOfLines={1}>
          {line.name}
        </AppText>

        {editing ? (
          <TextInput
            autoFocus
            defaultValue={line.note}
            placeholder={t('order.notePlaceholder')}
            placeholderTextColor={colors.muted}
            onEndEditing={(e) => {
              setNote(line.itemId, e.nativeEvent.text.trim());
              setEditing(false);
            }}
            onBlur={() => setEditing(false)}
            returnKeyType="done"
            style={[
              styles.noteInput,
              {
                color: colors.ink,
                fontFamily: fonts.regular,
                borderColor: colors.line,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
          />
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => setEditing(true)}
            hitSlop={4}
            style={[styles.noteRow, { flexDirection: row }]}>
            <Pencil size={12} color={colors.muted} />
            <AppText variant="caption" weight="regular" color="muted" numberOfLines={1} style={styles.noteText}>
              {line.note || t('order.addNote')}
            </AppText>
          </Pressable>
        )}

        <AppText variant="body" weight="bold" color="primary">
          {formatPrice(line.unitPrice * line.quantity)}
        </AppText>
      </View>

      <QuantityStepper value={line.quantity} onChange={(q) => setQuantity(line.itemId, q)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.lg },
  photo: { width: 64, height: 64, borderRadius: radius.md - 2, overflow: 'hidden' },
  info: { flex: 1, gap: 3 },
  noteRow: { alignItems: 'center', gap: 4 },
  noteText: { fontSize: 12, flexShrink: 1 },
  noteInput: { alignSelf: 'stretch', fontSize: 12, paddingVertical: 4, paddingHorizontal: 8, borderWidth: 1, borderRadius: 8 },
});
