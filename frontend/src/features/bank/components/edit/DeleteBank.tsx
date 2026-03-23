import { Trash2 } from "lucide-react-native";
import { Alert, TouchableOpacity } from "react-native";
import { deleteBank } from "../../services/bank.service";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../../shared/types";
import { showSuccess } from "../../../../shared/utils/toast.service";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EditBankStackParamList } from "../../../../navigation";
import { BankScreen } from "../../screens/BanksScreen";
import { useDispatch } from "react-redux";
import { removeBankAction } from "../../../../redux/bankSlice";

interface DeleteBankProps {
    bankId: number,
    navigation: NativeStackNavigationProp<EditBankStackParamList>,
}

export function DeleteBank({bankId, navigation}: DeleteBankProps){

      const dispatch = useDispatch();

    const deleteBankAction = () => {
        Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this bank?",
        [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: handleDelete }
        ]
        );
    }

    const handleDelete =  async () => {
        try{
            await deleteBank(bankId);
            showSuccess("Bank deleted succesfully!");
            dispatch(removeBankAction(bankId));
            navigation.popToTop();
        }
        catch(err) {
            const error = err as AxiosError<ErrorResponse<string>>
            const message = error.response?.data.message
            console.log(message);
        }   
    }

    return (
        <TouchableOpacity onPress={deleteBankAction}>
            <Trash2 size={25} color="red" />
        </TouchableOpacity>
    );
}