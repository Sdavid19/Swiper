import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import Swiper from "react-native-deck-swiper";
import { showInfo } from "../../../shared/utils/toast.service";
import { PrimaryButton } from "../../../shared/components";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList, VoteStackParamList } from "../../../navigation";
import { QuestionDto } from "../../../shared/types/generated";
import { getQuestionsByBank } from "../../bank/services/question.service";

type VoteSreenProps = NativeStackScreenProps<AppStackParamList, "Vote">;

export function VoteScreen({route}: VoteSreenProps) {
    const swiperRef = useRef<Swiper<QuestionDto> | null>(null);

    const [questions, setQuestions] = useState<QuestionDto[]>([]);

    const bankId = route.params.bankId;

    useEffect(() => {
    getQuestionsByBank(bankId)
        .then(q => {
        q.forEach(item => {
            if (item.imageUrl) {
            Image.prefetch(item.imageUrl);
            }
        });
        setQuestions(q);
        });
    }, []);

    const swipeRight = () => swiperRef.current?.swipeRight();
    const swipeLeft = () => swiperRef.current?.swipeLeft();

    const Card = React.memo(({ card, index }: { card: QuestionDto, index: number }) => (
    <View style={[styles.card]}>
        <ImageBackground
        source={{ uri: card.imageUrl! }}
        style={styles.image}
        imageStyle={{ borderRadius: 12 }}
        >
        <View style={styles.overlay}>
            <Text style={styles.text}>{card.text}</Text>
        </View>
        </ImageBackground>
    </View>
    ));

    return (
        <View style={styles.container}>
             {(questions && questions.length > 0) && (
                <Swiper
                    cards={questions}
                    keyExtractor={(item) => item.id.toString()}

                    stackSize={3}
                    animateCardOpacity={false}
                    animateOverlayLabelsOpacity={false}
                    backgroundColor="transparent"
                    verticalSwipe={false}

                    onSwipedAll={() => showInfo("ennyi volt")}
                    showSecondCard={false}
                    renderCard={(card) => (
                        <View style={styles.card}>
                        <ImageBackground
                            source={{ uri: card.imageUrl! }}
                            style={styles.image}
                            imageStyle={{ borderRadius: 12 }}
                        >
                            <View style={styles.overlay}>
                            <Text style={styles.text}>{card.text}</Text>
                            </View>
                        </ImageBackground>
                        </View>
                    )}
                    />
             )}
           

            <View style={styles.buttons}>
                <PrimaryButton title="Balra" onPress={swipeLeft} />
                <PrimaryButton title="Jobbra" onPress={swipeRight} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    swiperContainer: {
        flex: 1,
        zIndex: 0, 
    },
    buttons: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        zIndex: 10,
    },
    card: {
        overflow: "hidden",
        backgroundColor: "fff",
        width: "100%",
        height: "75%",
        borderRadius: 12,
        zIndex: 999
  },

  image: {
    flex: 1,
    justifyContent: "flex-end",
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },

  text: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
});

