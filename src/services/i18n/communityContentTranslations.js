// src/services/i18n/communityContentTranslations.js
// Provides full 12-language localized community groups, posts, challenges, and rules
import { normalizeLanguageCode } from './i18nService.js';

export const COMMUNITY_GROUPS_TRANSLATIONS = {
  "grp-0": {
    "en": {
      "name": "StudPal Global Hub",
      "subject": "All Subjects",
      "category": "Trending",
      "description": "The official StudPal community for announcements, tips, and general chat."
    },
    "es": {
      "name": "Centro Global StudPal",
      "subject": "Todas las Asignaturas",
      "category": "Tendencias",
      "description": "La comunidad oficial de StudPal para anuncios, consejos y charla general."
    },
    "fr": {
      "name": "Pôle Mondial StudPal",
      "subject": "Toutes Matières",
      "category": "Tendances",
      "description": "La communauté officielle de StudPal pour les annonces, conseils et discussions."
    },
    "de": {
      "name": "StudPal Globale Zentrale",
      "subject": "Alle Fächer",
      "category": "Trends",
      "description": "Die offizielle StudPal-Community für Ankündigungen, Lerntipps und Austausch."
    },
    "pt": {
      "name": "Hub Global StudPal",
      "subject": "Todas as Matérias",
      "category": "Em Alta",
      "description": "A comunidade oficial do StudPal para novidades, dicas e bate-papo."
    },
    "it": {
      "name": "Hub Globale StudPal",
      "subject": "Tutte le Materie",
      "category": "Tendenze",
      "description": "La community ufficiale di StudPal per annunci, consigli e discussioni."
    },
    "zh": {
      "name": "StudPal 全球学习广场",
      "subject": "全学科",
      "category": "热门趋势",
      "description": "StudPal 官方社群，提供最新公告、学习技巧与日常交流。"
    },
    "ja": {
      "name": "StudPal グローバルハブ",
      "subject": "全科目",
      "category": "トレンド",
      "description": "StudPal公式コミュニティ。お知らせ、学習のヒント、交流の場。"
    },
    "ko": {
      "name": "StudPal 글로벌 허브",
      "subject": "모든 과목",
      "category": "인기",
      "description": "공지사항, 학습 팁 및 자유로운 소통을 위한 공식 StudPal 커뮤니티."
    },
    "ar": {
      "name": "ملتقى StudPal العالمي",
      "subject": "جميع المواد",
      "category": "الشائع",
      "description": "مجتمع StudPal الرسمي للإعلانات والنصائح والمحادثات العامة."
    },
    "ru": {
      "name": "Глобальный хаб StudPal",
      "subject": "Все предметы",
      "category": "В тренде",
      "description": "Официальное сообщество StudPal для объявлений, советов и общения."
    },
    "hi": {
      "name": "StudPal ग्लोबल हब",
      "subject": "सभी विषय",
      "category": "ट्रेंडिंग",
      "description": "घोषणाओं, अध्ययन युक्तियों और सामान्य बातचीत के लिए आधिकारिक StudPal समुदाय।"
    }
  },
  "grp-1": {
    "en": {
      "name": "JAMB 2027 Aspirants",
      "subject": "Exam Prep",
      "category": "Exam Prep",
      "description": "Daily past questions, syllabus breakdowns, and motivation for JAMB."
    },
    "es": {
      "name": "Aspirantes JAMB 2027",
      "subject": "Prep. Exámenes",
      "category": "Prep. Exámenes",
      "description": "Preguntas de años anteriores, desglose de temarios y motivación diaria."
    },
    "fr": {
      "name": "Candidats JAMB 2027",
      "subject": "Prépa Examens",
      "category": "Prépa Examens",
      "description": "Annales quotidiennes, révision des programmes et motivation continue."
    },
    "de": {
      "name": "JAMB 2027 Prüfungsvorbereitung",
      "subject": "Prüfungsvorbereitung",
      "category": "Prüfungsvorbereitung",
      "description": "Tägliche Übungsfragen, Lehrplanübersichten und Lernmotivation."
    },
    "pt": {
      "name": "Aspirantes JAMB 2027",
      "subject": "Prep. Exames",
      "category": "Prep. Exames",
      "description": "Questões anteriores diárias, análise de currículo e motivação de estudo."
    },
    "it": {
      "name": "Candidati Esame JAMB 2027",
      "subject": "Prep. Esami",
      "category": "Prep. Esami",
      "description": "Quesiti d'esame giornalieri, schemi di studio e motivazione."
    },
    "zh": {
      "name": "JAMB 2027 备考冲刺组",
      "subject": "备考辅导",
      "category": "备考辅导",
      "description": "每日历年真题解析、考纲重难点剖析与互助打卡。"
    },
    "ja": {
      "name": "JAMB 2027 受験対策",
      "subject": "試験対策",
      "category": "試験対策",
      "description": "毎日の過去問演習、シラバス解説、モチベーション維持。"
    },
    "ko": {
      "name": "JAMB 2027 시험 대비반",
      "subject": "시험 준비",
      "category": "시험 준비",
      "description": "매일 기출문제 풀이, 출제 범위 정리 및 학습 동기 부여."
    },
    "ar": {
      "name": "طامحو اختبار JAMB 2027",
      "subject": "التحضير للاختبارات",
      "category": "التحضير للاختبارات",
      "description": "أسئلة سابقة يومية، تفكيك المناهج ودوافع مستمرة للنجاح."
    },
    "ru": {
      "name": "Подготовка к экзаменам JAMB",
      "subject": "Подготовка",
      "category": "Подготовка",
      "description": "Ежедневные тесты прошлых лет, разбор программы и мотивация."
    },
    "hi": {
      "name": "JAMB 2027 परीक्षा तैयारी",
      "subject": "परीक्षा तैयारी",
      "category": "परीक्षा तैयारी",
      "description": "दैनिक पिछले प्रश्न, पाठ्यक्रम का विवरण और अध्ययन प्रेरणा।"
    }
  },
  "grp-2": {
    "en": {
      "name": "WAEC Science Hub",
      "subject": "Sciences",
      "category": "Exam Prep",
      "description": "Physics, Chemistry, and Biology prep for WAEC."
    },
    "es": {
      "name": "Centro de Ciencias WAEC",
      "subject": "Ciencias",
      "category": "Prep. Exámenes",
      "description": "Preparación de Física, Química y Biología para WAEC."
    },
    "fr": {
      "name": "Pôle Scientifique WAEC",
      "subject": "Sciences",
      "category": "Prépa Examens",
      "description": "Préparation intensive en Physique, Chimie et Biologie."
    },
    "de": {
      "name": "WAEC Naturwissenschaften",
      "subject": "Naturwissenschaften",
      "category": "Prüfungsvorbereitung",
      "description": "Physik, Chemie und Biologie gezielt meistern."
    },
    "pt": {
      "name": "Centro de Ciências WAEC",
      "subject": "Ciências",
      "category": "Prep. Exames",
      "description": "Revisão de Física, Química e Biologia para o WAEC."
    },
    "it": {
      "name": "Centro Scienze WAEC",
      "subject": "Scienze",
      "category": "Prep. Esami",
      "description": "Preparazione in Fisica, Chimica e Biologia per WAEC."
    },
    "zh": {
      "name": "WAEC 理科学霸营",
      "subject": "理科综合",
      "category": "备考辅导",
      "description": "针对 WAEC 的物理、化学与生物全方位复习与攻关。"
    },
    "ja": {
      "name": "WAEC 理科ハブ",
      "subject": "自然科学",
      "category": "試験対策",
      "description": "WAECに向けた物理、化学、生物の集中対策。"
    },
    "ko": {
      "name": "WAEC 과학 스터디",
      "subject": "자연과학",
      "category": "시험 준비",
      "description": "WAEC 시험을 위한 물리, 화학, 생물 집중 준비반."
    },
    "ar": {
      "name": "ملتقى العلوم WAEC",
      "subject": "العلوم",
      "category": "التحضير للاختبارات",
      "description": "مذاكرة الفيزياء والكيمياء والأحياء لاختبارات WAEC."
    },
    "ru": {
      "name": "Естественные науки WAEC",
      "subject": "Естествознание",
      "category": "Подготовка",
      "description": "Подготовка по физике, химии и биологии к экзаменам."
    },
    "hi": {
      "name": "WAEC विज्ञान हब",
      "subject": "विज्ञान",
      "category": "परीक्षा तैयारी",
      "description": "WAEC के लिए भौतिकी, रसायन विज्ञान और जीव विज्ञान की तैयारी।"
    }
  },
  "grp-3": {
    "en": {
      "name": "Mathematics Problem Solvers",
      "subject": "Mathematics",
      "category": "Subjects",
      "description": "Stuck on a math problem? Drop it here and lets solve it together."
    },
    "es": {
      "name": "Resolución de Problemas Matemáticos",
      "subject": "Matemáticas",
      "category": "Asignaturas",
      "description": "¿Atascado con un problema de matemáticas? Compártelo y resolvámoslo juntos."
    },
    "fr": {
      "name": "Résolution de Problèmes de Maths",
      "subject": "Mathématiques",
      "category": "Matières",
      "description": "Bloqué sur un problème ? Posez-le ici et résolvons-le ensemble."
    },
    "de": {
      "name": "Mathematik Problemlöser",
      "subject": "Mathematik",
      "category": "Fächer",
      "description": "Schwierige Mathe-Aufgabe? Stelle sie hier ein und wir lösen sie gemeinsam."
    },
    "pt": {
      "name": "Solucionadores de Matemática",
      "subject": "Matemática",
      "category": "Matérias",
      "description": "Travou em um exercício? Envie aqui e vamos resolver juntos."
    },
    "it": {
      "name": "Risolutori di Problemi di Matematica",
      "subject": "Matematica",
      "category": "Materie",
      "description": "Bloccato su un esercizio di matematica? Condividilo e risolviamolo insieme."
    },
    "zh": {
      "name": "数学答疑解题俱乐部",
      "subject": "数学",
      "category": "专业学科",
      "description": "遇到数学难题？发布到这里，大家一起抽丝剥茧推导答案。"
    },
    "ja": {
      "name": "数学問題解決フォーラム",
      "subject": "数学",
      "category": "学科別",
      "description": "難問で行き詰まりましたか？ここに投稿して皆で一緒に解きましょう。"
    },
    "ko": {
      "name": "수학 문제 해결 스터디",
      "subject": "수학",
      "category": "과목별",
      "description": "어려운 수학 문제가 있나요? 함께 풀며 완벽히 이해해봐요."
    },
    "ar": {
      "name": "حلول مسائل الرياضيات",
      "subject": "الرياضيات",
      "category": "المواد",
      "description": "هل تواجه صعوبة في مسألة رياضية؟ اطرحها هنا ولنحلها معاً."
    },
    "ru": {
      "name": "Решение математических задач",
      "subject": "Математика",
      "category": "Предметы",
      "description": "Застряли на задаче? Публикуйте здесь, разберем решение вместе."
    },
    "hi": {
      "name": "गणित समस्या समाधानकर्ता",
      "subject": "गणित",
      "category": "विषय",
      "description": "गणित के प्रश्न में अटक गए हैं? यहाँ साझा करें और मिलकर हल करें।"
    }
  },
  "grp-4": {
    "en": {
      "name": "Deep Focus & Pomodoro Sprints",
      "subject": "Study Skills",
      "category": "Study Skills",
      "description": "Join live voice channels for silent 50/10 pomodoro study sessions."
    },
    "es": {
      "name": "Enfoque Profundo y Pomodoro",
      "subject": "Habilidades de Estudio",
      "category": "Habilidades",
      "description": "Únete a sesiones silenciosas de estudio Pomodoro 50/10."
    },
    "fr": {
      "name": "Concentration Profonde & Pomodoro",
      "subject": "Méthodes d'Étude",
      "category": "Méthodes",
      "description": "Rejoignez des sessions d'étude silencieuses Pomodoro 50/10."
    },
    "de": {
      "name": "Deep Focus & Pomodoro Sprints",
      "subject": "Lernmethoden",
      "category": "Lernmethoden",
      "description": "Stille 50/10-Pomodoro-Lernsessions für maximale Konzentration."
    },
    "pt": {
      "name": "Foco Profundo & Pomodoro",
      "subject": "Habilidades de Estudo",
      "category": "Habilidades",
      "description": "Participe de sessões silenciosas de estudo Pomodoro 50/10."
    },
    "it": {
      "name": "Deep Focus & Sprint Pomodoro",
      "subject": "Metodo di Studio",
      "category": "Metodi",
      "description": "Sessioni di studio silenziose con tecnica Pomodoro 50/10."
    },
    "zh": {
      "name": "深度专注与番茄钟自习室",
      "subject": "学习效能",
      "category": "学习技能",
      "description": "加入 50/10 番茄工作法静音自习房间，结伴保持全神贯注。"
    },
    "ja": {
      "name": "ディープフォーカス＆ポモドーロ",
      "subject": "学習スキル",
      "category": "学習スキル",
      "description": "50/10ポモドーロテクニックによる静かな集中自習セッション。"
    },
    "ko": {
      "name": "딥 포커스 & 뽀모도로 스프린트",
      "subject": "학습 스킬",
      "category": "학습 스킬",
      "description": "50분 집중/10분 휴식 뽀모도로 자습 세션에 참여하세요."
    },
    "ar": {
      "name": "التركيز العميق وجلسات بومودورو",
      "subject": "مهارات الدراسة",
      "category": "مهارات الدراسة",
      "description": "انضم إلى غرف دراسة صامتة بنظام 50/10 بومودورو للتركيز العالي."
    },
    "ru": {
      "name": "Глубокий фокус и помодоро",
      "subject": "Навыки учебы",
      "category": "Навыки",
      "description": "Совместные бесшумные сессии помодоро 50/10 для максимальной концентрации."
    },
    "hi": {
      "name": "गहन ध्यान और पोमोडोरो सत्र",
      "subject": "अध्ययन कौशल",
      "category": "अध्ययन कौशल",
      "description": "50/10 पोमोडोरो शांत अध्ययन सत्रों में शामिल हों और एकाग्रता बढ़ाएं।"
    }
  }
};
export const COMMUNITY_POSTS_TRANSLATIONS = {
  "post-1": {
    "en": {
      "title": "Intuitive trick for Integration by Parts (LIATE Rule)",
      "content": "Struggling with integral Calculus? Always choose u in order: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential. It saved my grades last term!"
    },
    "es": {
      "title": "Truco intuitivo para Integración por Partes (Regla LIATE)",
      "content": "¿Tienes dificultades con el cálculo integral? Elige siempre u en este orden: Logarítmica, Inversa trigonométrica, Algebraica, Trigonométrica, Exponencial. ¡Mejoró mis calificaciones de inmediato!"
    },
    "fr": {
      "title": "Astuce intuitive pour l'Intégration par Parties (Règle LIATE)",
      "content": "Des difficultés en calcul intégral ? Choisissez toujours u dans l'ordre : Logarithmique, Trigonométrique inverse, Algébrique, Trigonométrique, Exponentielle. Ça a sauvé mes notes !"
    },
    "de": {
      "title": "Intuitiver Trick für die Partielle Integration (LIATE-Regel)",
      "content": "Schwierigkeiten mit Integralrechnung? Wähle u stets in der Reihenfolge: Logarithmisch, Inverse Trig, Algebraisch, Trigonometrisch, Exponentiell. Das hat meine Noten gerettet!"
    },
    "pt": {
      "title": "Dica intuitiva para Integração por Partes (Regra LIATE)",
      "content": "Com dificuldades em Cálculo Integral? Sempre escolha u na ordem: Logarítmica, Inversa trigonométrica, Algébrica, Trigonométrica, Exponencial. Salvou minhas notas no último semestre!"
    },
    "it": {
      "title": "Trucco intuitivo per l'Integrazione per Parti (Regola LIATE)",
      "content": "Difficoltà con il calcolo integrale? Scegli sempre u nell'ordine: Logaritmica, Inversa trig, Algebrica, Trigonometrica, Esponenziale. Ha salvato i miei voti!"
    },
    "zh": {
      "title": "微积分分部积分法速记口诀（LIATE 原则）",
      "content": "积分总选错 u 和 dv？牢记优先级：对数、反三角、代数、三角、指数函数。掌握这个顺序，做题速度翻倍！"
    },
    "ja": {
      "title": "部分積分法の直感的テクニック（LIATE則の活用法）",
      "content": "微積分で行き詰まっていませんか？u の選択順は常に「対数・逆三角・代数・三角・指数」です。これで計算ミスが劇的に減りました！"
    },
    "ko": {
      "title": "부분적분법을 위한 직관적인 팁 (LIATE 원칙)",
      "content": "적분 계산이 어렵다면 u를 고를 때 항상 '로그, 역삼각, 다항, 삼각, 지수' 순서를 기억하세요. 지난 학기 성적을 크게 올린 비결입니다!"
    },
    "ar": {
      "title": "حيلة ذكية لإتقان التكامل بالتجزئة (قاعدة LIATE)",
      "content": "هل تواجه صعوبة في حساب التكامل؟ اختر u دائماً بالترتيب: لوغاريتمية، عكسية، جبرية، مثلثية، أسية. هذه القاعدة أنقذت درجاتي تماماً!"
    },
    "ru": {
      "title": "Интуитивный способ интегрирования по частям (правило LIATE)",
      "content": "Трудности с интегралами? Всегда выбирайте u по порядку: логарифмическая, обратная триг., алгебраическая, тригонометрическая, экспоненциальная. Это спасло мои оценки!"
    },
    "hi": {
      "title": "खंडशः समाकलन के लिए उपयोगी ट्रिक (LIATE नियम)",
      "content": "समाकलन में समस्या आ रही है? हमेशा इस क्रम में u चुनें: लघुगणकीय, प्रतिलोम त्रिकोणमितीय, बीजगणितीय, त्रिकोणमितीय, घातांकीय। इसने मेरी परीक्षा में बहुत मदद की!"
    }
  },
  "post-2": {
    "en": {
      "title": "Welcome to StudPal Global!",
      "content": "This is the official hub for all StudPal updates. Keep an eye out for our weekly global study challenges!"
    },
    "es": {
      "title": "¡Bienvenidos a StudPal Global!",
      "content": "Este es el centro oficial para todas las novedades de StudPal. ¡Atentos a nuestros desafíos semanales de estudio!"
    },
    "fr": {
      "title": "Bienvenue sur StudPal Global !",
      "content": "Voici l'espace officiel pour toutes les annonces StudPal. Gardez un œil sur nos défis d'étude hebdomadaires !"
    },
    "de": {
      "title": "Willkommen bei StudPal Global!",
      "content": "Der offizielle Knotenpunkt für alle StudPal-Updates. Verpasst nicht unsere wöchentlichen globalen Lern-Challenges!"
    },
    "pt": {
      "title": "Bem-vindos ao StudPal Global!",
      "content": "Este é o espaço oficial de todas as novidades do StudPal. Fique atento aos desafios semanais de estudo!"
    },
    "it": {
      "title": "Benvenuti in StudPal Global!",
      "content": "Questo è l'hub ufficiale per tutti gli aggiornamenti di StudPal. Partecipa alle nostre sfide di studio settimanali!"
    },
    "zh": {
      "title": "欢迎来到 StudPal 全球学习社区！",
      "content": "这里是 StudPal 官方动态发布中心。欢迎关注每周发起的全球学生学习冲刺挑战赛！"
    },
    "ja": {
      "title": "StudPalグローバルへようこそ！",
      "content": "StudPalの最新情報を発信する公式ハブです。毎週開催される学習チャレンジにぜひご参加ください！"
    },
    "ko": {
      "title": "StudPal 글로벌 커뮤니티에 오신 것을 환영합니다!",
      "content": "StudPal의 모든 공식 공지가 전해지는 공간입니다. 매주 진행되는 글로벌 스터디 챌린지에 참여해보세요!"
    },
    "ar": {
      "title": "مرحباً بكم في StudPal العالمي!",
      "content": "هذا هو الملتقى الرسمي لجميع تحديثات StudPal. ترقبوا تحديات المذاكرة الأسبوعية المشتركة!"
    },
    "ru": {
      "title": "Добро пожаловать в StudPal Global!",
      "content": "Официальный хаб всех обновлений StudPal. Следите за нашими еженедельными учебными челленджами!"
    },
    "hi": {
      "title": "StudPal ग्लोबल में आपका स्वागत है!",
      "content": "यह StudPal के सभी अपडेट का आधिकारिक हब है। हमारी साप्ताहिक वैश्विक अध्ययन चुनौतियों पर नज़र रखें!"
    }
  },
  "post-3": {
    "en": {
      "title": "JAMB Physics Past Questions Compilation",
      "content": "Hey everyone, I compiled the most repeated physics questions from 2015-2023. Let me know if you want the PDF link."
    },
    "es": {
      "title": "Compilación de preguntas frecuentes de Física",
      "content": "Hola a todos, recopilé las preguntas más repetidas de física de los últimos años. Avisadme si queréis el enlace al PDF."
    },
    "fr": {
      "title": "Compilation d'annales de Physique",
      "content": "Bonjour à tous, j'ai compilé les questions les plus fréquentes des examens de physique. Dites-moi si vous souhaitez le lien PDF."
    },
    "de": {
      "title": "Zusammenstellung häufiger Physik-Prüfungsfragen",
      "content": "Hallo zusammen, ich habe die am häufigsten gestellten Physikfragen zusammengefasst. Schreibt mir gerne für den PDF-Link."
    },
    "pt": {
      "title": "Compilação de questões anteriores de Física",
      "content": "Olá a todos! Reuni as questões de física mais cobradas dos exames recentes. Avisem se quiserem o link do PDF."
    },
    "it": {
      "title": "Raccolta domande frequenti di Fisica",
      "content": "Ciao a tutti! Ho raccolto i quesiti di fisica più frequenti degli esami recenti. Fatemi sapere se volete il link PDF."
    },
    "zh": {
      "title": "精选物理核心高频考题与解析合集",
      "content": "大家好！我整理了历年物理考试中重难点与高频易错真题。如果需要 PDF 资料链接可以在评论区留言。"
    },
    "ja": {
      "title": "物理の頻出過去問・重要論点まとめ",
      "content": "皆さんこんにちは！過去の試験で頻出の物理問題を整理しました。PDFが必要な方はお知らせください。"
    },
    "ko": {
      "title": "물리 빈출 핵심 기출문제 모음",
      "content": "안녕하세요! 최근 시험에서 가장 자주 출제된 물리 핵심 문제를 정리했습니다. PDF가 필요하시면 댓글 남겨주세요."
    },
    "ar": {
      "title": "تجميعة أسئلة الفيزياء المتكررة في الاختبارات",
      "content": "مرحباً بالجميع، قمت بتجميع أهم الأسئلة المتكررة في الفيزياء مع الإجابات النموذجية. أخبروني إذا كنتم تريدون رابط الـ PDF."
    },
    "ru": {
      "title": "Подборка частых экзаменационных вопросов по физике",
      "content": "Всем привет! Собрал самые повторяющиеся вопросы по физике с решениями. Пишите, если нужен PDF-файл."
    },
    "hi": {
      "title": "भौतिकी के महत्वपूर्ण पिछले प्रश्नों का संकलन",
      "content": "नमस्ते दोस्तों, मैंने हाल के वर्षों के सबसे महत्वपूर्ण भौतिकी प्रश्नों का संकलन किया है। अगर आपको PDF लिंक चाहिए तो बताएं।"
    }
  }
};
export const COMMUNITY_CHALLENGES_TRANSLATIONS = {
  "ch-1": {
    "en": {
      "title": "7-Day Organic Chemistry Sprint"
    },
    "es": {
      "title": "Sprint de 7 Días de Química Orgánica"
    },
    "fr": {
      "title": "Sprint 7 Jours de Chimie Organique"
    },
    "de": {
      "title": "7-Tage Organische Chemie Sprint"
    },
    "pt": {
      "title": "Sprint de 7 Dias de Química Orgânica"
    },
    "it": {
      "title": "Sprint di 7 Giorni di Chimica Organica"
    },
    "zh": {
      "title": "7 天有机化学反应冲刺挑战"
    },
    "ja": {
      "title": "7日間有機化学スプリント"
    },
    "ko": {
      "title": "7일 유기화학 스프린트"
    },
    "ar": {
      "title": "تحدي الـ 7 أيام في الكيمياء العضوية"
    },
    "ru": {
      "title": "7-дневный спринт по органической химии"
    },
    "hi": {
      "title": "7-दिवसीय कार्बनिक रसायन स्प्रिंट"
    }
  },
  "ch-2": {
    "en": {
      "title": "21-Day Calculus Mastery"
    },
    "es": {
      "title": "21 Días de Dominio del Cálculo"
    },
    "fr": {
      "title": "21 Jours de Maîtrise du Calcul Intégral"
    },
    "de": {
      "title": "21-Tage Analysis & Differentialrechnung"
    },
    "pt": {
      "title": "21 Dias de Domínio do Cálculo"
    },
    "it": {
      "title": "21 Giorni per Padroneggiare il Calcolo"
    },
    "zh": {
      "title": "21 天微积分通关成长营"
    },
    "ja": {
      "title": "21日間微分積分完全攻略"
    },
    "ko": {
      "title": "21일 미적분학 마스터 챌린지"
    },
    "ar": {
      "title": "إتقان التفاضل والتكامل في 21 يوماً"
    },
    "ru": {
      "title": "21 день для освоения матанализа"
    },
    "hi": {
      "title": "21-दिवसीय कलन (Calculus) महारत"
    }
  },
  "ch-3": {
    "en": {
      "title": "Global 100-Hour Pomodoro Goal"
    },
    "es": {
      "title": "Meta Global de 100 Horas Pomodoro"
    },
    "fr": {
      "title": "Objectif Mondial 100 Heures Pomodoro"
    },
    "de": {
      "title": "Globales 100-Stunden-Pomodoro-Ziel"
    },
    "pt": {
      "title": "Meta Global de 100 Horas Pomodoro"
    },
    "it": {
      "title": "Obiettivo Globale 100 Ore Pomodoro"
    },
    "zh": {
      "title": "全球 100 小时番茄钟专注目标"
    },
    "ja": {
      "title": "世界100時間ポモドーロ達成チャレンジ"
    },
    "ko": {
      "title": "글로벌 100시간 뽀모도로 목표 달성"
    },
    "ar": {
      "title": "هدف الـ 100 ساعة بومودورو العالمي"
    },
    "ru": {
      "title": "Глобальная цель: 100 часов помодоро"
    },
    "hi": {
      "title": "वैश्विक 100-घंटे पोमोडोरो लक्ष्य"
    }
  }
};
export const COMMUNITY_RULES_TRANSLATIONS = {
  "r-1": {
    "en": {
      "title": "Respect & Mutual Support",
      "desc": "Treat fellow peers with kindness. We are all here to learn and achieve together."
    },
    "es": {
      "title": "Respeto y Apoyo Mutuo",
      "desc": "Trata a tus compañeros con amabilidad. Todos estamos aquí para aprender y lograr metas juntos."
    },
    "fr": {
      "title": "Respect et Soutien Mutuel",
      "desc": "Faites preuve de bienveillance. Nous sommes tous ici pour progresser ensemble."
    },
    "de": {
      "title": "Respekt & gegenseitige Unterstützung",
      "desc": "Behandle Mitlernende freundlich. Wir lernen und wachsen gemeinsam."
    },
    "pt": {
      "title": "Respeito e Apoio Mútuo",
      "desc": "Trate os colegas com gentileza. Estamos todos aqui para aprender juntos."
    },
    "it": {
      "title": "Rispetto e Supporto Reciproco",
      "desc": "Tratta i compagni con gentilezza. Siamo qui per imparare e crescere insieme."
    },
    "zh": {
      "title": "友善尊重与互助支持",
      "desc": "以友善的态度对待每一位同学。在这里我们共同探讨、携手进步。"
    },
    "ja": {
      "title": "互いへの敬意と支え合い",
      "desc": "仲間に思いやりを持って接しましょう。共に学び、成長するための場所です。"
    },
    "ko": {
      "title": "상호 존중과 응원",
      "desc": "동료 학습자들을 따뜻하게 배려하세요. 우리는 함께 배우고 성장하기 위해 모였습니다."
    },
    "ar": {
      "title": "الاحترام والدعم المتبادل",
      "desc": "عامل الزملاء بلطف واحترام. نحن هنا جميعاً لنتعلم ونحقق النجاح معاً."
    },
    "ru": {
      "title": "Уважение и взаимная поддержка",
      "desc": "Относитесь к сокурсникам доброжелательно. Мы здесь, чтобы учиться и расти вместе."
    },
    "hi": {
      "title": "सम्मान और परस्पर सहयोग",
      "desc": "साथी छात्रों के साथ विनम्रता से पेश आएं। हम सब यहाँ एक साथ सीखने और आगे बढ़ने आए हैं।"
    }
  },
  "r-2": {
    "en": {
      "title": "No Spam or Self-Promotion",
      "desc": "Keep discussions strictly relevant to course subjects and study topics."
    },
    "es": {
      "title": "Sin Spam ni Promoción",
      "desc": "Mantén las conversaciones enfocadas exclusivamente en materias y estudio."
    },
    "fr": {
      "title": "Pas de Spam ni d'Auto-promotion",
      "desc": "Gardez les échanges strictement axés sur les sujets d'étude et de cours."
    },
    "de": {
      "title": "Kein Spam oder Eigenwerbung",
      "desc": "Diskussionen müssen sich ausschließlich auf Lerninhalte beziehen."
    },
    "pt": {
      "title": "Sem Spam ou Divulgação",
      "desc": "Mantenha as conversas focadas estritamente nos estudos e disciplinas."
    },
    "it": {
      "title": "Niente Spam o Auto-promozione",
      "desc": "Mantieni le discussioni strettamente inerenti alle materie di studio."
    },
    "zh": {
      "title": "杜绝垃圾广告与无关推广",
      "desc": "保持讨论聚焦于学科知识与学习经验，严禁发布广告或引流信息。"
    },
    "ja": {
      "title": "スパムおよび宣伝の禁止",
      "desc": "学習内容や学問の話題にのみフォーカスした健全な会話を維持しましょう。"
    },
    "ko": {
      "title": "스팸 및 홍보 금지",
      "desc": "학습 주제 및 교과 내용과 관련된 유익한 대화만 나눠주세요."
    },
    "ar": {
      "title": "ممنوع الإعلانات المزعجة أو الترويج",
      "desc": "حافظ على تركيز المناقشات على المواد الدراسية ومواضيع التعلم فقط."
    },
    "ru": {
      "title": "Без спама и рекламы",
      "desc": "Сохраняйте обсуждения строго в рамках учебных предметов и тем."
    },
    "hi": {
      "title": "कोई स्पैम या स्व-प्रचार नहीं",
      "desc": "चर्चा को केवल अध्ययन विषयों और पाठ्यक्रम तक ही सीमित रखें।"
    }
  },
  "r-3": {
    "en": {
      "title": "Academic Integrity",
      "desc": "Share study guides, explanations, and practice questions. Avoid direct exam cheating."
    },
    "es": {
      "title": "Integridad Académica",
      "desc": "Comparte guías, explicaciones y preguntas de práctica. No fomentes el fraude en exámenes."
    },
    "fr": {
      "title": "Intégrité Académique",
      "desc": "Partagez fiches de révision et explications. Toute tricherie directe est proscrite."
    },
    "de": {
      "title": "Akademische Integrität",
      "desc": "Teile Lernhilfen, Erklärungen und Übungen. Schummeln bei Prüfungen ist verboten."
    },
    "pt": {
      "title": "Integridade Acadêmica",
      "desc": "Compartilhe resumos, explicações e exercícios. Evite fraudes em provas."
    },
    "it": {
      "title": "Integrità Accademica",
      "desc": "Condividi schemi, spiegazioni ed esercizi. Vietato barare agli esami."
    },
    "zh": {
      "title": "坚守学术诚信准则",
      "desc": "鼓励分享学习笔记、推导解析与自测练习，严禁任何形式的考试作弊行为。"
    },
    "ja": {
      "title": "学術的インテグリティの遵守",
      "desc": "要約ノートや解説、練習問題を共有しましょう。試験の不正行為は禁止です。"
    },
    "ko": {
      "title": "학문적 정직성",
      "desc": "요약 노트, 개념 설명, 연습 문제를 공유하세요. 시험 부정행위는 엄격히 금지됩니다."
    },
    "ar": {
      "title": "النزاهة الأكاديمية",
      "desc": "شارك الملخصات والشروحات وأسئلة التدريب. يُمنع الغش في الاختبارات تماماً."
    },
    "ru": {
      "title": "Академическая честность",
      "desc": "Делитесь конспектами, пояснениями и тестами. Прямой обман на экзаменах запрещен."
    },
    "hi": {
      "title": "अकादमिक सत्यनिष्ठा",
      "desc": "अध्ययन सामग्री, स्पष्टीकरण और अभ्यास प्रश्न साझा करें। परीक्षा में नकल से बचें।"
    }
  }
};

