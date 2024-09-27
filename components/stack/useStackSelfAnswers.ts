import { SupabaseKey, SupabaseUrl } from "@/constants/constants";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { UserProfile } from "@/contexts/UserContext";
import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

const supabase = createClient(SupabaseUrl, SupabaseKey);

export type StackSelfAnswer = {
    id: number;
    user: UserProfile;
    questionId: number;
    optionIndex: number;
    quizId: number;
    createdAt: string;
};

interface UseStackSelfAnswersResult {
    selfAnswers: StackSelfAnswer[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export const useStackSelfAnswers = (
    currentUserId?: number,
): UseStackSelfAnswersResult => {
    const { isDev } = useEnvironment();
    const [selfAnswers, setSelfAnswers] = useState<StackSelfAnswer[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const selfAnswerTable = isDev ? "_SelfAnswer_dev" : "SelfAnswer";
    const friendAnswerTable = isDev ? "_FriendAnswer_dev" : "FriendAnswer";
    const friendRelationTable = isDev
        ? "_FriendRelation_dev"
        : "FriendRelation";
    const userTable = isDev ? "_User_dev" : "User";

    const fetchSelfAnswers = useCallback(async () => {
        if (!currentUserId) {
            setError(new Error("Current user ID is required"));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // First, get the questionIds that are in FriendAnswer
            const { data: friendAnswers, error: friendAnswerError } =
                await supabase
                    .from(friendAnswerTable)
                    .select("*")
                    .eq("friendId", currentUserId);

            if (friendAnswerError) throw friendAnswerError;

            // Get the friend IDs
            const { data: friendIds, error: friendError } = await supabase
                .from(friendRelationTable)
                .select("userId1, userId2")
                .or(`userId1.eq.${currentUserId},userId2.eq.${currentUserId}`);

            if (friendError) throw friendError;

            // Extract all friend IDs
            const allFriendIds = friendIds.flatMap((relation) =>
                [relation.userId1, relation.userId2].filter((id) =>
                    id !== currentUserId
                )
            );

            // Now fetch the self answers
            const { data, error } = await supabase
                .from(selfAnswerTable)
                .select(`
                    id,
                    questionId,
                    optionIndex,
                    quizId,
                    createdAt,
                    userId
                `)
                .filter("deleted", "eq", false)
                .filter("userId", "in", `(${allFriendIds.join(",")})`)
                .order("createdAt", { ascending: false });

            if (error) throw error;

            const { data: users, error: userError } = await supabase.from(
                userTable,
            ).select("*").in("id", allFriendIds);

            const withUsers = data.map((item) => ({
                ...item,
                user: (users as UserProfile[]).find((user) =>
                    user.id === item.userId
                ),
            }));

            const friendAnswerFilteredData = withUsers.filter((item) =>
                !friendAnswers.find((friendAnswer) =>
                    friendAnswer.questionId === item.questionId &&
                    friendAnswer.selfId === item.user?.id
                )
            );

            const formattedData = (friendAnswerFilteredData || []).map(
                (item) => ({
                    id: item.id,
                    user: item.user,
                    questionId: item.questionId,
                    optionIndex: item.optionIndex,
                    quizId: item.quizId,
                    createdAt: item.createdAt,
                }),
            ).filter((item) => item.user) as StackSelfAnswer[];

            setSelfAnswers(formattedData);
        } catch (err) {
            console.log(err);
            setError(
                err instanceof Error
                    ? err
                    : new Error("An unknown error occurred"),
            );
        } finally {
            setLoading(false);
        }
    }, [
        currentUserId,
        selfAnswerTable,
        friendAnswerTable,
        friendRelationTable,
    ]);

    useEffect(() => {
        fetchSelfAnswers();
    }, [fetchSelfAnswers]);

    return { selfAnswers, loading, error, refetch: fetchSelfAnswers };
};
