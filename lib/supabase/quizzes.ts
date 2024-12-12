import { supabase } from '@/lib/supabase';
import { Quiz, QuizQuestion } from '@/types/quiz';

export async function createQuiz(
  title: string,
  description: string,
  type: string,
  questions: QuizQuestion[],
  userId: string
) {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .insert([
        {
          title,
          description,
          type,
          questions,
          created_by: userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
}

export async function getUserQuizzes(userId: string) {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        profiles:created_by (
          username
        )
      `)
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user quizzes:', error);
    return [];
  }
}

export async function getQuizById(quizId: string) {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        profiles:created_by (
          username
        )
      `)
      .eq('id', quizId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting quiz:', error);
    return null;
  }
}

export async function saveQuizAttempt(
  quizId: string,
  userId: string,
  score: number
) {
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert([
        {
          quiz_id: quizId,
          user_id: userId,
          score,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    throw error;
  }
}