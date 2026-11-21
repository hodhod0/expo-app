import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Mail, MailCheck } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { requestPasswordReset } from '@/api/auth';
import { AuthScreen } from '@/components/layout/AuthScreen';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { InputField } from '@/components/ui/InputField';
import { useRtl } from '@/hooks/useRtl';
import { useTheme } from '@/theme/ThemeProvider';
import { validateEmail } from '@/utils/validation';

const backToLogin = () => (router.canGoBack() ? router.back() : router.replace('/login'));

/** Forgot password — email form, then a "check your email" confirmation. */
export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isRTL, start } = useRtl();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const error = validateEmail(email);

  const onSubmit = async () => {
    setSubmitted(true);
    if (error || loading) return;
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthScreen>
        <View style={styles.sent}>
          <View style={[styles.sentIcon, { backgroundColor: colors.accentSoft }]}>
            <MailCheck size={34} color={colors.accentText} />
          </View>
          <AppText variant="title" style={styles.center}>
            {t('auth.sentTitle')}
          </AppText>
          <AppText color="muted" style={[styles.center, { lineHeight: 22 }]}>
            {t('auth.sentText', { email: email.trim() })}
          </AppText>
        </View>
        <Button label={t('auth.backToSignIn')} onPress={backToLogin} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <View style={{ alignItems: start }}>
        <IconButton
          icon={isRTL ? ChevronRight : ChevronLeft}
          size={44}
          accessibilityLabel={t('common.back')}
          onPress={backToLogin}
        />
      </View>
      <View style={{ alignItems: start, gap: 8 }}>
        <AppText variant="display" style={{ fontSize: 30 }}>
          {t('auth.forgotTitle')}
        </AppText>
        <AppText color="muted" style={{ lineHeight: 22 }}>
          {t('auth.forgotSub')}
        </AppText>
      </View>
      <InputField
        label={t('auth.email')}
        icon={Mail}
        value={email}
        onChangeText={setEmail}
        placeholder={t('auth.emailPlaceholder')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="send"
        onSubmitEditing={onSubmit}
        error={submitted ? error : null}
      />
      <Button label={loading ? t('auth.sending') : t('auth.sendLink')} disabled={loading} onPress={onSubmit} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  sent: { alignItems: 'center', gap: 12, paddingTop: 80 },
  sentIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  center: { textAlign: 'center' },
});
