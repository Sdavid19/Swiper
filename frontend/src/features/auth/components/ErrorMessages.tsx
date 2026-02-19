import { TriangleAlert } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type ErrorMessage = { message?: string[] | null }

export function ErrorMessage({ message }: ErrorMessage) {
  return (
    <View style={styles.container}>
      {Array.isArray(message) && message.length > 0 && (
        <View style={styles.messageContainer}>
          
          <TriangleAlert size={30} color="red" />

          <View style={{ flex: 1, marginLeft: 10 }}>
            {message.map((err, idx) => (
              <Text key={idx} style={styles.errorText}>
                {err[0].toUpperCase() + err.slice(1)}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 100,
  },
  messageContainer: {
    minHeight: 100,
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 8,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fda8a8',
    marginBottom: 12,
    width: '100%',
  },
  errorText: {
    color: 'red',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});
