import { Copy, Trash2 } from "lucide-react-native";
import { Alert, TouchableOpacity } from "react-native";

interface CopyButtonProps {
  onCopy: () => Promise<void> | void;
  confirmTitle?: string;
  confirmMessage?: string;
  iconSize?: number;
  iconColor?: string;
}

export function CopyButton({
  onCopy,
  confirmTitle = "Confirm Copy",
  confirmMessage = "Are you sure you want to copy this item?",
  iconSize = 24,
  iconColor = "#007AFF",
}: CopyButtonProps) {
  const handlePress = () => {
    Alert.alert(confirmTitle, confirmMessage, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Copy",
        style: "default",
        onPress: async () => {
          await onCopy();
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        margin: 0,
      }}
      onPress={handlePress}
    >
      <Copy size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}
