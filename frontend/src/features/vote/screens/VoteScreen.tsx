import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, Alert } from "react-native";
import { QuestionDto } from "../../../shared/types/generated";
import { getQuestionsByBank } from "../../question/services/question.service";
import { SwipeCard } from "../components/swipeCard/SwipeCard"; 
import { getSocket } from "@/src/socket/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { AppNavigation, AppStackParamList } from "@/src/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Check, LogOut, X } from "lucide-react-native";
import { LeaveRoomButton } from "@/src/shared/components/LeaveRoomButton";

type VoteScreenProps = NativeStackScreenProps<AppStackParamList, "Vote">;

export function VoteScreen({ route }: VoteScreenProps) {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [index, setIndex] = useState(0);
  const [trigger, setTrigger] = useState<"left" | "right" | null>(null);
  const [over, setOver] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const bankId = route.params.bankId;
  const roomId = route.params.roomId;

  const user = useSelector((state: RootState) => state.auth.user);

  const navigation = useNavigation<AppNavigation>();

  const handleLeaveRoom = () => {
    if (!user) return;

    getSocket()?.emit("leaveRoom", { roomId });
    navigation.replace("Tabs", {
      screen: "VoteStack",
      params: { screen: "JoinLobby" },
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LeaveRoomButton onPress={handleLeaveRoom} />,
    });
  }, [navigation]);

  useEffect(() => {
    const handleGameEnded = ({ voteId }: { voteId: number }) => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: "Tabs",
              state: {
                routes: [
                  {
                    name: "VoteStatStack",
                    state: {
                      routes: [
                        {
                          name: "ShowVotes",
                        },
                        {
                          name: "VoteStat",
                          params: { voteId },
                        },
                      ],
                      index: 1,
                    },
                  },
                ],
                index: 0,
              },
            },
          ],
        }),
      );
    };

    getQuestionsByBank(bankId).then((q) => {
      q.forEach((item) => {
        if (item.imageUrl) {
          Image.prefetch(item.imageUrl);
        }
      });

      setQuestions(q);
    });



    getSocket()?.on("gameEnded", handleGameEnded);

    return () => {
      getSocket()?.off("gameEnded", handleGameEnded);
    };
  }, []);

  const handleSwipe = (dir: "left" | "right") => {
    if (!user) return;

    getSocket()?.emit("vote", {
      roomId: roomId,
      questionId: questions[index].id,
      answer: dir == "right",
    });

    if (index === questions.length - 1) {
      setOver(true);
    }

    if (index < questions.length - 1) {
      setIndex((p) => p + 1);
    }

    setIsSwiping(false);
  };

  useEffect(() => {
    if (!trigger) return;
    const t = setTimeout(() => setTrigger(null), 200);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!questions.length) return null;

  return (
    <View style={styles.container}>
      {!over &&
        questions.map((item, i) => {
          const isActive = i === index;

          return (
            <SwipeCard
              key={item.id}
              item={item}
              index={i}
              activeIndex={index}
              onSwipe={handleSwipe}
              triggerSwipe={isActive ? trigger : null}
            />
          );
        })}

      {over && (
        <Text style={{ paddingBottom: 100, fontSize: 18 }}>
          Waiting for other users.
        </Text>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity
          disabled={over}
          style={styles.button}
          onPress={() => {
            if (over || isSwiping) return;
            setIsSwiping(true);
            setTrigger("left");
          }}
        >
          <X size={35} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={over}
          style={styles.button}
          onPress={() => {
            if (over || isSwiping) return;
            setIsSwiping(true);
            setTrigger("right");
          }}
        >
          <Check size={35} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  buttons: {
    position: "absolute",
    bottom: 70,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,

    elevation: 5,
  },
});
