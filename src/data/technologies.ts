import type { Language } from "../i18n/context";

export interface Technology {
  name: string;
  x: number;
  y: number;
  learning?: boolean;
  description: Record<Language, string>;
  group: Record<Language, string>;
}

export const technologies: Technology[] = [
  {
    name: "C#",
    x: 12,
    y: 19,
    group: { ru: "языки", en: "languages" },
    description: {
      ru: "Язык, на котором пишут приложения и серверы.",
      en: "A language for building applications and servers.",
    },
  },
  {
    name: "Go",
    x: 39,
    y: 12,
    group: { ru: "языки", en: "languages" },
    description: {
      ru: "Простой и быстрый язык для серверных сервисов.",
      en: "A simple, fast language for server-side services.",
    },
  },
  {
    name: "Rust",
    x: 76,
    y: 17,
    learning: true,
    group: { ru: "на горизонте", en: "on the horizon" },
    description: {
      ru: "Быстрый язык, который помогает избегать ошибок с памятью. Хочу изучить.",
      en: "A fast language that helps prevent memory errors. On my learning list.",
    },
  },
  {
    name: "React",
    x: 20,
    y: 41,
    group: { ru: "интерфейсы", en: "interfaces" },
    description: {
      ru: "Помогает собирать интерфейсы из небольших, переиспользуемых частей.",
      en: "Helps build interfaces from small, reusable pieces.",
    },
  },
  {
    name: "Vue",
    x: 55,
    y: 36,
    group: { ru: "интерфейсы", en: "interfaces" },
    description: {
      ru: "Инструмент для создания удобных и живых веб-интерфейсов.",
      en: "A tool for building friendly, interactive web interfaces.",
    },
  },
  {
    name: "Redis",
    x: 83,
    y: 43,
    group: { ru: "данные", en: "data" },
    description: {
      ru: "Хранит часто нужные данные в памяти, чтобы получать их очень быстро.",
      en: "Keeps frequently used data in memory for very fast access.",
    },
  },
  {
    name: "PostgreSQL",
    x: 26,
    y: 64,
    group: { ru: "данные", en: "data" },
    description: {
      ru: "База данных: надёжно хранит и находит информацию.",
      en: "A database that reliably stores and finds information.",
    },
  },
  {
    name: "Docker",
    x: 63,
    y: 63,
    group: { ru: "инфраструктура", en: "infrastructure" },
    description: {
      ru: "Упаковывает приложение со всем нужным, чтобы оно работало одинаково везде.",
      en: "Packages an app with what it needs, so it runs consistently anywhere.",
    },
  },
  {
    name: "Kafka",
    x: 88,
    y: 70,
    group: { ru: "связь сервисов", en: "connecting services" },
    description: {
      ru: "Передаёт потоки событий между частями большой системы.",
      en: "Moves streams of events between parts of a larger system.",
    },
  },
  {
    name: "Microservices",
    x: 18,
    y: 89,
    group: { ru: "архитектура", en: "architecture" },
    description: {
      ru: "Большое приложение из маленьких самостоятельных сервисов.",
      en: "A large application made of small, independent services.",
    },
  },
  {
    name: "System Design",
    x: 64,
    y: 88,
    group: { ru: "архитектура", en: "architecture" },
    description: {
      ru: "Продумываю, как части системы работают вместе и справляются с нагрузкой.",
      en: "Planning how parts of a system work together and handle growth.",
    },
  },
];

export const connections = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 4],
  [2, 5],
  [3, 4],
  [4, 5],
  [3, 6],
  [4, 7],
  [5, 8],
  [6, 7],
  [7, 8],
  [6, 9],
  [7, 10],
  [9, 10],
];
