import { useState } from 'react'
import PDFViewer from '../components/PDFViewer'
import './DocumentsPage.css'

interface Document {
  id: string
  title: string
  icon: string
  description: string
  pdfUrl?: string
  content: string[]
}

export default function DocumentsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [selectedPDF, setSelectedPDF] = useState<{ url: string; title: string } | null>(null)

  const documents: Document[] = [
    {
      id: 'pacto',
      title: '📜 Pacto das Igrejas Batistas',
      icon: '📜',
      description: 'Compromissos e princípios fundamentais das igrejas batistas',
      pdfUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663434646570/qYHqepsPcHkndvbS.docx',
      content: [
        'Tendo sido levados pelo Espírito Santo a aceitar a Jesus Cristo como único e suficiente Salvador, e batizados, sob profissão de fé, em nome do Pai, do Filho e do Espírito Santo, decidimo-nos, unânimes, como um corpo em Cristo, firmar, solene e alegremente, na presença de Deus e desta congregação, o seguinte Pacto:',
        'Comprometemo-nos a, auxiliados pelo Espírito Santo, andar sempre unidos no amor cristão; trabalhar para que esta igreja cresça no conhecimento da Palavra, na santidade, no conforto mútuo e na espiritualidade; manter os seus cultos, suas doutrinas, suas ordenanças e sua disciplina; contribuir liberalmente para o sustento do ministério, para as despesas da igreja, para o auxílio dos pobres e para a propaganda do evangelho em todas as nações.',
        'Comprometemo-nos, também, a manter uma devoção particular; a evitar e condenar todos os vícios; a educar religiosamente nossos filhos; a procurar a salvação de todo o mundo, a começar dos nossos parentes, amigos e conhecidos; a ser corretos em nossas transações, fiéis em nossos compromissos, exemplares em nossa conduta e ser diligentes nos trabalhos seculares; evitar a detração, a difamação e a ira, sempre e em tudo visando à expansão do reino do nosso Salvador.',
        'Além disso, comprometemo-nos a ter cuidado uns dos outros; a lembrarmo-nos uns dos outros nas orações; ajudar mutuamente nas enfermidades e necessidades; cultivar relações francas e a delicadeza no trato; estar prontos a perdoar as ofensas, buscando, quando possível, a paz com todos os homens.',
        'Finalmente, nos comprometemos a, quando sairmos desta localidade para outra, nos unirmos a uma outra igreja da mesma fé e ordem, em que possamos observar os princípios da Palavra de Deus e o espírito deste Pacto.',
        'O Senhor nos abençoe e nos proteja para que sejamos fiéis e sinceros até a morte.',
      ],
    },
    {
      id: 'declaracao',
      title: '📖 Declaração Doutrinária da CBB',
      icon: '📖',
      description: 'Fundamentos doutrinários da Convenção Batista Brasileira',
      content: [
        'Documento que apresenta os princípios doutrinários fundamentais da Convenção Batista Brasileira, incluindo crenças sobre Deus, Jesus Cristo, Salvação e a Igreja.',
      ],
    },
    {
      id: 'historia',
      title: '📚 História dos Batistas',
      icon: '📚',
      description: 'Origem e desenvolvimento do movimento batista no mundo e no Brasil',
      content: [
        'Documento que narra a história do movimento batista, desde suas origens na Europa até sua expansão no Brasil e em Alagoas.',
      ],
    },
    {
      id: 'principios',
      title: '⚖️ Princípios Batistas',
      icon: '⚖️',
      description: 'Princípios fundamentais que caracterizam a fé e prática batista',
      content: [
        'Documento que detalha os princípios batistas como autonomia da igreja local, liberdade de consciência, separação entre Igreja e Estado, e competência da alma.',
      ],
    },
    {
      id: 'codigo',
      title: '⚖️ Código de Ética',
      icon: '⚖️',
      description: 'Normas éticas e morais para ministros batistas',
      pdfUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663434646570/DJRqaGKzdhZvFyfe.pdf',
      content: [
        'Documento que estabelece as normas éticas e morais esperadas de ministros batistas, incluindo conduta pessoal, familiar e ministerial.',
      ],
    },
  ]

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  return (
    <>
      {selectedPDF && (
        <PDFViewer
          pdfUrl={selectedPDF.url}
          title={selectedPDF.title}
          onClose={() => setSelectedPDF(null)}
        />
      )}
      <div className="documents-container">
        <div className="documents-content">
          {/* Header */}
          <section className="documents-header">
            <h1>📚 Documentos Importantes</h1>
            <p>Referências doutrinária e histórica para estudo</p>
          </section>

          {/* Documents Grid */}
          <div className="documents-grid">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`document-card ${expandedSection === doc.id ? 'expanded' : ''}`}
              >
                <div
                  className="document-header"
                  onClick={() => toggleSection(doc.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="document-title-section">
                    <h2 className="document-title">{doc.title}</h2>
                    <p className="document-description">{doc.description}</p>
                  </div>
                  <div className="document-header-actions">
                    {doc.pdfUrl && (
                      <button
                        className="document-pdf-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedPDF({ url: doc.pdfUrl!, title: doc.title })
                        }}
                        title="Visualizar PDF"
                      >
                        📄
                      </button>
                    )}
                    <span className="document-icon">
                      {expandedSection === doc.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {expandedSection === doc.id && (
                  <div className="document-content">
                    {doc.content.map((item, index) => (
                      <div key={index} className="document-item">
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
    </>
  )
}
