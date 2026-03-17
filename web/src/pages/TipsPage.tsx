import { useState } from 'react'
import './TipsPage.css'

interface Tip {
  id: string
  title: string
  icon: string
  content: string[]
}

export default function TipsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const tips: Tip[] = [
    {
      id: 'study',
      title: '📚 Dicas de Estudo',
      icon: '📚',
      content: [
        'Estude pelo menos 1 hora por dia. Se não for possível, dedique 30 minutos.',
        'Examine os textos bíblicos correspondentes a cada pergunta.',
        'Participe de alguns Concílios quando for possível.',
        'Peça a seu Pastor ou conhecido para fazer um simulado.',
        'Durma cedo na noite anterior ao Concílio.',
      ],
    },
    {
      id: 'posture',
      title: '🎯 Guia de Postura no Concílio',
      icon: '🎯',
      content: [
        'Responda sempre com a Bíblia, mesmo que de forma breve.',
        'Seja objetivo e evite respostas longas.',
        'Estrutura ideal: afirmação → texto bíblico → explicação curta.',
        'Não seja combativo, mesmo quando discordar.',
        'Demonstre equilíbrio doutrinário, evitando extremos.',
        'Quando não souber, não invente. Admita honestamente.',
        'Demonstre coração pastoral: caráter, amor pela igreja e compromisso com missões.',
      ],
    },
    {
      id: 'responses',
      title: '💬 Como Responder Bem',
      icon: '💬',
      content: [
        'Abra a Bíblia e mostre o texto, capítulo e versículo.',
        'Use frases como: "Entendo que a Escritura ensina..." ou "Creio que a melhor interpretação bíblica é..."',
        'Responda apenas o que está sendo perguntado.',
        'Se não entender a pergunta, peça para repetir ou reformular.',
        'Não demonstre irritação ou impaciência.',
        'Não faça perguntas ao Examinador.',
        'Não critique pastores ou igrejas em suas respostas.',
      ],
    },
    {
      id: 'behaviors',
      title: '✔️ 10 Atitudes que Impressionam',
      icon: '✔️',
      content: [
        'Respostas bíblicas fundamentadas',
        'Simplicidade e clareza na comunicação',
        'Humildade e disposição para aprender',
        'Amor genuíno pela Igreja',
        'Visão missionária',
        'Equilíbrio doutrinário',
        'Vida devocional evidente',
        'Respeito aos pastores',
        'Compromisso com a Palavra de Deus',
        'Cumprimente todos com sorriso e aperto de mão',
      ],
    },
    {
      id: 'avoid',
      title: '❌ O que Evitar',
      icon: '❌',
      content: [
        'Não ouvir a pergunta inteira',
        'Não responder de forma defensiva',
        'Não inventar respostas',
        'Não demonstrar insegurança doutrinária',
        'Não ignorar a autoridade da Igreja local',
        'Não fazer gracejos ou demonstrar convencimento',
        'Não se alongar nas respostas',
        'Não demonstrar irritação ou impaciência',
      ],
    },
    {
      id: 'summary',
      title: '📖 Resumo da Fé Batista',
      icon: '📖',
      content: [
        '"Creio que a Bíblia é a Palavra de Deus, que Jesus Cristo é o único Salvador, que a salvação é pela graça mediante a fé e que a missão da Igreja é fazer discípulos até que Cristo volte."',
        'Referência: Mateus 28.19–20',
      ],
    },
  ]

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  return (
    <div className="tips-container">
      <div className="tips-content">
        {/* Header */}
        <section className="tips-header">
          <h1>💡 Dicas para o Exame</h1>
          <p>Guia completo para se preparar e se sair bem no Concílio</p>
        </section>

        {/* Tips Grid */}
        <div className="tips-grid">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className={`tip-card ${expandedSection === tip.id ? 'expanded' : ''}`}
              onClick={() => toggleSection(tip.id)}
            >
              <div className="tip-header">
                <h2 className="tip-title">{tip.title}</h2>
                <span className="tip-icon">
                  {expandedSection === tip.id ? '▼' : '▶'}
                </span>
              </div>

              {expandedSection === tip.id && (
                <div className="tip-content">
                  {tip.content.map((item, index) => (
                    <div key={index} className="tip-item">
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
