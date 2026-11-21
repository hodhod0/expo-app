import { Pressable } from 'react-native';

import { AppText } from '@/components/ui/AppText';

/** "Don't have an account? Sign up" style line. */
export function FooterLink({ text, link, onPress }: { text: string; link: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" hitSlop={8} onPress={onPress}>
      <AppText variant="bodySmall" color="muted" style={{ textAlign: 'center' }}>
        {text}
        <AppText variant="bodySmall" weight="semibold" color="primary">
          {link}
        </AppText>
      </AppText>
    </Pressable>
  );
}
