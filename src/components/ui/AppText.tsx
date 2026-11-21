import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { ColorTokens } from '@/theme/colors';
import { textVariants, type FontWeightName, type TextVariant } from '@/theme/typography';

type Props = TextProps & {
  variant?: TextVariant;
  color?: keyof ColorTokens;
  weight?: FontWeightName;
};

/** Text that picks the right font (Latin/Arabic), size and theme colour. */
export function AppText({ variant = 'body', color = 'ink', weight, style, ...rest }: Props) {
  const { colors, fonts, isRTL } = useTheme();
  const v = textVariants[variant];
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: fonts[weight ?? v.weight],
          fontSize: v.fontSize,
          color: colors[color],
          textAlign: isRTL ? 'right' : 'left',
        },
        style,
      ]}
    />
  );
}
