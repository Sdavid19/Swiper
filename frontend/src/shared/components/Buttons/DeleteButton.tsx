import { Trash2 } from "lucide-react-native";
import { Alert, TouchableOpacity } from "react-native";

interface DeleteButtonProps {
  onDelete: () => Promise<void> | void;
  confirmTitle?: string;
  confirmMessage?: string;
  iconSize?: number;
  iconColor?: string;
}

export function DeleteButton({
  onDelete,
  confirmTitle = "Confirm Delete",
  confirmMessage = "Are you sure you want to delete this item?",
  iconSize = 24,
  iconColor = "red",
}: DeleteButtonProps) {
  const handlePress = () => {
    Alert.alert(confirmTitle, confirmMessage, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await onDelete();
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
      }}
      onPress={handlePress}
    >
      <Trash2 size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}
