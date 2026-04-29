import { Search } from "lucide-react-native";
import { InputField } from "./InputField";
import { useEffect } from "react";

type SearchInputFieldProps = {
    textFilter: string,
    setTextFilter: React.Dispatch<React.SetStateAction<string>>,
    setDebounceTextFilter: React.Dispatch<React.SetStateAction<string>>
}

export function SearchInputField({ textFilter, setTextFilter, setDebounceTextFilter }: SearchInputFieldProps) {


    useEffect(() => {
        const t = setTimeout(() => {
            setDebounceTextFilter(textFilter);
        }, 400);

        return () => clearTimeout(t);
    }, [textFilter]);

    return (
        <InputField
            fieldStyle={{ width: "65%" }}
            disableErrorMessages
            Icon={Search}
            value={textFilter}
            onChangeText={setTextFilter}
        />
    );
}