export function getLocalizedGroups(groups = [], lang = 'en') {
  if (!groups || !Array.isArray(groups)) return [];
  const normLang = normalizeLanguageCode(lang);
  if (!normLang || normLang === 'en') return groups;

  return groups.map(grp => {
    const t = COMMUNITY_GROUPS_TRANSLATIONS[grp.id]?.[normLang];
    if (!t) return grp;
    return {
      ...grp,
      name: t.name || grp.name,
      subject: t.subject || grp.subject,
      category: t.category || grp.category,
      description: t.description || grp.description,
    };
  });
}

export function getLocalizedPosts(posts = [], lang = 'en') {
  if (!posts || !Array.isArray(posts)) return [];
  const normLang = normalizeLanguageCode(lang);
  if (!normLang || normLang === 'en') return posts;

  return posts.map(p => {
    const t = COMMUNITY_POSTS_TRANSLATIONS[p.id]?.[normLang];
    if (!t) return p;
    return {
      ...p,
      title: t.title || p.title,
      content: t.content || p.content,
    };
  });
}

export function getLocalizedChallenges(challenges = [], lang = 'en') {
  if (!challenges || !Array.isArray(challenges)) return [];
  const normLang = normalizeLanguageCode(lang);
  if (!normLang || normLang === 'en') return challenges;

  return challenges.map(ch => {
    const t = COMMUNITY_CHALLENGES_TRANSLATIONS[ch.id]?.[normLang];
    if (!t) return ch;
    return {
      ...ch,
      title: t.title || ch.title,
    };
  });
}

