import React, { useState } from "react";
import preparationContent from "../../../data/preparation_content.json";
import "./PreparationPage.css";

interface Section {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: string[];
}

export function PreparationPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections: Section[] = [
    {
      id: "sermon",
      title: "🎤 Sermão de 5 Minutos",
      icon: "🎤",
      description: "Modelo simples para pregar no concílio",
      content: preparationContent.sermon || [],
    },
    {
      id: "personal_questions",
      title: "❓ Perguntas Pessoais",
      icon: "❓",
      description: "25 perguntas sobre vida espiritual e ministério",
      content: preparationContent.personal_questions || [],
    },
    {
      id: "controversial_topics",
      title: "⚠️ Temas Polêmicos",
      icon: "⚠️",
      description: "Como responder sobre temas teológicos delicados",
      content: preparationContent.controversial_topics || [],
    },
    {
      id: "conversion_experience",
      title: "✝️ Experiência de Conversão",
      icon: "✝️",
      description: "Sua história de conversão e chamado",
      content: preparationContent.conversion_experience || [],
    },
    {
      id: "difficult_questions",
      title: "🤔 Perguntas Difíceis",
      icon: "🤔",
      description: "Respostas para perguntas mais desafiadoras",
      content: preparationContent.difficult_questions || [],
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="preparation-page">
      <div className="preparation-header">
        <h1>📚 Preparação para o Concílio</h1>
        <p>Conteúdo essencial para sua ordenação pastoral</p>
      </div>

      <div className="preparation-sections">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`preparation-card ${expandedSection === section.id ? "expanded" : ""}`}
          >
            <button
              className="preparation-card-header"
              onClick={() => toggleSection(section.id)}
            >
              <div className="preparation-card-title-section">
                <h2 className="preparation-card-title">{section.title}</h2>
                <p className="preparation-card-description">{section.description}</p>
              </div>
              <span className="preparation-expand-icon">
                {expandedSection === section.id ? "▼" : "▶"}
              </span>
            </button>

            {expandedSection === section.id && (
              <div className="preparation-card-content">
                {section.content.length > 0 ? (
                  section.content.map((item, index) => (
                    <div key={index} className="preparation-content-item">
                      <p>{item}</p>
                    </div>
                  ))
                ) : (
                  <p>Conteúdo não disponível</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
