import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { useSettingsStore } from '@/store/useSettingsStore';
import { isValidTableNumber } from '@/utils/parseTableQr';

/**
 * Deep link from a table QR code: digitalmenu://table/12 (or https://<your-domain>/table/12
 * once universal links are set up). Saves the table, then opens Home.
 */
export default function TableLink() {
  const { number } = useLocalSearchParams<{ number: string }>();
  const setTableNumber = useSettingsStore((s) => s.setTableNumber);
  const valid = typeof number === 'string' && isValidTableNumber(number);

  useEffect(() => {
    if (valid) setTableNumber(number);
  }, [valid, number, setTableNumber]);

  return <Redirect href="/" />;
}
