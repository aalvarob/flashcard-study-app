# Design do Aplicativo - Simulado Concílio Flashcards

## Conceito Visual
Aplicativo de estudo com flashcards para preparação ao Concílio. Visual limpo, sério e espiritual, com tons de azul profundo e dourado para remeter à seriedade teológica.

## Paleta de Cores
- **Primary**: `#1E3A5F` (Azul marinho profundo) — autoridade e seriedade
- **Accent / Tint**: `#C9A84C` (Dourado) — destaque e importância
- **Background**: `#F8F6F0` (Creme claro) / `#0F1E30` (Azul escuro no dark)
- **Surface**: `#FFFFFF` (Branco) / `#1A2E45` (Azul médio no dark)
- **Success**: `#27AE60` (Verde) — acerto
- **Error**: `#E74C3C` (Vermelho) — erro
- **Muted**: `#7F8C8D` / `#A0AEC0`

## Telas do Aplicativo

### 1. Tela Principal — Estudo (index)
- **Conteúdo**: Card central grande com animação de virar (flip 3D)
  - Frente: Pergunta com ícone de interrogação
  - Verso: Resposta com ícone de lâmpada
- **Controles**: Botão "Virar Card" centralizado abaixo do card
- **Ações de resultado**: Botões "Acertei ✓" (verde) e "Errei ✗" (vermelho) — aparecem após virar o card
- **Navegação**: Setas para card anterior / próximo
- **Indicador de progresso**: "Card X de Y" e barra de progresso
- **Contador no topo**: Acertos e Erros em tempo real

### 2. Tela de Lista de Cards (cards)
- **Conteúdo**: Lista de todos os flashcards com FlatList
- **Cada item**: Pergunta resumida, área (Teologia/Eclesiologia), toggle de habilitar/desabilitar
- **Filtros**: Todos / Habilitados / Desabilitados
- **Indicador visual**: Cards desabilitados aparecem com opacidade reduzida

### 3. Tela de Estatísticas (stats)
- **Conteúdo**: Resumo geral de desempenho
  - Total de acertos e erros
  - Percentual de aproveitamento
  - Progresso por área (Teologia / Eclesiologia)
  - Botão de resetar estatísticas

## Fluxo Principal do Usuário
1. Usuário abre o app → vê o card atual com a pergunta
2. Toca no card ou no botão "Virar" → card vira com animação 3D
3. Vê a resposta → toca em "Acertei" ou "Errei"
4. Contadores no topo atualizam instantaneamente
5. Avança para o próximo card automaticamente
6. Pode navegar para a lista para habilitar/desabilitar cards
7. Pode ver estatísticas detalhadas na aba de stats

## Componentes Chave
- `FlashCard`: Card com animação flip 3D usando react-native-reanimated
- `ScoreCounter`: Contador de acertos/erros no header
- `CardListItem`: Item da lista com toggle de habilitar/desabilitar
- `ProgressBar`: Barra de progresso da sessão

## Estrutura de Dados
```typescript
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  area: 'teologia' | 'eclesiologia';
  enabled: boolean;
  correctCount: number;
  wrongCount: number;
}
```
