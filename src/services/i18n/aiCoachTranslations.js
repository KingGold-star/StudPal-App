// src/services/i18n/aiCoachTranslations.js
// Multilingual Suggestion Chips, Quick Prompts, and Localized AI Responses
import { normalizeLanguageCode } from './i18nService.js';

export const SUGGESTION_CHIPS_BY_LANG = {
  "en": [
    {
      "label": "Explain",
      "sub": "a topic",
      "mode": "explainer",
      "query": "Help me understand a concept step by step."
    },
    {
      "label": "Help me",
      "sub": "study",
      "mode": "explainer",
      "query": "Help me create a study plan for my upcoming exams."
    },
    {
      "label": "Create",
      "sub": "a quiz",
      "mode": "quiz",
      "query": "Generate a practice quiz to test my knowledge."
    }
  ],
  "es": [
    {
      "label": "Explicar",
      "sub": "un tema",
      "mode": "explainer",
      "query": "Ayúdame a entender un concepto paso a paso."
    },
    {
      "label": "Ayúdame",
      "sub": "a estudiar",
      "mode": "explainer",
      "query": "Ayúdame a crear un plan de estudio para mis exámenes."
    },
    {
      "label": "Crear",
      "sub": "un test",
      "mode": "quiz",
      "query": "Genera un cuestionario de práctica para evaluar mis conocimientos."
    }
  ],
  "fr": [
    {
      "label": "Expliquer",
      "sub": "un sujet",
      "mode": "explainer",
      "query": "Aide-moi à comprendre un concept étape par étape."
    },
    {
      "label": "Aide-moi",
      "sub": "à réviser",
      "mode": "explainer",
      "query": "Aide-moi à élaborer un planning de révision pour mes examens."
    },
    {
      "label": "Créer",
      "sub": "un quiz",
      "mode": "quiz",
      "query": "Génère un quiz d'entraînement pour tester mes connaissances."
    }
  ],
  "de": [
    {
      "label": "Erkläre",
      "sub": "ein Thema",
      "mode": "explainer",
      "query": "Hilf mir, ein Konzept Schritt für Schritt zu verstehen."
    },
    {
      "label": "Hilf mir",
      "sub": "beim Lernen",
      "mode": "explainer",
      "query": "Erstelle mir einen strukturierten Lernplan für anstehende Klausuren."
    },
    {
      "label": "Erstelle",
      "sub": "ein Quiz",
      "mode": "quiz",
      "query": "Generiere ein Übungsquiz zur Überprüfung meines Wissens."
    }
  ],
  "pt": [
    {
      "label": "Explicar",
      "sub": "um tópico",
      "mode": "explainer",
      "query": "Ajude-me a entender um conceito passo a passo."
    },
    {
      "label": "Ajude-me",
      "sub": "a estudar",
      "mode": "explainer",
      "query": "Ajude-me a criar um cronograma de estudos para os exames."
    },
    {
      "label": "Criar",
      "sub": "um quiz",
      "mode": "quiz",
      "query": "Gere um questionário prático para testar meus conhecimentos."
    }
  ],
  "it": [
    {
      "label": "Spiega",
      "sub": "un tema",
      "mode": "explainer",
      "query": "Aiutami a comprendere un concetto passo dopo passo."
    },
    {
      "label": "Aiutami",
      "sub": "a studiare",
      "mode": "explainer",
      "query": "Aiutami a creare un piano di studio per i prossimi esami."
    },
    {
      "label": "Crea",
      "sub": "un quiz",
      "mode": "quiz",
      "query": "Genera un quiz di prova per verificare le mie conoscenze."
    }
  ],
  "zh": [
    {
      "label": "概念精讲",
      "sub": "知识点剖析",
      "mode": "explainer",
      "query": "请循序渐进地为我讲解一个重难点概念。"
    },
    {
      "label": "备考规划",
      "sub": "定制学习计划",
      "mode": "explainer",
      "query": "请帮我制定一份高效的期末备考冲刺计划。"
    },
    {
      "label": "生成测验",
      "sub": "快速自测巩固",
      "mode": "quiz",
      "query": "请为我出一组自测题目来检验掌握程度。"
    }
  ],
  "ja": [
    {
      "label": "トピック解説",
      "sub": "概念の理解",
      "mode": "explainer",
      "query": "重要概念をステップバイステップで分かりやすく教えてください。"
    },
    {
      "label": "学習サポート",
      "sub": "計画づくり",
      "mode": "explainer",
      "query": "試験に向けた効率的な学習計画の作成をサポートしてください。"
    },
    {
      "label": "クイズ作成",
      "sub": "実力確認",
      "mode": "quiz",
      "query": "理解度をテストするための練習クイズを生成してください。"
    }
  ],
  "ko": [
    {
      "label": "개념 설명",
      "sub": "단계별 이해",
      "mode": "explainer",
      "query": "어려운 핵심 개념을 단계별로 쉽게 설명해주세요."
    },
    {
      "label": "학습 계획",
      "sub": "시험 대비",
      "mode": "explainer",
      "query": "다가오는 시험을 위한 맞춤형 학습 계획을 세워주세요."
    },
    {
      "label": "퀴즈 생성",
      "sub": "실력 테스트",
      "mode": "quiz",
      "query": "이해도를 점검할 수 있는 연습 퀴즈를 만들어주세요."
    }
  ],
  "ar": [
    {
      "label": "شرح فكرة",
      "sub": "خطوة بخطوة",
      "mode": "explainer",
      "query": "ساعدني في فهم مفهوم دراسي بطريقة مبسطة وتدريجية."
    },
    {
      "label": "خطة دراسية",
      "sub": "للامتحانات",
      "mode": "explainer",
      "query": "ساعدني في إعداد جدول مراجعة منظم للاختبارات القادمة."
    },
    {
      "label": "إنشاء اختبار",
      "sub": "لقياس الفهم",
      "mode": "quiz",
      "query": "أنشئ لي اختباراً تدريبياً لقياس مدى استيعابي للمادة."
    }
  ],
  "ru": [
    {
      "label": "Объяснить",
      "sub": "сложную тему",
      "mode": "explainer",
      "query": "Помоги мне пошагово разобраться в сложном понятии."
    },
    {
      "label": "Помощь",
      "sub": "в учебе",
      "mode": "explainer",
      "query": "Помоги составить эффективный план подготовки к экзаменам."
    },
    {
      "label": "Создать",
      "sub": "мини-тест",
      "mode": "quiz",
      "query": "Сгенерируй проверочный тест для закрепления материала."
    }
  ],
  "hi": [
    {
      "label": "समझाएं",
      "sub": "कोई विषय",
      "mode": "explainer",
      "query": "कठिन अवधारणा को चरणबद्ध तरीके से समझने में मेरी मदद करें।"
    },
    {
      "label": "अध्ययन योजना",
      "sub": "तैयारी करें",
      "mode": "explainer",
      "query": "मेरी आगामी परीक्षाओं के लिए एक अध्ययन योजना बनाने में मदद करें।"
    },
    {
      "label": "क्विज़ बनाएं",
      "sub": "ज्ञान परखें",
      "mode": "quiz",
      "query": "मेरे ज्ञान का परीक्षण करने के लिए एक अभ्यास क्विज़ तैयार करें।"
    }
  ]
};
export const PROMPT_CHIPS_BY_LANG = {
  "en": [
    {
      "label": "Integration by Parts",
      "mode": "explainer",
      "query": "Explain Integration by Parts step-by-step with an example."
    },
    {
      "label": "Quiz on Newton's Laws",
      "mode": "quiz",
      "query": "Generate a 3-question adaptive quiz on Newton's Laws of Motion."
    },
    {
      "label": "Organic Chemistry Summary",
      "mode": "summarizer",
      "query": "Summarize reaction mechanisms for organic chemistry."
    },
    {
      "label": "Data Structures Big-O",
      "mode": "explainer",
      "query": "Explain Big-O time complexity for Binary Search Trees."
    }
  ],
  "es": [
    {
      "label": "Integración por Partes",
      "mode": "explainer",
      "query": "Explica la integración por partes paso a paso con un ejemplo."
    },
    {
      "label": "Test Leyes de Newton",
      "mode": "quiz",
      "query": "Genera un cuestionario de 3 preguntas sobre las Leyes de Newton."
    },
    {
      "label": "Resumen Química Orgánica",
      "mode": "summarizer",
      "query": "Resume los mecanismos de reacción en química orgánica."
    },
    {
      "label": "Estructuras de Datos Big-O",
      "mode": "explainer",
      "query": "Explica la complejidad temporal Big-O para árboles binarios."
    }
  ],
  "fr": [
    {
      "label": "Intégration par Parties",
      "mode": "explainer",
      "query": "Explique l'intégration par parties étape par étape avec un exemple."
    },
    {
      "label": "Quiz Lois de Newton",
      "mode": "quiz",
      "query": "Génère un quiz de 3 questions sur les lois du mouvement de Newton."
    },
    {
      "label": "Synthèse Chimie Organique",
      "mode": "summarizer",
      "query": "Résume les mécanismes réactionnels de chimie organique."
    },
    {
      "label": "Complexité Big-O en Informatique",
      "mode": "explainer",
      "query": "Explique la complexité temporelle Big-O des arbres de recherche binaire."
    }
  ],
  "de": [
    {
      "label": "Partielle Integration",
      "mode": "explainer",
      "query": "Erkläre partielle Integration Schritt für Schritt anhand eines Beispiels."
    },
    {
      "label": "Quiz zu Newtons Gesetzen",
      "mode": "quiz",
      "query": "Erstelle ein 3-Fragen-Quiz zu den Newtonschen Bewegungsgesetzen."
    },
    {
      "label": "Zusammenfassung Organische Chemie",
      "mode": "summarizer",
      "query": "Fasse die wichtigsten Reaktionsmechanismen der organischen Chemie zusammen."
    },
    {
      "label": "Datenstrukturen & Big-O",
      "mode": "explainer",
      "query": "Erkläre die Big-O-Zeitkomplexität für binäre Suchbäume."
    }
  ],
  "pt": [
    {
      "label": "Integração por Partes",
      "mode": "explainer",
      "query": "Explique a integração por partes passo a passo com um exemplo."
    },
    {
      "label": "Quiz Leis de Newton",
      "mode": "quiz",
      "query": "Gere um quiz de 3 perguntas sobre as Leis de Newton."
    },
    {
      "label": "Resumo Química Orgânica",
      "mode": "summarizer",
      "query": "Resuma os mecanismos de reação da química orgânica."
    },
    {
      "label": "Estruturas de Dados Big-O",
      "mode": "explainer",
      "query": "Explique a complexidade de tempo Big-O para árvores binárias de busca."
    }
  ],
  "it": [
    {
      "label": "Integrazione per Parti",
      "mode": "explainer",
      "query": "Spiega l'integrazione per parti passo dopo passo con un esempio."
    },
    {
      "label": "Quiz Leggi di Newton",
      "mode": "quiz",
      "query": "Genera un quiz di 3 domande sulle leggi del moto di Newton."
    },
    {
      "label": "Riassunto Chimica Organica",
      "mode": "summarizer",
      "query": "Riassumi i meccanismi di reazione della chimica organica."
    },
    {
      "label": "Strutture Dati Big-O",
      "mode": "explainer",
      "query": "Spiega la complessità temporale Big-O per alberi binari di ricerca."
    }
  ],
  "zh": [
    {
      "label": "分部积分法推导",
      "mode": "explainer",
      "query": "请通过典型例题循序渐进地解析分部积分法的计算技巧。"
    },
    {
      "label": "牛顿运动定律自测",
      "mode": "quiz",
      "query": "生成 3 道关于牛顿运动定律的高频考点测试题。"
    },
    {
      "label": "有机化学反应机理总结",
      "mode": "summarizer",
      "query": "总结归纳有机化学核心亲核与亲电反应机理。"
    },
    {
      "label": "数据结构与时间复杂度",
      "mode": "explainer",
      "query": "详细解析二叉搜索树（BST）的时间复杂度与 Big-O 分析。"
    }
  ],
  "ja": [
    {
      "label": "部分積分法の解法",
      "mode": "explainer",
      "query": "具体例を交えて部分積分法の手順をステップごとに分かりやすく解説してください。"
    },
    {
      "label": "ニュートンの運動方程式クイズ",
      "mode": "quiz",
      "query": "ニュートンの運動の法則に関する3問の実力テストを作成してください。"
    },
    {
      "label": "有機化学反応機構まとめ",
      "mode": "summarizer",
      "query": "有機化学における主要な求核・求電子反応機構を要約してください。"
    },
    {
      "label": "二分探索木の計算量",
      "mode": "explainer",
      "query": "二分探索木における Big-O 時間計算量の仕組みを解説してください。"
    }
  ],
  "ko": [
    {
      "label": "부분적분법 개념 정복",
      "mode": "explainer",
      "query": "예제를 들어 부분적분법 공식을 단계별로 상세히 설명해주세요."
    },
    {
      "label": "뉴턴의 운동법칙 퀴즈",
      "mode": "quiz",
      "query": "뉴턴의 운동 법칙에 관한 핵심 3문항 퀴즈를 출제해주세요."
    },
    {
      "label": "유기화학 반응 메커니즘 요약",
      "mode": "summarizer",
      "query": "유기화학의 주요 친핵체 치환 및 제거 반응 메커니즘을 요약해주세요."
    },
    {
      "label": "자료구조 Big-O 시간복잡도",
      "mode": "explainer",
      "query": "이진 탐색 트리(BST)의 Big-O 시간 복잡도를 명쾌하게 설명해주세요."
    }
  ],
  "ar": [
    {
      "label": "التكامل بالتجزئة مع أمثلة",
      "mode": "explainer",
      "query": "اشرح لي طريقة التكامل بالتجزئة خطوة بخطوة مع مثال توضيحي."
    },
    {
      "label": "اختبار قوانين نيوتن للحركة",
      "mode": "quiz",
      "query": "أنشئ اختباراً قصيراً من 3 أسئلة حول قوانين نيوتن للحركة."
    },
    {
      "label": "ملخص آليات الكيمياء العضوية",
      "mode": "summarizer",
      "query": "لخص أهم آليات التفاعل في الكيمياء العضوية (SN1 و SN2)."
    },
    {
      "label": "هياكل البيانات وتعقيد Big-O",
      "mode": "explainer",
      "query": "اشرح التعقيد الزمني Big-O لأشجار البحث الثنائية."
    }
  ],
  "ru": [
    {
      "label": "Интегрирование по частям",
      "mode": "explainer",
      "query": "Объясни пошагово интегрирование по частям на наглядном примере."
    },
    {
      "label": "Тест: Законы Ньютона",
      "mode": "quiz",
      "query": "Составь проверочный тест из 3 вопросов по законам механики Ньютона."
    },
    {
      "label": "Конспект органической химии",
      "mode": "summarizer",
      "query": "Кратко структурируй основные механизмы реакций органической химии."
    },
    {
      "label": "Структуры данных и сложность",
      "mode": "explainer",
      "query": "Объясни временную сложность Big-O для бинарных деревьев поиска."
    }
  ],
  "hi": [
    {
      "label": "खंडशः समाकलन (Integration by Parts)",
      "mode": "explainer",
      "query": "उदाहरण के साथ खंडशः समाकलन को चरण-दर-चरण समझाएं।"
    },
    {
      "label": "न्यूटन के गति नियम क्विज़",
      "mode": "quiz",
      "query": "न्यूटन के गति के नियमों पर 3 प्रश्नों की एक क्विज़ तैयार करें।"
    },
    {
      "label": "कार्बनिक रसायन सारांश",
      "mode": "summarizer",
      "query": "कार्बनिक रसायन विज्ञान के प्रमुख अभिक्रिया तंत्रों का सारांश दें।"
    },
    {
      "label": "डेटा संरचनाएं और Big-O",
      "mode": "explainer",
      "query": "बाइनरी सर्च ट्री के लिए Big-O समय जटिलता की व्याख्या करें।"
    }
  ]
};
export const AI_RESPONSE_INTROS = {
  "en": {
    "calculus": "Here is the fundamental formulation and analytical breakdown:",
    "physics": "Fundamental physical laws, vector relationships, and core formulation:",
    "chemistry": "Reaction mechanism, transition states, and analytical pathway:",
    "general": "Here is the core concept and structured formulation for \"{text}\":",
    "quiz": "Adaptive practice quiz for \"{text}\":\n\nQuestion 1 of 3: What is the primary principle governing this concept?",
    "summary": "Key Study Summary:\n\n• Core Theme: Key conceptual definitions & theorems extracted.\n• Active Recall: 3 flashcards queued for spaced repetition.",
    "actions": [
      "Save to SRS Flashcards",
      "Create Study Note"
    ]
  },
  "es": {
    "calculus": "📐 Análisis de Cálculo: Dominemos los principios fundamentales paso a paso:",
    "physics": "⚛️ Física y Electromagnetismo: Explorando leyes fundamentales y relaciones vectoriales:",
    "chemistry": "🧫 Mecanismos de Química Orgánica: Nucleófilos, electrófilos y rutas de reacción:",
    "general": "✨ ¡Excelente pregunta! Aquí tienes el desglose paso a paso para dominar \"{text}\":",
    "quiz": "📝 ¡Cuestionario adaptativo de IA generado para \"{text}\"!\n\nPregunta 1 de 3: ¿Cuál es el principio fundamental que rige este concepto?",
    "summary": "📌 Resumen Ejecutivo de Estudio:\n\n• Tema Principal: Definiciones y teoremas clave extraídos.\n• Recuerdo Activo: 3 tarjetas añadidas para repetición espaciada.",
    "actions": [
      "Guardar en Tarjetas SRS",
      "Crear Nota de Estudio"
    ]
  },
  "fr": {
    "calculus": "📐 Analyse de Calcul Intégral : Maîtrisons les principes fondamentaux étape par étape :",
    "physics": "⚛️ Physique et Électromagnétisme : Exploration des lois fondamentales et des vecteurs :",
    "chemistry": "🧫 Mécanismes de Chimie Organique : Nucléophiles, électrophiles et voies de réaction :",
    "general": "✨ Excellente question ! Voici la décomposition méthodique pour maîtriser \"{text}\" :",
    "quiz": "📝 Quiz adaptatif généré pour \"{text}\" !\n\nQuestion 1 sur 3 : Quel est le principe physique régissant ce concept ?",
    "summary": "📌 Fiche de Synthèse d'Étude :\n\n• Thème central : Définitions et théorèmes clés extraits.\n• Rappel Actif : 3 flashcards ajoutées pour la répétition espacée.",
    "actions": [
      "Enregistrer dans les Flashcards",
      "Créer une Fiche de Révision"
    ]
  },
  "de": {
    "calculus": "📐 Analysis & Integralrechnung: Schrittweise Erklärung der Grundprinzipien:",
    "physics": "⚛️ Physik & Elektromagnetismus: Fundamentale Naturgesetze und vektorielle Beziehungen:",
    "chemistry": "🧫 Organische Chemie: Nucleophile, Elektrophile und Reaktionswege im Detail:",
    "general": "✨ Hervorragende Frage! Hier ist die systematische Aufschlüsselung zu \"{text}\":",
    "quiz": "📝 Adaptives KI-Quiz erstellt für \"{text}\"!\n\nFrage 1 von 3: Welches physikalische Grundprinzip bestimmt dieses Konzept?",
    "summary": "📌 Kompakte Lernzusammenfassung:\n\n• Kernkonzept: Wichtigste Definitionen und Theoreme extrahiert.\n• Aktives Erinnern: 3 Karteikarten zur Wiederholung vorgemerkt.",
    "actions": [
      "In Karteikarten speichern",
      "Lernnotiz erstellen"
    ]
  },
  "pt": {
    "calculus": "📐 Análise de Cálculo: Vamos dominar os princípios fundamentais passo a passo:",
    "physics": "⚛️ Física e Eletromagnetismo: Explorando leis fundamentais e campos vetoriais:",
    "chemistry": "🧫 Mecanismos de Química Orgânica: Nucleófilos, eletrófilos e caminhos reacionais:",
    "general": "✨ Excelente pergunta! Aqui está o passo a passo completo para dominar \"{text}\":",
    "quiz": "📝 Quiz adaptativo gerado para \"{text}\"!\n\nPergunta 1 de 3: Qual é o princípio fundamental que rege este conceito?",
    "summary": "📌 Resumo Estruturado de Estudo:\n\n• Conceito Central: Principais definições e teoremas sintetizados.\n• Memorização Ativa: 3 flashcards enfileirados para repetição espaçada.",
    "actions": [
      "Salvar nos Flashcards SRS",
      "Criar Nota de Estudo"
    ]
  },
  "it": {
    "calculus": "📐 Analisi e Calcolo: Padroneggiamo i principi fondamentali passo dopo passo:",
    "physics": "⚛️ Fisica ed Elettromagnetismo: Esplorazione delle leggi fondamentali e relazioni vettoriali:",
    "chemistry": "🧫 Meccanismi di Chimica Organica: Nucleofili, elettrofili e vie di reazione:",
    "general": "✨ Ottima domanda! Ecco la spiegazione passo dopo passo per padroneggiare \"{text}\":",
    "quiz": "📝 Quiz adattivo generato per \"{text}\"!\n\nDomanda 1 di 3: Qual è il principio fondamentale che governa questo concetto?",
    "summary": "📌 Sintesi di Studio:\n\n• Concetto Chiave: Definizioni e teoremi principali estratti.\n• Ripasso Attivo: 3 flashcard salvate per la ripetizione spaziata.",
    "actions": [
      "Salva nelle Flashcard SRS",
      "Crea Nota di Studio"
    ]
  },
  "zh": {
    "calculus": "📐 微积分深度推导：循序渐进掌握核心定理与解题技巧：",
    "physics": "⚛️ 物理与电磁学精讲：探究物理定律、矢量场与能量转化：",
    "chemistry": "🧫 有机化学机理剖析：亲核试剂、亲电中心与协同反应路径：",
    "general": "✨ 非常好的提问！以下是关于“{text}”的结构化精讲，帮助你彻底掌握：",
    "quiz": "📝 已为你智能生成关于“{text}”的自测测验！\n\n第 1 题（共 3 题）：决定该概念的核心物理机制是什么？",
    "summary": "📌 核心知识点精要总结：\n\n• 核心主题：重点定义、公式与推导步骤提炼。\n• 主动回忆：已加入 3 张卡片至间隔复习队列中。",
    "actions": [
      "存入 SRS 记忆卡片",
      "创建学习笔记"
    ]
  },
  "ja": {
    "calculus": "📐 微積分の徹底解説：基本定理と計算テクニックを段階的にマスターしましょう：",
    "physics": "⚛️ 物理と電磁気学：基本法則とベクトル場の相互作用を整理：",
    "chemistry": "🧫 有機化学反応機構：求核剤、求電子剤、および素反応プロセスの解析：",
    "general": "✨ 素晴らしい質問です！「{text}」について完全に理解できるよう体系的に解説します：",
    "quiz": "📝 「{text}」に関する理解度確認クイズを生成しました！\n\n第1問（全3問）：この概念を支配する最も重要な物理法則は何ですか？",
    "summary": "📌 学習要点サマリー：\n\n• 主要テーマ：重要定義と公式を抽出。\n• アクティブリコール：3枚のフラッシュカードを復習キューに追加しました。",
    "actions": [
      "SRSフラッシュカードに保存",
      "学習ノートを作成"
    ]
  },
  "ko": {
    "calculus": "📐 미적분학 핵심 정리: 기본 원리와 단계별 유도 과정을 완벽히 마스터해봅시다:",
    "physics": "⚛️ 물리학 및 전자기학: 핵심 법칙과 벡터장 상호작용 정리:",
    "chemistry": "🧫 유기화학 반응 메커니즘: 친핵체, 친전자체 및 단계별 반응 경로 분석:",
    "general": "✨ 훌륭한 질문입니다! \"{text}\"을(를) 완벽히 이해할 수 있도록 단계별로 정리해 드립니다:",
    "quiz": "📝 \"{text}\" 맞춤형 연습 퀴즈가 생성되었습니다!\n\n1번 문제 (총 3문제): 이 개념을 지배하는 핵심 원리는 무엇인가요?",
    "summary": "📌 핵심 개념 요약 노트:\n\n• 핵심 주제: 중요 정의 및 주요 정리 추출 완료.\n• 적극적 회상: 3장의 카드가 간격 반복 복습 큐에 추가되었습니다.",
    "actions": [
      "SRS 플래시카드에 저장",
      "학습 노트 생성"
    ]
  },
  "ar": {
    "calculus": "📐 تحليل التفاضل والتكامل: لنتقن المبادئ الأساسية خطوة بخطوة:",
    "physics": "⚛️ الفيزياء والكهرومغناطيسية: استكشاف القوانين الفيزيائية والعلاقات المتجهة:",
    "chemistry": "🧫 آليات الكيمياء العضوية: النيكليوفيلات والإلكتروفيلات ومسارات التفاعل:",
    "general": "✨ سؤال ممتاز! إليك الشرح المنهجي خطوة بخطوة لإتقان \"{text}\":",
    "quiz": "📝 تم إنشاء اختبار تدريبي حول \"{text}\"!\n\nالسؤال 1 من 3: ما هو المبدأ الفيزيائي الأساسي الذي يحكم هذا المفهوم؟",
    "summary": "📌 ملخص دراسي مركز:\n\n• الفكرة الجوهرية: استخراج أهم التعريفات والنظريات.\n• التذكر النشط: تم حفظ 3 بطاقات في قائمة التكرار المتباعد.",
    "actions": [
      "حفظ في بطاقات SRS",
      "إنشاء ملاحظة دراسية"
    ]
  },
  "ru": {
    "calculus": "📐 Разбор математического анализа: освоим базовые теоремы шаг за шагом:",
    "physics": "⚛️ Физика и электромагнетизм: фундаментальные законы и векторные поля:",
    "chemistry": "🧫 Механизмы органической химии: нуклеофилы, электрофилы и пути реакций:",
    "general": "✨ Отличный вопрос! Вот пошаговый разбор темы \"{text}\" для полного понимания:",
    "quiz": "📝 Сгенерирован проверочный тест по теме \"{text}\"!\n\nВопрос 1 из 3: Каков основополагающий физический закон, управляющий данным явлением?",
    "summary": "📌 Конспект ключевых положений:\n\n• Главная тема: выделены ключевые формулы и определения.\n• Активное повторение: 3 карточки добавлены в очередь интервальных повторений.",
    "actions": [
      "Сохранить в карточки SRS",
      "Создать конспект"
    ]
  },
  "hi": {
    "calculus": "📐 कलन (Calculus) का विश्लेषण: आइए मुख्य सिद्धांतों को चरण-दर-चरण समझें:",
    "physics": "⚛️ भौतिकी और विद्युत चुंबकत्व: मौलिक नियमों और सदिश संबंधों की खोज:",
    "chemistry": "🧫 कार्बनिक रसायन विज्ञान तंत्र: न्यूक्लियोफाइल, इलेक्ट्रोफाइल और अभिक्रिया मार्ग:",
    "general": "✨ बहुत बढ़िया प्रश्न! \"{text}\" पर पूर्ण पकड़ बनाने के लिए यह चरण-दर-चरण विवरण है:",
    "quiz": "📝 \"{text}\" के लिए अभ्यास क्विज़ तैयार की गई है!\n\nप्रश्न 1 (कुल 3): इस अवधारणा को संचालित करने वाला प्राथमिक सिद्धांत क्या है?",
    "summary": "📌 अध्ययन सारांश नोट:\n\n• मुख्य विषय: महत्वपूर्ण परिभाषाएं और सूत्र संकलित।\n• सक्रिय स्मरण: अंतराल पुनरावृत्ति के लिए 3 फ्लैशकार्ड सहेजे गए।",
    "actions": [
      "SRS फ्लैशकार्ड में सहेजें",
      "अध्ययन नोट बनाएं"
    ]
  }
};