export function getLocalizedRules(rules = [], lang = 'en') {
  if (!rules || !Array.isArray(rules)) return [];
  const normLang = normalizeLanguageCode(lang);
  if (!normLang || normLang === 'en') return rules;

  return rules.map(r => {
    const t = COMMUNITY_RULES_TRANSLATIONS[r.id]?.[normLang];
    if (!t) return r;
    return {
      ...r,
      title: t.title || r.title,
      desc: t.desc || r.desc,
    };
  });
}

export const RELATIVE_TIME_TRANSLATIONS = {
  en: {
    "just now": "Just now",
    "5m ago": "5m ago",
    "15m ago": "15m ago",
    "20 mins ago": "20 mins ago",
    "2 hours ago": "2 hours ago",
    "1 day ago": "1 day ago",
  },
  es: {
    "just now": "Ahora mismo",
    "5m ago": "hace 5m",
    "15m ago": "hace 15m",
    "20 mins ago": "hace 20 min",
    "2 hours ago": "hace 2 horas",
    "1 day ago": "hace 1 día",
  },
  fr: {
    "just now": "À l'instant",
    "5m ago": "il y a 5m",
    "15m ago": "il y a 15m",
    "20 mins ago": "il y a 20 min",
    "2 hours ago": "il y a 2 heures",
    "1 day ago": "il y a 1 jour",
  },
  de: {
    "just now": "Gerade eben",
    "5m ago": "vor 5 Min.",
    "15m ago": "vor 15 Min.",
    "20 mins ago": "vor 20 Min.",
    "2 hours ago": "vor 2 Stunden",
    "1 day ago": "vor 1 Tag",
  },
  pt: {
    "just now": "Agora mesmo",
    "5m ago": "há 5m",
    "15m ago": "há 15m",
    "20 mins ago": "há 20 min",
    "2 hours ago": "há 2 horas",
    "1 day ago": "há 1 dia",
  },
  it: {
    "just now": "Proprio ora",
    "5m ago": "5m fa",
    "15m ago": "15m fa",
    "20 mins ago": "20 min fa",
    "2 hours ago": "2 ore fa",
    "1 day ago": "1 giorno fa",
  },
  zh: {
    "just now": "刚刚",
    "5m ago": "5分钟前",
    "15m ago": "15分钟前",
    "20 mins ago": "20分钟前",
    "2 hours ago": "2小时前",
    "1 day ago": "1天前",
  },
  ja: {
    "just now": "たった今",
    "5m ago": "5分前",
    "15m ago": "15分前",
    "20 mins ago": "20分前",
    "2 hours ago": "2時間前",
    "1 day ago": "1日前",
  },
  ko: {
    "just now": "방금 전",
    "5m ago": "5분 전",
    "15m ago": "15분 전",
    "20 mins ago": "20분 전",
    "2 hours ago": "2시간 전",
    "1 day ago": "1일 전",
  },
  ar: {
    "just now": "الآن",
    "5m ago": "منذ 5 د",
    "15m ago": "منذ 15 د",
    "20 mins ago": "منذ 20 دقيقة",
    "2 hours ago": "منذ ساعتين",
    "1 day ago": "منذ يوم واحد",
  },
  ru: {
    "just now": "Только что",
    "5m ago": "5 мин. назад",
    "15m ago": "15 мин. назад",
    "20 mins ago": "20 мин. назад",
    "2 hours ago": "2 часа назад",
    "1 day ago": "1 день назад",
  },
  hi: {
    "just now": "अभी-अभी",
    "5m ago": "5 मिनट पहले",
    "15m ago": "15 मिनट पहले",
    "20 mins ago": "20 मिनट पहले",
    "2 hours ago": "2 घंटे पहले",
    "1 day ago": "1 दिन पहले",
  },
};

export function getLocalizedTimeAgo(timeStr = '', lang = 'en') {
  if (!timeStr) return '';
  const normLang = normalizeLanguageCode(lang);
  const table = RELATIVE_TIME_TRANSLATIONS[normLang] || RELATIVE_TIME_TRANSLATIONS.en;
  const key = String(timeStr).trim().toLowerCase();
  return table[key] || timeStr;
}

