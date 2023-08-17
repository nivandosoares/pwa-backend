const mockClassrooms = [
  {
    courseName: "Engenharia Civil",
    location: "Bloco A, Sala 101",
    semester: "Quarto",
    resources: [
      { name: "Projetor", available: true },
      { name: "Microfone", available: true },
    ],
    features: ["Ar-condicionado", "Quadro Branco"],
    alerts_manutencao: [],
  },
  {
    courseName: "Administração",
    location: "Bloco B, Sala 201",
    semester: "Terceiro",
    resources: [
      { name: "Projetor", available: false },
      { name: "Microfone", available: true },
    ],
    features: ["Sistema de Som"],
    alerts_manutencao: [],
  },
  {
    courseName: "Medicina",
    location: "Bloco C, Sala 301",
    semester: "Quinto",
    resources: [
      { name: "Projetor", available: true },
      { name: "Microfone", available: false },
    ],
    features: ["Ar-condicionado", "Quadro Interativo"],
    alerts_manutencao: [],
  },
  {
    courseName: "Direito",
    location: "Bloco A, Sala 102",
    semester: "Primeiro",
    resources: [
      { name: "Projetor", available: true },
      { name: "Microfone", available: true },
    ],
    features: ["Ar-condicionado"],
    alerts_manutencao: [],
  },
  {
    courseName: "Psicologia",
    location: "Bloco B, Sala 202",
    semester: "Segundo",
    resources: [
      { name: "Projetor", available: false },
      { name: "Microfone", available: false },
    ],
    features: ["Quadro Branco"],
    alerts_manutencao: [
      { resource: "Projetor", descricao: "Lâmpada queimada" },
    ],
  },
];

module.exports = mockClassrooms;
