import { useNavigation } from '@react-navigation/native'
import { Pressable, Text } from 'react-native'
import { AuthNavigation, AuthStackParamList } from '../../../navigation/types'

type NavigateLinkProps = {
  text: string
  component: keyof AuthStackParamList
}

export function NavigateLink({ text, component }: NavigateLinkProps) {
  const navigation = useNavigation<AuthNavigation>()

  return (
    <Pressable  onPress={() => navigation.navigate(component)}>
      <Text style={{ textAlign: 'center', marginTop: 20, textDecorationLine: 'underline' }}>
        {text}
      </Text>
    </Pressable>
  )
}
