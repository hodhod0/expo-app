import { router } from 'expo-router';
import { Flame, Lock, Mail } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View, type TextInputInstance } from 'react-native';

import { signIn } from '@/api/auth';
import { AuthScreen } from '@/components/layout/AuthScreen';
import { FooterLink } from '@/components/layout/FooterLink';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { useRtl } from '@/hooks/useRtl';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from '@/theme/ThemeProvider';
import { validateEmail, validatePassword } from '@/utils/validation';

const leave = () => (router.canGoBack() ? router.back() : router.replace('/'));

/** 05 · Login */
export default function LoginScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { row, start, end } = useRtl();
  const setUser = useAuthStore((s) => s.setUser);
  const passwordRef = useRef<TextInputInstance>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = { email: validateEmail(email), password: validatePassword(password) };
  const valid = !errors.email && !errors.password;

  const onSubmit = async () => {
    setSubmitted(true);
    if (!valid || loading) return;
    setLoading(true);
    try {
      setUser(await signIn(email.trim(), password));
      leave();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      footer={<FooterLink text={t('auth.noAccount')} link={t('auth.signUp')} onPress={() => router.replace('/register')} />}>
      <View style={[styles.top, { flexDirection: row }]}>
        <View style={[styles.logo, { backgroundColor: colors.accent }]}>
          <Flame size={28} color={colors.gold} />
        </View>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={leave}>
          <AppText variant="bodySmall" weight="semibold" color="primary">
            {t('auth.guest')}
          </AppText>
        </Pressable>
      </View>

      <View style={{ alignItems: start, gap: 8 }}>
        <AppText variant="display" style={{ fontSize: 30 }}>
          {t('auth.welcomeBack')}
        </AppText>
        <AppText color="muted" style={{ lineHeight: 22 }}>
          {t('auth.welcomeSub')}
        </AppText>
      </View>

      <View style={styles.form}>
        <InputField
          label={t('auth.email')}
          icon={Mail}
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={submitted ? errors.email : null}
        />
        <InputField
          ref={passwordRef}
          label={t('auth.password')}
          icon={Lock}
          password
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.passwordPlaceholder')}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={onSubmit}
          error={submitted ? errors.password : null}
        />
        <View style={{ alignItems: end }}>
          <Pressable accessibilityRole="link" hitSlop={8} onPress={() => router.push('/forgot-password')}>
            <AppText variant="bodySmall" weight="semibold" color="primary">
              {t('auth.forgot')}
            </AppText>
          </Pressable>
        </View>
      </View>

      <Button label={loading ? t('auth.signingIn') : t('auth.signIn')} disabled={loading} onPress={onSubmit} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  form: { gap: 16 },
});
