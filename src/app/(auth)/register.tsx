import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Lock, Mail, Phone, User } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type TextInputInstance } from 'react-native';

import { signUp } from '@/api/auth';
import { AuthScreen } from '@/components/layout/AuthScreen';
import { FooterLink } from '@/components/layout/FooterLink';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { IconButton } from '@/components/ui/IconButton';
import { InputField } from '@/components/ui/InputField';
import { useRtl } from '@/hooks/useRtl';
import { useAuthStore } from '@/store/useAuthStore';
import { validateEmail, validateName, validatePassword, validatePhone } from '@/utils/validation';

/** 06 · Register */
export default function RegisterScreen() {
  const { t } = useTranslation();
  const { isRTL, start } = useRtl();
  const setUser = useAuthStore((s) => s.setUser);
  const emailRef = useRef<TextInputInstance>(null);
  const phoneRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));
  const errors = {
    name: validateName(form.name),
    email: validateEmail(form.email),
    phone: validatePhone(form.phone),
    password: validatePassword(form.password, true),
    terms: agreed ? null : 'auth.errors.terms',
  };
  const valid = Object.values(errors).every((e) => !e);
  const show = (key: keyof typeof errors) => (submitted ? errors[key] : null);

  const onSubmit = async () => {
    setSubmitted(true);
    if (!valid || loading) return;
    setLoading(true);
    try {
      setUser(
        await signUp({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          password: form.password,
        }),
      );
      router.dismissTo('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      footer={
        <FooterLink text={t('auth.haveAccount')} link={t('auth.signIn')} onPress={() => router.replace('/login')} />
      }>
      <View style={{ alignItems: start }}>
        <IconButton
          icon={isRTL ? ChevronRight : ChevronLeft}
          size={44}
          accessibilityLabel={t('common.back')}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/login'))}
        />
      </View>

      <View style={{ alignItems: start, gap: 8 }}>
        <AppText variant="display" style={{ fontSize: 30 }}>
          {t('auth.createAccount')}
        </AppText>
        <AppText color="muted" style={{ lineHeight: 22 }}>
          {t('auth.createSub')}
        </AppText>
      </View>

      <View style={styles.form}>
        <InputField
          label={t('auth.fullName')}
          icon={User}
          value={form.name}
          onChangeText={set('name')}
          placeholder={t('auth.namePlaceholder')}
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          error={show('name')}
        />
        <InputField
          ref={emailRef}
          label={t('auth.email')}
          icon={Mail}
          value={form.email}
          onChangeText={set('email')}
          placeholder={t('auth.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
          error={show('email')}
        />
        <InputField
          ref={phoneRef}
          label={t('auth.phoneOptional')}
          icon={Phone}
          value={form.phone}
          onChangeText={set('phone')}
          placeholder={t('auth.phonePlaceholder')}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={show('phone')}
        />
        <InputField
          ref={passwordRef}
          label={t('auth.password')}
          icon={Lock}
          password
          value={form.password}
          onChangeText={set('password')}
          placeholder={t('auth.newPasswordPlaceholder')}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          hint={t('auth.passwordHint')}
          error={show('password')}
        />

        <View style={{ gap: 6 }}>
          <Checkbox checked={agreed} onChange={setAgreed}>
            <AppText variant="caption" weight="regular" color="muted" style={styles.flexText}>
              {t('auth.agree')}
              <AppText variant="caption" weight="semibold" color="primary">
                {t('auth.terms')}
              </AppText>
            </AppText>
          </Checkbox>
          {show('terms') ? (
            <View style={{ alignItems: start }}>
              <AppText variant="caption" weight="regular" color="primary" style={{ fontSize: 12 }}>
                {t(errors.terms!)}
              </AppText>
            </View>
          ) : null}
        </View>
      </View>

      <Button label={loading ? t('auth.creating') : t('auth.createAccount')} disabled={loading} onPress={onSubmit} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16 },
  flexText: { flexShrink: 1 },
});
