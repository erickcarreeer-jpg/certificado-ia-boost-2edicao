export type Question = {
  id: number
  text: string
  options: { key: string; text: string }[]
  answer: string
}

export const questions: Question[] = [
  {
    id: 1,
    text: "Em equipes modernas de produto, Design Engineering ajuda a reduzir gargalos entre UX, UI e desenvolvimento, permitindo ciclos mais rápidos de criação e validação. Qual é um dos principais benefícios desse modelo de atuação?",
    options: [
      { key: "A", text: "Aumentar a dependência de múltiplas aprovações antes de validar ideias" },
      { key: "B", text: "Reduzir a fricção dos handoffs entre design e front-end" },
      { key: "C", text: "Eliminar completamente a necessidade de pesquisa com usuários" },
      { key: "D", text: "Substituir totalmente desenvolvedores front-end em projetos complexos" },
      { key: "E", text: "Fazer o designer atuar apenas na camada visual final" },
    ],
    answer: "B",
  },
  {
    id: 2,
    text: "Designers que conseguem criar protótipos navegáveis e validar hipóteses rapidamente tendem a aprender mais cedo o que funciona ou não para o usuário. Como isso impacta o processo de produto?",
    options: [
      { key: "A", text: "Aumenta o tempo necessário para validar hipóteses" },
      { key: "B", text: "Diminui a necessidade de testes com usuários reais" },
      { key: "C", text: "Encurta o ciclo de aprendizado e acelera decisões" },
      { key: "D", text: "Faz o produto depender menos de métricas reais" },
      { key: "E", text: "Reduz a importância da etapa de descoberta" },
    ],
    answer: "C",
  },
  {
    id: 3,
    text: "Em Design Engineering, o designer ganha maior autonomia para experimentar diferentes abordagens antes de consolidar uma solução final. Qual benefício estratégico isso traz para o produto?",
    options: [
      { key: "A", text: "Permite testar mais iterações antes da implementação final" },
      { key: "B", text: "Elimina completamente o trabalho colaborativo com engenharia" },
      { key: "C", text: "Reduz a necessidade de alinhamento entre áreas" },
      { key: "D", text: "Faz o designer focar apenas em animações avançadas" },
      { key: "E", text: "Garante que a primeira solução criada será a definitiva" },
    ],
    answer: "A",
  },
  {
    id: 4,
    text: "Em UI Design, composição visual ajuda a organizar elementos para melhorar clareza, hierarquia e entendimento da interface pelo usuário. Qual prática contribui diretamente para uma boa composição?",
    options: [
      { key: "A", text: "Utilizar todos os elementos com o mesmo peso visual" },
      { key: "B", text: "Evitar alinhamentos para deixar a tela mais criativa" },
      { key: "C", text: "Criar hierarquia visual clara entre conteúdos" },
      { key: "D", text: "Remover contraste para manter uniformidade visual" },
      { key: "E", text: "Priorizar quantidade de informação acima da legibilidade" },
    ],
    answer: "C",
  },
  {
    id: 5,
    text: "O espaço em branco é um dos recursos mais importantes na construção de interfaces modernas, legíveis e com baixa carga cognitiva. Por que ele é tão importante em UI Design?",
    options: [
      { key: "A", text: "Porque aumenta a quantidade de elementos na tela" },
      { key: "B", text: "Porque reduz clareza visual para gerar curiosidade" },
      { key: "C", text: "Porque melhora leitura, foco e organização visual" },
      { key: "D", text: "Porque substitui completamente tipografia e contraste" },
      { key: "E", text: "Porque elimina a necessidade de hierarquia visual" },
    ],
    answer: "C",
  },
  {
    id: 6,
    text: "Muitas marcas utilizam ilustrações autênticas e consistentes para fortalecer reconhecimento visual e diferenciação no mercado digital. Qual é o principal impacto estratégico dessa prática?",
    options: [
      { key: "A", text: "Tornar a interface mais genérica e reutilizável" },
      { key: "B", text: "Reduzir identidade visual para facilitar mudanças futuras" },
      { key: "C", text: "Fortalecer reconhecimento e percepção de marca" },
      { key: "D", text: "Eliminar a necessidade de direção de arte" },
      { key: "E", text: "Substituir completamente fotografias e tipografia" },
    ],
    answer: "C",
  },
  {
    id: 7,
    text: "O Key Visual define padrões visuais importantes para manter coerência estética entre páginas, campanhas e experiências digitais da marca. Qual é a principal função do Key Visual?",
    options: [
      { key: "A", text: "Permitir que cada tela siga um estilo diferente" },
      { key: "B", text: "Garantir consistência visual e identidade da marca" },
      { key: "C", text: "Substituir completamente o Design System" },
      { key: "D", text: "Reduzir o uso de imagens e elementos gráficos" },
      { key: "E", text: "Limitar a criatividade de designers e ilustradores" },
    ],
    answer: "B",
  },
  {
    id: 8,
    text: "Em processos modernos de UI Design, referências visuais, rabiscos e protótipos ajudam equipes a explorar ideias antes da execução visual final. Qual abordagem representa melhor um processo saudável?",
    options: [
      { key: "A", text: "Inventar tudo do zero para evitar influência externa" },
      { key: "B", text: "Criar somente a interface final sem etapas intermediárias" },
      { key: "C", text: "Buscar referências, prototipar e usar IA como apoio" },
      { key: "D", text: "Usar IA para substituir completamente o processo criativo" },
      { key: "E", text: "Ignorar wireframes para acelerar a entrega visual" },
    ],
    answer: "C",
  },
  {
    id: 9,
    text: "Em Design Systems modernos, Harnesses ajudam equipes a validar componentes em diferentes estados, cenários e integrações técnicas. Qual é um dos principais objetivos de um Harness?",
    options: [
      { key: "A", text: "Criar apenas documentação estática sem interação" },
      { key: "B", text: "Validar comportamento real de componentes isolados" },
      { key: "C", text: "Substituir completamente ferramentas de prototipação" },
      { key: "D", text: "Eliminar a necessidade de Design Tokens" },
      { key: "E", text: "Centralizar apenas arquivos de identidade visual" },
    ],
    answer: "B",
  },
  {
    id: 10,
    text: "Integrações MCP entre Figma, código e Storybook ajudam a sincronizar design e desenvolvimento em fluxos mais conectados e confiáveis. Qual é um benefício importante dessa integração?",
    options: [
      { key: "A", text: "Aumentar divergência entre design e front-end" },
      { key: "B", text: "Evitar reutilização de componentes compartilhados" },
      { key: "C", text: "Melhorar sincronização entre design, tokens e código" },
      { key: "D", text: "Eliminar completamente o uso do Storybook" },
      { key: "E", text: "Fazer o Design System depender apenas do Figma" },
    ],
    answer: "C",
  },
]

export function shuffleQuestions(qs: Question[]): Question[] {
  const arr = [...qs]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
