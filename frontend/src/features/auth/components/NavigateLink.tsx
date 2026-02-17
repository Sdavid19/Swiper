import { useNavigation } from '@react-navigation/native';
import { Pressable, Text } from 'react-native';
import type { StackNavigation, Screen } from '../../../../App';

type NavigateLinkProps = {
  text: string;
  component: Screen;
};

export function NavigateLink({ text, component }: NavigateLinkProps) {
  const navigation = useNavigation<StackNavigation>();

  return (
    <Pressable onPress={() => navigation.navigate(component)}>
      <Text style={{ color: '#3498db', textAlign: 'center', marginTop: 20 }}>
        {text}
      </Text>
    </Pressable>
  );
}
