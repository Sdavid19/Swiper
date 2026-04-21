import { FlatList, StyleSheet, Text, View } from "react-native";
import { QuestionDto } from "../../../../shared/types/generated";
import { QuestionCard } from "./QuestionCard";

type QuestionListPorps = {
    questions: QuestionDto[],
    viewMode: boolean
    details: boolean
}

export function QuestionList({ questions, viewMode, details }: QuestionListPorps) {
    return (
        <>
            {questions.length > 0 ? (
                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    style={{ paddingHorizontal: 5 }}
                    renderItem={({ item }) => <QuestionCard details={details} question={item} viewMode={viewMode}/>}
                />
            ) : (
                <View style={styles.emptycontainer}>
                    <Text>There are now questions.</Text>
                </View>
            )}
        </>);
}


const styles = StyleSheet.create({

    listContent: {
        paddingBottom: 20,
    },
    emptycontainer: {
        flex: 1,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
