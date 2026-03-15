# TODO - Flashcard Study App

- [x] Gerar logo do aplicativo
- [x] Configurar tema de cores (azul marinho e dourado)
- [x] Criar dados dos flashcards (perguntas e respostas do simulado)
- [x] Criar contexto global de estado (flashcards, acertos, erros)
- [x] Persistência com AsyncStorage
- [x] Implementar tela principal de estudo com card flip 3D
- [x] Implementar botões Acertei / Errei
- [x] Implementar contadores de acertos e erros em tempo real
- [x] Implementar navegação entre cards (anterior / próximo)
- [x] Implementar tela de lista de cards com toggle habilitar/desabilitar
- [x] Implementar filtros na lista (Todos / Habilitados / Desabilitados)
- [x] Implementar tela de estatísticas
- [x] Configurar tab bar com ícones
- [x] Atualizar app.config.ts com nome e logo
- [x] Adicionar contadores para "Não Sei" e "Não Lembro"
- [x] Adicionar campos notSureCount e notRememberCount ao Flashcard
- [x] Atualizar tela principal com 4 botões de resultado
- [x] Atualizar tela de estatísticas com novos contadores
- [x] Atualizar tela de cards com novos contadores
- [x] Escrever testes para novos contadores
- [x] Salvar checkpoint final
- [x] Desabilitar automaticamente cards após marcar como "Acertei"
- [x] Atualizar testes para validar auto-disable
- [x] Aumentar tamanho dos textos de pergunta e resposta
- [x] Gerar logo Batista
- [x] Integrar logo Batista no header do app
- [x] Integrar logo da Convenção Batista de Alagoas
- [x] Integrar logo da Ordem dos Pastores Batistas do Brasil
- [x] Aumentar tamanho dos textos para ocupar máximo da tela
- [x] Criar tela de configuração inicial (Setup Screen)
- [x] Adicionar campos para nome, área e quantidade de cards
- [x] Integrar configuração com o contexto de flashcards
- [x] Atualizar contexto para suportar filtros por área e quantidade
- [x] Escrever testes para a nova funcionalidade
- [x] Atualizar dados dos flashcards com novo documento (133 cards em 4 áreas)
- [x] Adicionar suporte a 4 áreas na tela de configuração
- [x] Atualizar telas de cards e estatísticas com 4 áreas
- [x] Atualizar contexto para suportar 4 áreas
- [x] Atualizar testes para validar 4 áreas
- [x] Criar tela de resultado final com estatísticas
- [x] Integrar lógica de detecção de conclusão de cards
- [x] Adicionar botão para retornar à tela inicial
- [x] Atualizar dados dos flashcards com documento revisado V2 (129 cards em 8 áreas)
- [x] Reorganizar flashcards com as 26 áreas específicas
- [x] Atualizar tipos de áreas em todos os arquivos
- [x] Atualizar telas de cards, stats e setup com as 26 áreas
- [x] Atualizar contexto para suportar 26 áreas
- [x] Atualizar testes para validar 26 áreas
- [x] Corrigir distribuição conforme informado (132 cards finais)
- [x] Adicionar suporte a múltiplas áreas selecionadas no contexto
- [x] Atualizar tela de configuração com checkboxes para múltiplas áreas
- [x] Atualizar lógica de filtro de cards para múltiplas áreas
- [x] Atualizar testes para validar múltiplas áreas
- [x] Reorganizar botões para "Não Sei" e "Não Lembro" aparecerem antes de virar o card
- [x] Ajustar layout para botões "Não Sei" e "Não Lembro" não ficarem encobrindo pelo card
- [x] Reduzir tamanho do card na vertical para mostrar melhor os botões
- [x] Deslocar o card um pouco mais para baixo
- [x] Aumentar deslocamento do card para 200px (10x mais para baixo)
- [x] Ajustar deslocamento final para 150px (equilíbrio ideal)
- [x] Reduzir maxHeight do card de 35% para 30%
- [x] Corrigir visibilidade dos botões "Anterior" e "Próximo" (aumentar opacidade, adicionar background e melhorar contraste)
- [x] Implementar autenticação de administrador
- [x] Criar endpoints no servidor para CRUD de flashcards
- [x] Criar componentes de edição de cards
- [x] Criar componente de criação de novo card
- [x] Integrar edição na tela de listagem de cards (cards.tsx)
- [x] Implementar persistência de alterações no servidor
- [x] Escrever testes para funcionalidade de edição
- [x] Testar edição e criação de cards
- [x] Redirecionar para página de resultado quando não houver cards habilitados para continuar o teste
- [x] Mover botões "Errei" e "Acertei" para a parte superior da tela de teste
- [x] Diminuir tamanho do card em 20%
- [x] Mover card para cima na tela de teste
- [x] Corrigir sobreposição dos botões Anterior e Próximo sobre o card
- [x] Aumentar espaçamento entre botões "Não Sei" e "Não Lembro" e o card
- [x] Criar opção para ativar cards por área ou todos
- [x] Mostrar quantidade de cards ativados e desativados na tela de listagem de áreas
- [x] Modificar "Ativar/Desativar Todos" para funcionar apenas com áreas selecionadas
- [x] Alterar rótulo "Modo de Seleção" para "Área da Teologia"


## Novas Funcionalidades em Desenvolvimento

### Modo Offline
- [x] Criar hook `useOfflineMode` para detectar conexão
- [x] Criar fila de sincronização para sessões offline
- [x] Adicionar indicador visual de status de conexão
- [x] Sincronizar dados quando reconectar
- [ ] Implementar cache com IndexedDB (futuro)

### Algoritmo SRS (Spaced Repetition System)
- [x] Criar modelo de dados para rastreamento SRS
- [x] Implementar cálculo de próxima revisão baseado em acertos/erros
- [x] Criar fila de priorização de cards
- [ ] Adicionar opção de "Revisão Inteligente" no setup (futuro)
- [ ] Integrar com página de estudo (futuro)

### Estatísticas Detalhadas
- [x] Criar componente de gráficos com Recharts
- [x] Criar gráfico de progresso por área
- [x] Criar gráfico de tempo de estudo
- [x] Criar gráfico de evolução de acertos
- [x] Adicionar filtros por período (7 dias, 30 dias, tudo)
- [ ] Integrar com página de estatísticas (futuro)
