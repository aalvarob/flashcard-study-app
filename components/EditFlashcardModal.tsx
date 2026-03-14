import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useColors } from "@/hooks/use-colors";

interface EditFlashcardModalProps {
  visible: boolean;
  flashcard?: {
    id: number;
    question: string;
    answer: string;
    area: string;
  };
  onClose: () => void;
  onSave: (data: { question: string; answer: string; area: string }) => Promise<void>;
  isLoading?: boolean;
}

export function EditFlashcardModal({
  visible,
  flashcard,
  onClose,
  onSave,
  isLoading = false,
}: EditFlashcardModalProps) {
  const colors = useColors();
  const [question, setQuestion] = useState(flashcard?.question || "");
  const [answer, setAnswer] = useState(flashcard?.answer || "");
  const [area, setArea] = useState(flashcard?.area || "");
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (flashcard) {
      setQuestion(flashcard.question);
      setAnswer(flashcard.answer);
      setArea(flashcard.area);
      setError(null);
    }
  }, [flashcard, visible]);

  const handleSave = async () => {
    if (!question.trim()) {
      setError("Pergunta é obrigatória");
      return;
    }
    if (!answer.trim()) {
      setError("Resposta é obrigatória");
      return;
    }
    if (!area.trim()) {
      setError("Área é obrigatória");
      return;
    }

    try {
      await onSave({
        question: question.trim(),
        answer: answer.trim(),
        area: area.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: colors.foreground },
              ]}
            >
              {flashcard ? "Editar Card" : "Novo Card"}
            </Text>
            <Pressable
              onPress={onClose}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={{ color: colors.primary, fontSize: 24 }}>
                ✕
              </Text>
            </Pressable>
          </View>

          {error && (
            <View
              style={[
                styles.errorBox,
                { backgroundColor: colors.error },
              ]}
            >
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text
              style={[
                styles.label,
                { color: colors.foreground },
              ]}
            >
              Pergunta *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder="Digite a pergunta"
              placeholderTextColor={colors.muted}
              value={question}
              onChangeText={setQuestion}
              multiline
              editable={!isLoading}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text
              style={[
                styles.label,
                { color: colors.foreground },
              ]}
            >
              Resposta *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
                styles.largeInput,
              ]}
              placeholder="Digite a resposta"
              placeholderTextColor={colors.muted}
              value={answer}
              onChangeText={setAnswer}
              multiline
              editable={!isLoading}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text
              style={[
                styles.label,
                { color: colors.foreground },
              ]}
            >
              Área *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder="Digite a área (ex: escrituras_sagradas)"
              placeholderTextColor={colors.muted}
              value={area}
              onChangeText={setArea}
              editable={!isLoading}
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: colors.foreground },
                ]}
              >
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.button,
                styles.saveButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed || isLoading ? 0.7 : 1,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {flashcard ? "Atualizar" : "Criar"}
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 44,
  },
  largeInput: {
    minHeight: 120,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  saveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