export function getLocalizedSuggestionChips(lang = 'en') {
  const norm = normalizeLanguageCode(lang);
  return SUGGESTION_CHIPS_BY_LANG[norm] || SUGGESTION_CHIPS_BY_LANG.en;
}

export function getLocalizedPromptChips(lang = 'en') {
  const norm = normalizeLanguageCode(lang);
  return PROMPT_CHIPS_BY_LANG[norm] || PROMPT_CHIPS_BY_LANG.en;
}

export function getLocalizedAiResponse({ text = '', activeMode = 'explainer', lang = 'en', persona = 'encouraging', depth = 'balanced' }) {
  const normLang = normalizeLanguageCode(lang);
  const intros = AI_RESPONSE_INTROS[normLang] || AI_RESPONSE_INTROS.en;
  const query = text.toLowerCase();

  let introText = intros.general.replace('{text}', text || 'Topic');
  let latexFormula = "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}";
  let steps = [
    { number: '01', title: normLang === 'es' ? 'Resumen Conceptual' : normLang === 'fr' ? 'Aperçu Conceptuel' : normLang === 'zh' ? '概念核心概述' : 'Conceptual Overview', content: normLang === 'es' ? 'Desglosa los principios básicos en pasos intuitivos.' : normLang === 'zh' ? '将核心原理分解为清晰的逻辑推导步骤。' : 'Break down core principles into intuitive steps.' },
    { number: '02', title: normLang === 'es' ? 'Solución Analítica' : normLang === 'fr' ? 'Résolution Analytique' : normLang === 'zh' ? '规范演算推导' : 'Analytical Solution', content: normLang === 'es' ? 'Aplica la fórmula para evaluar el resultado exacto.' : normLang === 'zh' ? '代入已知变量求解准确结果。' : 'Apply formula to evaluate the exact outcome.' }
  ];
  let example = normLang === 'es' ? 'Consejo: Ponte a prueba con el recuerdo activo tras leer.' : normLang === 'zh' ? '高效技巧：阅读后立即闭目自述进行主动回忆。' : 'Practice Tip: Test yourself with active recall after reading.';

  if (query.includes('calculus') || query.includes('cálculo') || query.includes('calcul') || query.includes('微积分') || query.includes('微分') || query.includes('integral')) {
    introText = intros.calculus;
    latexFormula = "\\int u \\, dv = u v - \\int v \\, du";
    steps = [
      { number: '01', title: normLang === 'es' ? 'Teorema Fundamental del Cálculo' : normLang === 'zh' ? '微积分基本定理' : 'Fundamental Theorem of Calculus', content: normLang === 'es' ? 'La derivación y la integración son operaciones inversas.' : normLang === 'zh' ? '微分与积分互为逆运算。' : 'Differentiation and integration are inverse operations.' },
      { number: '02', title: normLang === 'es' ? 'Técnicas de Integración (LIATE)' : normLang === 'zh' ? '分部积分法 (LIATE)' : 'Integration Techniques (LIATE)', content: normLang === 'es' ? 'Usa la regla LIATE para elegir u y dv de manera óptima.' : normLang === 'zh' ? '根据 LIATE 顺序优化选取 u 和 dv。' : 'Use LIATE order to choose u and dv optimally.' }
    ];
    example = normLang === 'es' ? 'Verificación: Deriva tu resultado para comprobar tu antiderivada.' : normLang === 'zh' ? '验算技巧：对求出的原函数再次求导以检验答案。' : 'Pro-tip: Differentiate your result to verify your anti-derivative.';
  } else if (query.includes('physics') || query.includes('física') || query.includes('physique') || query.includes('physik') || query.includes('物理')) {
    introText = intros.physics;
    latexFormula = "\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}";
    steps = [
      { number: '01', title: normLang === 'es' ? 'Ley de Faraday y FEM' : normLang === 'zh' ? '法拉第定律与感应电动势' : 'Faraday Induction & EMF', content: normLang === 'es' ? 'La FEM inducida es proporcional a la tasa de cambio de flujo magnético.' : normLang === 'zh' ? '感应电动势与磁通量变化率成正比。' : 'Induced EMF equals negative rate of change of magnetic flux.' },
      { number: '02', title: normLang === 'es' ? 'Conservación de Energía (Lenz)' : normLang === 'zh' ? '楞次定律与能量守恒' : 'Conservation of Energy (Lenz)', content: normLang === 'es' ? 'El sentido de la corriente inducida se opone a la causa que la produce.' : normLang === 'zh' ? '感应电流的方向总是阻碍磁通量的改变。' : 'Induced current opposes change in magnetic flux.' }
    ];
    example = normLang === 'es' ? 'Fórmula clave: Flujo = B · A · cos(θ).' : normLang === 'zh' ? '关键公式：磁通量 Φ = B · A · cos(θ)。' : 'Key formula: Magnetic Flux = B · A · cos(θ).';
  } else if (query.includes('chemistry') || query.includes('química') || query.includes('chimie') || query.includes('化学')) {
    introText = intros.chemistry;
    latexFormula = "\\text{R-X} + \\text{Nu}^- \\rightarrow \\text{R-Nu} + \\text{X}^-";
    steps = [
      { number: '01', title: normLang === 'es' ? 'Rutas SN1 vs SN2' : normLang === 'zh' ? 'SN1 与 SN2 反应路径对比' : 'SN1 vs SN2 Pathways', content: normLang === 'es' ? 'SN2 ocurre en 1 paso con inversión; SN1 tiene 2 pasos con carbocatión intermediario.' : normLang === 'zh' ? 'SN2 协同一步完成且构型翻转；SN1 两步进行且经由碳正离子。' : 'SN2 is 1-step with inversion; SN1 is 2-step via carbocation.' },
      { number: '02', title: normLang === 'es' ? 'Efecto del Disolvente' : normLang === 'zh' ? '溶剂效应' : 'Solvent Effects', content: normLang === 'es' ? 'Disolventes apróticos polares favorecen SN2 al no solvatar fuertemente el nucleófilo.' : normLang === 'zh' ? '极性非质子溶剂不溶剂化亲核试剂，从而显著加速 SN2。' : 'Polar aprotic solvents accelerate SN2.' }
    ];
  } else if (activeMode === 'quiz' || query.includes('quiz') || query.includes('test') || query.includes('cuestionario')) {
    introText = intros.quiz.replace('{text}', text || 'Topic');
  } else if (activeMode === 'summarizer' || query.includes('summar') || query.includes('resum')) {
    introText = intros.summary;
  }

  return {
    text: introText,
    latexFormula,
    steps,
    example,
    suggestedActions: intros.actions || ['Save to SRS Flashcards', 'Create Study Note']
  };
}
