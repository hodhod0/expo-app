import { Eye, EyeOff, type LucideIcon } from 'lucide-react-native';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { useRtl } from '@/hooks/useRtl';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/spacing';

import { AppText } from './AppText';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  icon: LucideIcon;
  /** i18n key of the error to show under the field. */
  error?: string | null;
  hint?: string;
  /** Password field with a show/hide eye button. */
  password?: boolean;
};

/** Figma "Input Field": label, leading icon, optional eye toggle, error/hint text. */
export const InputField = forwardRef<TextInputInstance, Props>(function InputField(
  { label, icon: Icon, error, hint, password, ...input },
  ref,
) {
  const { t } = useTranslation();
  const { colors, fonts, isRTL } = useTheme();
  const { row, start } = useRtl();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const borderColor = error ? colors.primary : focused ? colors.ink : colors.line;

  return (
    <View style={styles.field}>
      <View style={{ alignItems: start }}>
        <AppText variant="caption" weight="semibold">
          {label}
        </AppText>
      </View>
      <View style={[styles.box, { flexDirection: row, backgroundColor: colors.surface, borderColor }]}>
        <Icon size={20} color={colors.muted} />
        <TextInput
          ref={ref}
          {...input}
          secureTextEntry={password && !visible}
          placeholderTextColor={colors.muted}
          onFocus={(e) => {
            setFocused(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            input.onBlur?.(e);
          }}
          accessibilityLabel={label}
          style={[styles.input, { color: colors.ink, fontFamily: fonts.regular, textAlign: isRTL ? 'right' : 'left' }]}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(visible ? 'auth.hidePassword' : 'auth.showPassword')}
            hitSlop={8}
            onPress={() => setVisible((v) => !v)}>
            {visible ? <EyeOff size={20} color={colors.muted} /> : <Eye size={20} color={colors.muted} />}
          </Pressable>
        ) : null}
      </View>
      {error || hint ? (
        <View style={{ alignItems: start }}>
          <AppText variant="caption" weight="regular" color={error ? 'primary' : 'muted'} style={{ fontSize: 12 }}>
            {error ? t(error) : hint}
          </AppText>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: { gap: 8 },
  box: { height: 52, alignItems: 'center', gap: 10, paddingHorizontal: 16, borderRadius: radius.md, borderWidth: 1 },
  input: { flex: 1, height: '100%', fontSize: 15 },
});
