// src/services/i18n/studyContentTranslations.js
// Provides full 12-language localized flashcards and quizzes
import { normalizeLanguageCode } from './i18nService.js';

export const CARDS_TRANSLATIONS = {
  "1": {
    "en": {
      "category": "DERIVATIVES & CHAIN RULE",
      "question": "What is the derivative of f(x) = sin(x²) with respect to x?",
      "hint": "Use the Chain Rule: d/dx [f(g(x))] = f'(g(x)) · g'(x). Outer is sin(u), inner u = x².",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. Outer derivative: d/du [sin(u)] = cos(u).\n2. Inner derivative: d/dx [x²] = 2x.\n3. Multiply: f'(x) = 2x · cos(x²).",
      "takeaway": "Always multiply by the derivative of the inner function when using chain rule."
    },
    "es": {
      "category": "DERIVADAS Y REGLA DE LA CADENA",
      "question": "¿Cuál es la derivada de f(x) = sen(x²) con respecto a x?",
      "hint": "Usa la regla de la cadena: d/dx [f(g(x))] = f'(g(x)) · g'(x). Externa sen(u), interna u = x².",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. Derivada externa: d/du [sen(u)] = cos(u).\n2. Derivada interna: d/dx [x²] = 2x.\n3. Multiplica: f'(x) = 2x · cos(x²).",
      "takeaway": "Siempre multiplica por la derivada de la función interna al aplicar la regla de la cadena."
    },
    "fr": {
      "category": "DÉRIVÉES ET RÈGLE DE DÉRIVATION EN CHAÎNE",
      "question": "Quelle est la dérivée de f(x) = sin(x²) par rapport à x ?",
      "hint": "Utilisez la règle de dérivation en chaîne : d/dx [f(g(x))] = f'(g(x)) · g'(x). Extérieure sin(u), intérieure u = x².",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. Dérivée externe : d/du [sin(u)] = cos(u).\n2. Dérivée interne : d/dx [x²] = 2x.\n3. Multiplier : f'(x) = 2x · cos(x²).",
      "takeaway": "Multipliez toujours par la dérivée de la fonction interne lors de la dérivation composée."
    },
    "de": {
      "category": "ABLEITUNGEN & KETTENREGEL",
      "question": "Was ist die Ableitung von f(x) = sin(x²) nach x?",
      "hint": "Nutze die Kettenregel: Äußere Funktion sin(u), innere Funktion u = x².",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. Äußere Ableitung: cos(u).\n2. Innere Ableitung: 2x.\n3. Produkt: f'(x) = 2x · cos(x²).",
      "takeaway": "Immer mit der inneren Ableitung multiplizieren."
    },
    "pt": {
      "category": "DERIVADAS E REGRA DA CADEIA",
      "question": "Qual é a derivada de f(x) = sen(x²) em relação a x?",
      "hint": "Use a Regra da Cadeia: d/dx [f(g(x))] = f'(g(x)) · g'(x). Externa sen(u), interna u = x².",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. Derivada externa: cos(u).\n2. Derivada interna: 2x.\n3. Produto: f'(x) = 2x · cos(x²).",
      "takeaway": "Sempre multiplique pela derivada da função interna ao usar a regra da cadeia."
    },
    "it": {
      "category": "DERIVATE E REGOLA DELLA CATENA",
      "question": "Qual è la derivata di f(x) = sen(x²) rispetto a x?",
      "hint": "Usa la regola della catena: f'(g(x)) · g'(x). Esterna sen(u), interna u = x².",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. Derivata esterna: cos(u).\n2. Derivata interna: 2x.\n3. Moltiplica: f'(x) = 2x · cos(x²).",
      "takeaway": "Moltiplica sempre per la derivata della funzione interna."
    },
    "zh": {
      "category": "导数与复合函数链式法则",
      "question": "函数 f(x) = sin(x²) 关于 x 的导数是什么？",
      "hint": "使用链式法则：d/dx [f(g(x))] = f'(g(x)) · g'(x)。外层为 sin(u)，内层 u = x²。",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. 外层求导：cos(u)。\n2. 内层求导：2x。\n3. 相乘得到：f'(x) = 2x · cos(x²)。",
      "takeaway": "使用链式法则时务必乘以内层函数的导数。"
    },
    "ja": {
      "category": "微分と合成関数の連鎖律",
      "question": "f(x) = sin(x²) の x に関する導関数は何ですか？",
      "hint": "連鎖律（合成関数の微分公式）を使用します。外側は sin(u)、内側は u = x² です。",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. 外側の微分：cos(u)。\n2. 内側の微分：2x。\n3. 積をとる：f'(x) = 2x · cos(x²)。",
      "takeaway": "連鎖律を適用する際は、常に内側の関数の微分を掛けてください。"
    },
    "ko": {
      "category": "미분 및 연쇄법칙",
      "question": "f(x) = sin(x²)의 x에 대한 도함수는 무엇인가요?",
      "hint": "연쇄법칙(합성함수 미분법)을 적용하세요. 바깥 함수는 sin(u), 안쪽 함수는 u = x²입니다.",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. 겉미분: cos(u).\n2. 속미분: 2x.\n3. 곱하기: f'(x) = 2x · cos(x²).",
      "takeaway": "합성함수를 미분할 때는 항상 안쪽 함수의 도함수를 곱해야 합니다."
    },
    "ar": {
      "category": "التفاضل وقاعدة السلسلة",
      "question": "ما هي مشتقة الدالة f(x) = sin(x²) بالنسبة إلى x؟",
      "hint": "استخدم قاعدة السلسلة: المشتقة الخارجية ضرب المشتقة الداخلية.",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. المشتق الخارجي: cos(u).\n2. المشتق الداخلي: 2x.\n3. الناتج: f'(x) = 2x · cos(x²).",
      "takeaway": "اضرب دائماً في مشتقة الدالة الداخلية عند تطبيق قاعدة السلسلة."
    },
    "ru": {
      "category": "ПРОИЗВОДНЫЕ И ЦЕПНОЕ ПРАВИЛО",
      "question": "Какова производная функции f(x) = sin(x²) по x?",
      "hint": "Примените правило дифференцирования сложной функции: f'(g(x)) · g'(x).",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. Внешняя производная: cos(u).\n2. Внутренняя производная: 2x.\n3. Умножение: f'(x) = 2x · cos(x²).",
      "takeaway": "Всегда умножайте на производную внутренней функции при цепном правиле."
    },
    "hi": {
      "category": "अवकलन और श्रृंखला नियम (Chain Rule)",
      "question": "x के सापेक्ष f(x) = sin(x²) का अवकलज (derivative) क्या है?",
      "hint": "श्रृंखला नियम का उपयोग करें: बाहरी फलन sin(u), आंतरिक u = x².",
      "answer": "f'(x) = 2x · cos(x²)",
      "explanation": "1. बाहरी अवकलन: cos(u).\n2. आंतरिक अवकलन: 2x.\n3. गुणन: f'(x) = 2x · cos(x²).",
      "takeaway": "श्रृंखला नियम का उपयोग करते समय हमेशा आंतरिक फलन के अवकलज से गुणा करें।"
    }
  },
  "2": {
    "en": {
      "category": "INTEGRATION BY PARTS",
      "question": "What is the formula for Integration by Parts?",
      "hint": "Think of LIATE rule for choosing u and dv.",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "Derived directly from the product rule of differentiation: d/dx(u·v) = u'v + uv'. Integrating both sides yields ∫ u dv = u·v - ∫ v du.",
      "takeaway": "Choose u in order of LIATE: Logarithmic, Inverse Trig, Algebraic, Trigonometric, Exponential."
    },
    "es": {
      "category": "INTEGRACIÓN POR PARTES",
      "question": "¿Cuál es la fórmula de integración por partes?",
      "hint": "Recuerda la regla LIATE para elegir u y dv.",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "Derivada directamente de la regla del producto de la diferenciación. Integrar ambos lados produce ∫ u dv = u·v - ∫ v du.",
      "takeaway": "Elige u en orden LIATE: Logarítmica, Inversa trig, Algebraica, Trigonométrica, Exponencial."
    },
    "fr": {
      "category": "INTÉGRATION PAR PARTIES",
      "question": "Quelle est la formule de l'intégration par parties ?",
      "hint": "Pensez à la règle ALPET/LIATE pour choisir u et dv.",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "Dérivée de la règle du produit : d/dx(u·v) = u'v + uv'. En intégrant les deux côtés, on obtient ∫ u dv = u·v - ∫ v du.",
      "takeaway": "Choisissez u selon l'ordre LIATE : Logarithmique, Trig inverse, Algébrique, Trigonométrique, Exponentielle."
    },
    "de": {
      "category": "PARTIELLE INTEGRATION",
      "question": "Wie lautet die Formel für die partielle Integration?",
      "hint": "Denke an die LIATE-Regel zur Wahl von u und dv.",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "Entsteht direkt aus der Produktregel der Differentialrechnung.",
      "takeaway": "Wähle u nach der Reihenfolge LIATE."
    },
    "pt": {
      "category": "INTEGRAÇÃO POR PARTES",
      "question": "Qual é a fórmula da Integração por Partes?",
      "hint": "Lembre-se da regra LIATE para escolher u e dv.",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "Derivada diretamente da regra do produto da diferenciação.",
      "takeaway": "Escolha u na ordem LIATE: Logarítmica, Inversa trig, Algébrica, Trigonométrica, Exponencial."
    },
    "it": {
      "category": "INTEGRAZIONE PER PARTI",
      "question": "Qual è la formula dell'integrazione per parti?",
      "hint": "Ricorda la regola LIATE per scegliere u e dv.",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "Derivata direttamente dalla regola del prodotto delle derivate.",
      "takeaway": "Scegli u seguendo l'ordine LIATE."
    },
    "zh": {
      "category": "分部积分法",
      "question": "分部积分法的公式是什么？",
      "hint": "根据 LIATE 原则选取 u 和 dv。",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "由微积分乘积求导法则推导而来：两边同时积分得到 ∫ u dv = u·v - ∫ v du。",
      "takeaway": "按 LIATE 顺序优先选择 u：对数、反三角、代数、三角、指数。"
    },
    "ja": {
      "category": "部分積分法",
      "question": "部分積分の公式は何ですか？",
      "hint": "u と dv を選ぶ際は LIATE 則を思い出してください。",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "積の微分公式から直接導出されます：両辺を積分することで公式が得られます。",
      "takeaway": "u は LIATE（対数・逆三角・代数・三角・指数）の優先順で選びます。"
    },
    "ko": {
      "category": "부분적분법",
      "question": "부분적분법 공식은 무엇인가요?",
      "hint": "u와 dv를 고를 때 LIATE 원칙을 생각하세요.",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "미분의 곱 법칙에서 유도됩니다: 양변을 적분하면 부분적분 공식을 얻습니다.",
      "takeaway": "u는 LIATE(로그, 역삼각, 다항, 삼각, 지수) 순서로 선택하세요."
    },
    "ar": {
      "category": "التكامل بالتجزئة",
      "question": "ما هي صيغة التكامل بالتجزئة؟",
      "hint": "تذكر قاعدة LIATE لاختيار u و dv.",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "مشتقة مباشرة من قاعدة مشتقة الضرب، وبمكاملة الطرفين نحصل على الصيغة.",
      "takeaway": "اختر u بحسب ترتيب LIATE: لوغاريتمية، عكسية، جبرية، مثلثية، أسية."
    },
    "ru": {
      "category": "ИНТЕГРИРОВАНИЕ ПО ЧАСТЯМ",
      "question": "Какова формула интегрирования по частям?",
      "hint": "Вспомните правило LIATE для выбора u и dv.",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "Выводится непосредственно из правила дифференцирования произведения.",
      "takeaway": "Выбирайте u в порядке LIATE: логарифмические, обратные триг., алгебраические, тригонометрические, показательные."
    },
    "hi": {
      "category": "खंडशः समाकलन (Integration by Parts)",
      "question": "खंडशः समाकलन का सूत्र क्या है?",
      "hint": "u और dv चुनने के लिए LIATE नियम याद करें।",
      "answer": "∫ u dv = u·v - ∫ v du",
      "explanation": "अवकलन के गुणन नियम से सीधे प्राप्त: दोनों पक्षों का समाकलन करने पर ∫ u dv = u·v - ∫ v du मिलता है।",
      "takeaway": "LIATE क्रम में u चुनें: लघुगणकीय, प्रतिलोम त्रिकोणमितीय, बीजगणितीय, त्रिकोणमितीय, घातांकीय।"
    }
  },
  "3": {
    "en": {
      "category": "LIMITS & L'HÔPITAL'S RULE",
      "question": "When can you apply L'Hôpital's Rule to evaluate lim (x→a) [f(x)/g(x)]?",
      "hint": "Applies only to indeterminate forms.",
      "answer": "Only when the limit produces an indeterminate form 0/0 or ∞/∞.",
      "explanation": "If lim f(x)/g(x) results in 0/0 or ±∞/±∞, then lim [f(x)/g(x)] = lim [f'(x)/g'(x)], provided the derivative limit exists.",
      "takeaway": "Check that the form is strictly 0/0 or ∞/∞ BEFORE taking derivatives of top and bottom."
    },
    "es": {
      "category": "LÍMITES Y REGLA DE L'HÔPITAL",
      "question": "¿Cuándo se puede aplicar la regla de L'Hôpital para evaluar lim (x→a) [f(x)/g(x)]?",
      "hint": "Se aplica solo a formas indeterminadas.",
      "answer": "Solo cuando el límite produce una forma indeterminada 0/0 o ∞/∞.",
      "explanation": "Si el límite da 0/0 o ±∞/±∞, entonces lim [f(x)/g(x)] = lim [f'(x)/g'(x)], siempre que el límite de las derivadas exista.",
      "takeaway": "Verifica que la forma sea estrictamente 0/0 o ∞/∞ ANTES de derivar numerador y denominador."
    },
    "fr": {
      "category": "LIMITES ET RÈGLE DE L'HÔPITAL",
      "question": "Quand peut-on appliquer la règle de L'Hôpital pour évaluer lim (x→a) [f(x)/g(x)] ?",
      "hint": "S'applique uniquement aux formes indéterminées.",
      "answer": "Uniquement lorsque la limite produit une forme indéterminée 0/0 ou ∞/∞.",
      "explanation": "Si lim f(x)/g(x) donne 0/0 ou ±∞/±∞, alors lim [f(x)/g(x)] = lim [f'(x)/g'(x)], sous réserve d'existence de la limite.",
      "takeaway": "Vérifiez que la forme est strictement 0/0 ou ∞/∞ AVANT de dériver le numérateur et le dénominateur."
    },
    "de": {
      "category": "GRENZWERTE & REGEL VON L'HOSPITAL",
      "question": "Wann darf die Regel von L'Hospital angewendet werden?",
      "hint": "Gilt nur für unbestimmte Ausdrücke.",
      "answer": "Ausschließlich bei den unbestimmten Formen 0/0 oder ∞/∞.",
      "explanation": "Ergibt der Grenzwert 0/0 oder ±∞/±∞, so gilt lim [f(x)/g(x)] = lim [f'(x)/g'(x)].",
      "takeaway": "Vor dem Ableiten stets prüfen, ob wirklich 0/0 oder ∞/∞ vorliegt."
    },
    "pt": {
      "category": "LIMITES E REGRA DE L'HÔPITAL",
      "question": "Quando se pode aplicar a Regra de L'Hôpital para avaliar lim (x→a) [f(x)/g(x)]?",
      "hint": "Aplica-se apenas a formas indeterminadas.",
      "answer": "Apenas quando o limite produz uma forma indeterminada 0/0 ou ∞/∞.",
      "explanation": "Se o limite resulta em 0/0 ou ±∞/±∞, então lim [f(x)/g(x)] = lim [f'(x)/g'(x)].",
      "takeaway": "Verifique que a forma é estritamente 0/0 ou ∞/∞ ANTES de derivar."
    },
    "it": {
      "category": "LIMITI E REGOLA DI DE L'HÔPITAL",
      "question": "Quando è possibile applicare la regola di de L'Hôpital?",
      "hint": "Si applica solo alle forme indeterminate.",
      "answer": "Solo quando il limite genera una forma indeterminata 0/0 o ∞/∞.",
      "explanation": "Se il limite produce 0/0 o ±∞/±∞, allora lim [f(x)/g(x)] = lim [f'(x)/g'(x)].",
      "takeaway": "Verifica che la forma sia 0/0 o ∞/∞ PRIMA di calcolare le derivate."
    },
    "zh": {
      "category": "极限与洛必达法则",
      "question": "什么时候可以使用洛必达法则求解极限 lim (x→a) [f(x)/g(x)]？",
      "hint": "仅适用于未定式。",
      "answer": "仅当极限呈现 0/0 或 ∞/∞ 未定式时。",
      "explanation": "如果极限得到 0/0 或 ±∞/±∞，且导数极限存在，则 lim [f(x)/g(x)] = lim [f'(x)/g'(x)]。",
      "takeaway": "在对分子分母分别求导前，务必先验证是否为 0/0 或 ∞/∞ 未定型。"
    },
    "ja": {
      "category": "極限とロピタルの定理",
      "question": "lim (x→a) [f(x)/g(x)] にロピタルの定理を適用できる条件は何ですか？",
      "hint": "不定形にのみ適用可能です。",
      "answer": "極限が 0/0 または ∞/∞ の不定形になる場合のみです。",
      "explanation": "0/0 または ±∞/±∞ の不定形となる場合、導関数の極限が存在すれば lim [f(x)/g(x)] = lim [f'(x)/g'(x)] が成り立ちます。",
      "takeaway": "分子・分母を微分する前に、必ず 0/0 または ∞/∞ の形であることを確認してください。"
    },
    "ko": {
      "category": "극한과 로피탈의 정리",
      "question": "lim (x→a) [f(x)/g(x)]에 로피탈의 정리를 적용할 수 있는 조건은 무엇인가요?",
      "hint": "부정형에만 적용됩니다.",
      "answer": "극한값이 0/0 또는 ∞/∞ 부정형일 때만 적용할 수 있습니다.",
      "explanation": "0/0 또는 ±∞/±∞ 부정형이고 도함수의 극한이 존재할 때, lim [f(x)/g(x)] = lim [f'(x)/g'(x)]가 성립합니다.",
      "takeaway": "분자·분모를 미분하기 전에 반드시 0/0 또는 ∞/∞ 부정형인지 먼저 확인하세요."
    },
    "ar": {
      "category": "النهايات وقاعدة لوبيتال",
      "question": "متى يمكن تطبيق قاعدة لوبيتال لحساب النهاية؟",
      "hint": "تنطبق فقط على الصيغ غير المعينة.",
      "answer": "فقط عندما ينتج عن النهاية صيغة غير معينة مثل 0/0 أو ∞/∞.",
      "explanation": "إذا أنتجت النهاية 0/0 أو ±∞/±∞، فإن نهاية الدالة تساوي نهاية مشتقة البسط على مشتقة المقام.",
      "takeaway": "تأكد من أن الصيغة 0/0 أو ∞/∞ قبل اشتقاق البسط والمقام."
    },
    "ru": {
      "category": "ПРЕДЕЛЫ И ПРАВИЛО ЛОПИТАЛЯ",
      "question": "Когда можно применять правило Лопиталя для вычисления пределов?",
      "hint": "Применимо только к неопределенностям.",
      "answer": "Только при возникновении неопределенностей вида 0/0 или ∞/∞.",
      "explanation": "Если предел дает 0/0 или ±∞/±∞, то lim [f(x)/g(x)] = lim [f'(x)/g'(x)] при существовании предела производных.",
      "takeaway": "Всегда проверяйте наличие неопределенности 0/0 или ∞/∞ ДО дифференцирования."
    },
    "hi": {
      "category": "सीमाएं और एल'हॉस्पिटल नियम (L'Hôpital's Rule)",
      "question": "lim (x→a) [f(x)/g(x)] का मान निकालने के लिए L'Hôpital नियम कब लागू किया जा सकता है?",
      "hint": "यह केवल अनिर्धार्य रूपों (indeterminate forms) पर लागू होता है।",
      "answer": "केवल तब जब सीमा 0/0 या ∞/∞ का अनिर्धार्य रूप उत्पन्न करती है।",
      "explanation": "यदि सीमा 0/0 या ±∞/±∞ देती है, तो lim [f(x)/g(x)] = lim [f'(x)/g'(x)] होता है, बशर्ते अवकलज की सीमा मौजूद हो।",
      "takeaway": "अंश और हर का अवकलन करने से पहले सुनिश्चित करें कि रूप 0/0 या ∞/∞ है।"
    }
  },
  "4": {
    "en": {
      "category": "ELECTROMAGNETISM",
      "question": "What is Faraday's Law of Electromagnetic Induction?",
      "hint": "Relates induced EMF to magnetic flux change.",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "The induced electromotive force (EMF) in a closed circuit equals the negative rate of change of magnetic flux through the circuit.",
      "takeaway": "The negative sign (Lenz's Law) indicates that induced current opposes the change in magnetic flux."
    },
    "es": {
      "category": "ELECTROMAGNETISMO",
      "question": "¿Qué establece la ley de inducción electromagnética de Faraday?",
      "hint": "Relaciona la FEM inducida con el cambio de flujo magnético.",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "La fuerza electromotriz inducida (FEM) en un circuito cerrado equivale al ritmo de cambio negativo del flujo magnético.",
      "takeaway": "El signo negativo (Ley de Lenz) indica que la corriente inducida se opone al cambio de flujo magnético."
    },
    "fr": {
      "category": "ÉLECTROMAGNÉTISME",
      "question": "Quelle est la loi de Faraday sur l'induction électromagnétique ?",
      "hint": "Relie la force électromotrice induite à la variation du flux magnétique.",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "La force électromotrice (FEM) induite dans un circuit fermé est égale à l'opposé de la variation du flux magnétique par rapport au temps.",
      "takeaway": "Le signe négatif (loi de Lenz) indique que le courant induit s'oppose à la cause qui lui donne naissance."
    },
    "de": {
      "category": "ELEKTROMAGNETISMUS",
      "question": "Was besagt das Faradaysche Induktionsgesetz?",
      "hint": "Verknüpft induzierte Spannung mit der Änderung des magnetischen Flusses.",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "Die induzierte elektromagnetische Kraft entspricht der negativen Änderungsrate des magnetischen Flusses.",
      "takeaway": "Das Minuszeichen (Lenzsche Regel) drückt aus, dass der induzierte Strom der Ursache entgegenwirkt."
    },
    "pt": {
      "category": "ELETROMAGNETISMO",
      "question": "O que diz a Lei de Indução Eletromagnética de Faraday?",
      "hint": "Relaciona a FEM induzida com a taxa de variação do fluxo magnético.",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "A força eletromotriz induzida (FEM) em um circuito fechado é igual à taxa negativa de variação do fluxo magnético.",
      "takeaway": "O sinal negativo (Lei de Lenz) indica que a corrente induzida se opõe à variação do fluxo magnético."
    },
    "it": {
      "category": "ELETTROMAGNETISMO",
      "question": "Cos'è la legge di induzione elettromagnetica di Faraday?",
      "hint": "Collega la forza elettromotrice indotta alla variazione del flusso magnetico.",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "La forza elettromotrice (FEM) indotta in un circuito chiuso è uguale alla variazione negativa del flusso magnetico nel tempo.",
      "takeaway": "Il segno negativo (legge di Lenz) indica che la corrente indotta si oppone alla variazione di flusso."
    },
    "zh": {
      "category": "电磁感应定律",
      "question": "法拉第电磁感应定律的公式是什么？",
      "hint": "表示感应电动势与磁通量变化率的关系。",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "闭合回路中的感应电动势（EMF）等于穿过该回路的磁通量变化率的负值。",
      "takeaway": "负号（楞次定律）表示感应电流的方向总是反抗引起它的磁通量变化。"
    },
    "ja": {
      "category": "電磁気学とファラデーの法則",
      "question": "ファラデーの電磁誘導の法則とは何ですか？",
      "hint": "誘導起電力と磁束の変化率を関係付けます。",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "閉回路に生じる誘導起電力は、回路を貫く磁束の時間変化率の負の値に等しくなります。",
      "takeaway": "負号（レンツの法則）は、誘導電流が磁束の変化を妨げる向きに生じることを表します。"
    },
    "ko": {
      "category": "전자기학 및 패러데이 법칙",
      "question": "패러데이 전자기 유도 법칙 공식은 무엇인가요?",
      "hint": "유도 기전력과 자기 선속의 변화율을 나타냅니다.",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "폐회로에 유도되는 기전력은 회로를 통과하는 자기선속의 시간적 변화율의 음의 값에 비례합니다.",
      "takeaway": "음의 부호(렌츠의 법칙)는 유도 전류가 자기선속의 변화를 방해하는 방향으로 흐름을 의미합니다."
    },
    "ar": {
      "category": "الكهرومغناطيسية",
      "question": "ما هو قانون فراداي للحث الكهرومغناطيسي؟",
      "hint": "يربط القوة الدافعة الكهربائية الحثية بتغير التدفق المغناطيسي.",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "القوة الدافعة الكهربائية الحثية المتولدة في دائرة مغلقة تساوي المعدل الزمني السالب لتغير التدفق المغناطيسي.",
      "takeaway": "الإشارة السالبة (قانون لينز) تدل على أن التيار الحثي يعاكس التغير في التدفق المغناطيسي المسبب له."
    },
    "ru": {
      "category": "ЭЛЕКТРОМАГНЕТИЗМ",
      "question": "В чем заключается закон электромагнитной индукции Фарадея?",
      "hint": "Связывает индуцированную ЭДС с изменением магнитного потока.",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "Индуцированная электродвижущая сила (ЭДС) в замкнутом контуре равна скорости изменения магнитного потока с противоположным знаком.",
      "takeaway": "Знак минус (правило Ленца) показывает, что индукционный ток противодействует изменению магнитного потока."
    },
    "hi": {
      "category": "विद्युत चुंबकत्व (Faraday's Law)",
      "question": "फैराडे का विद्युत चुंबकीय प्रेरण नियम क्या है?",
      "hint": "प्रेरित विद्युत वाहक बल (EMF) को चुंबकीय प्रवाह में परिवर्तन से जोड़ता है।",
      "answer": "Ɛ = -N · (dΦ_B / dt)",
      "explanation": "किसी बंद परिपथ में प्रेरित EMF चुंबकीय प्रवाह के परिवर्तन की ऋणात्मक दर के बराबर होता है।",
      "takeaway": "ऋणात्मक चिह्न (लेंज़ का नियम) यह दर्शाता है कि प्रेरित धारा चुंबकीय प्रवाह में परिवर्तन का विरोध करती है।"
    }
  },
  "5": {
    "en": {
      "category": "PHYSICS - KINEMATICS",
      "question": "What is the kinematic equation relating velocity, acceleration, and distance without time?",
      "hint": "It involves v squared.",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "Derived from substituting time t = (v - v₀)/a into displacement equation Δx = v₀t + ½at².",
      "takeaway": "Use this equation when time is not given and not requested."
    },
    "es": {
      "category": "FÍSICA - CINEMÁTICA",
      "question": "¿Cuál es la ecuación cinemática que relaciona velocidad, aceleración y distancia sin el tiempo?",
      "hint": "Involucra v al cuadrado.",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "Derivada de sustituir el tiempo t en la ecuación de desplazamiento.",
      "takeaway": "Usa esta ecuación cuando no se conozca el tiempo ni se pida calcularlo."
    },
    "fr": {
      "category": "PHYSIQUE - CINÉMATIQUE",
      "question": "Quelle équation cinématique relie vitesse, accélération et distance sans faire intervenir le temps ?",
      "hint": "Elle implique v au carré.",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "Dérivée en substituant le temps t dans l'équation du déplacement.",
      "takeaway": "Utilisez cette équation lorsque le temps n'est ni fourni ni demandé."
    },
    "de": {
      "category": "PHYSIK - KINEMATIK",
      "question": "Welche kinematische Gleichung verknüpft Geschwindigkeit, Beschleunigung und Weg ohne die Zeit?",
      "hint": "Sie enthält v zum Quadrat.",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "Entsteht durch Eliminieren der Zeit t aus den Bewegungsgleichungen.",
      "takeaway": "Ideal anwendbar, wenn die Zeit weder gegeben noch gesucht ist."
    },
    "pt": {
      "category": "FÍSICA - CINEMÁTICA",
      "question": "Qual é a equação cinemática (Equação de Torricelli) que relaciona velocidade, aceleração e distância sem o tempo?",
      "hint": "Envolve v ao quadrado.",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "Derivada ao substituir o tempo t na equação da posição.",
      "takeaway": "Use a equação de Torricelli quando o tempo não for fornecido nem requisitado."
    },
    "it": {
      "category": "FISICA - CINEMATICA",
      "question": "Qual è la formula cinematica (formula di Torricelli) che lega velocità, accelerazione e spazio senza il tempo?",
      "hint": "Coinvolge la velocità al quadrato.",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "Si ottiene eliminando la variabile temporale t.",
      "takeaway": "Usala quando il tempo non è fornito né richiesto."
    },
    "zh": {
      "category": "物理 - 运动学",
      "question": "联系速度、加速度与位移且不含时间变量的运动学公式是什么？",
      "hint": "包含速度的平方项。",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "将 t = (v - v₀)/a 代入位移公式 Δx = v₀t + ½at² 推导得出。",
      "takeaway": "当题目既没有给出时间也没有要求求解时间时，优先使用此公式。"
    },
    "ja": {
      "category": "物理 - 運動学",
      "question": "時間 t を含まない、速度・加速度・変位の関係式は何ですか？",
      "hint": "速度の2乗が含まれます。",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "等加速度直線運動の公式から時間 t を消去することで導出されます。",
      "takeaway": "時間が与えられておらず、求める必要もない場合に非常に有用です。"
    },
    "ko": {
      "category": "물리학 - 운동학",
      "question": "시간(t) 없이 속도, 가속도, 변위를 연결하는 등가속도 운동 공식은 무엇인가요?",
      "hint": "속도의 제곱 항이 들어갑니다.",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "변위 공식에서 시간 t를 소거하여 유도할 수 있습니다.",
      "takeaway": "시간이 주어지지 않고 구해야 할 필요도 없을 때 이 공식을 사용하세요."
    },
    "ar": {
      "category": "الفيزياء - علم الحركة",
      "question": "ما هي معادلة الحركة المستقيمة بتسارع ثابت التي تربط السرعة والتسارع والإزاحة دون زمن؟",
      "hint": "تتضمن مربع السرعة.",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "مشتقة من حذف متغير الزمن t بين معادلات الحركة.",
      "takeaway": "استخدم هذه المعادلة عندما لا يكون الزمن معطى ولا مطلوباً."
    },
    "ru": {
      "category": "ФИЗИКА - КИНЕМАТИКА",
      "question": "Какая кинематическая формула связывает скорость, ускорение и перемещение без времени?",
      "hint": "Она содержит квадраты скоростей.",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "Получается исключением времени t из основных кинематических уравнений.",
      "takeaway": "Используйте эту формулу, если время неизвестно и не требуется по условию."
    },
    "hi": {
      "category": "भौतिकी - गतिविज्ञान (Kinematics)",
      "question": "समय के बिना वेग, त्वरण और विस्थापन को जोड़ने वाला गति का तीसरा समीकरण क्या है?",
      "hint": "इसमें वेग का वर्ग (v squared) शामिल है।",
      "answer": "v² = v₀² + 2aΔx",
      "explanation": "विस्थापन समीकरण में t = (v - v₀)/a प्रतिस्थापित करने पर प्राप्त होता है।",
      "takeaway": "इस समीकरण का उपयोग तब करें जब समय न तो दिया गया हो और न ही पूछा गया हो।"
    }
  },
  "6": {
    "en": {
      "category": "DIFFERENTIAL EQUATIONS",
      "question": "What is the general solution to the differential equation y' = k·y?",
      "hint": "It represents exponential growth or decay.",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "Separating variables gives dy/y = k dt. Integrating yields ln|y| = kt + C, which exponentiates to y = C·e^(kt).",
      "takeaway": "Rate of change is proportional to current amount, leading to exponential behavior."
    },
    "es": {
      "category": "ECUACIONES DIFERENCIALES",
      "question": "¿Cuál es la solución general de la ecuación diferencial y' = k·y?",
      "hint": "Representa crecimiento o decaimiento exponencial.",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "Separando variables: dy/y = k dt. Integrando: ln|y| = kt + C, lo que resulta en y = C·e^(kt).",
      "takeaway": "La tasa de cambio es proporcional a la cantidad actual, generando comportamiento exponencial."
    },
    "fr": {
      "category": "ÉQUATIONS DIFFÉRENTIELLES",
      "question": "Quelle est la solution générale de l'équation différentielle y' = k·y ?",
      "hint": "Elle modélise une croissance ou décroissance exponentielle.",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "Par séparation des variables : dy/y = k dt. L'intégration donne ln|y| = kt + C, d'où y = C·e^(kt).",
      "takeaway": "Le taux de variation est proportionnel à la quantité présente, entraînant une dynamique exponentielle."
    },
    "de": {
      "category": "DIFFERENTIALGLEICHUNGEN",
      "question": "Was ist die allgemeine Lösung der Differentialgleichung y' = k·y?",
      "hint": "Sie beschreibt exponentielles Wachstum oder Zerfall.",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "Trennung der Variablen ergibt dy/y = k dt. Integration führt zu y = C·e^(kt).",
      "takeaway": "Änderungsrate ist proportional zum Bestand, führt zu Exponentialfunktion."
    },
    "pt": {
      "category": "EQUAÇÕES DIFERENCIAIS",
      "question": "Qual é a solução geral da equação diferencial y' = k·y?",
      "hint": "Representa crescimento ou decaimento exponencial.",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "Separando variáveis: dy/y = k dt. Integrando resulta em y(t) = C·e^(kt).",
      "takeaway": "A taxa de variação é proporcional à quantidade presente, gerando comportamento exponencial."
    },
    "it": {
      "category": "EQUAZIONI DIFFERENZIALI",
      "question": "Qual è la soluzione generale dell'equazione differenziale y' = k·y?",
      "hint": "Rappresenta una crescita o un decadimento esponenziale.",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "Separando le variabili dy/y = k dt ed integrando si ottiene y = C·e^(kt).",
      "takeaway": "Il tasso di variazione è proporzionale al valore attuale, producendo un andamento esponenziale."
    },
    "zh": {
      "category": "微分方程",
      "question": "微分方程 y' = k·y 的通解是什么？",
      "hint": "它代表指数增长或衰减模型。",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "分离变量法：dy/y = k dt。两边积分得 ln|y| = kt + C，指数化后得 y(t) = C·e^(kt)。",
      "takeaway": "变化率正比于当前总量，必然产生指数特征的行为模式。"
    },
    "ja": {
      "category": "微分方程式",
      "question": "微分方程式 y' = k·y の一般解は何ですか？",
      "hint": "指数関数的な増殖または減衰を表します。",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "変数分離法により dy/y = k dt となり、積分すると ln|y| = kt + C から y = C·e^(kt) が得られます。",
      "takeaway": "変化率が現在の量に比例する場合、指数関数的挙動を示します。"
    },
    "ko": {
      "category": "미분방정식",
      "question": "미분방정식 y' = k·y의 일반해는 무엇인가요?",
      "hint": "지수적 성장 또는 감쇠를 나타냅니다.",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "변수분리법으로 dy/y = k dt를 적분하면 ln|y| = kt + C가 되어 y = C·e^(kt)를 얻습니다.",
      "takeaway": "변화율이 현재 양에 비례할 때 지수함수적 특성이 나타납니다."
    },
    "ar": {
      "category": "المعادلات التفاضلية",
      "question": "ما هو الحل العام للمعادلة التفاضلية y' = k·y؟",
      "hint": "تمثل النمو أو الاضمحلال الأسي.",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "بفصل المتغيرات dy/y = k dt والتكامل نحصل على ln|y| = kt + C وبالتالي y = C·e^(kt).",
      "takeaway": "معدل التغير يتناسب مع الكمية الحالية مما يؤدي إلى سلوك أسي."
    },
    "ru": {
      "category": "ДИФФЕРЕНЦИАЛЬНЫЕ УРАВНЕНИЯ",
      "question": "Каково общее решение дифференциального уравнения y' = k·y?",
      "hint": "Оно моделирует экспоненциальный рост или распад.",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "Разделение переменных дает dy/y = k dt. Интегрирование приводит к y = C·e^(kt).",
      "takeaway": "Скорость изменения пропорциональна текущему значению, что дает экспоненциальный закон."
    },
    "hi": {
      "category": "अवकल समीकरण (Differential Equations)",
      "question": "अवकल समीकरण y' = k·y का सामान्य हल क्या है?",
      "hint": "यह घातांकीय वृद्धि या क्षय को दर्शाता है।",
      "answer": "y(t) = C·e^(kt)",
      "explanation": "चरों को अलग करने पर dy/y = k dt। समाकलन करने पर ln|y| = kt + C, जिससे y = C·e^(kt) प्राप्त होता है।",
      "takeaway": "परिवर्तन की दर वर्तमान मात्रा के समानुपाती होती है, जिससे घातांकीय व्यवहार उत्पन्न होता है।"
    }
  },
  "7": {
    "en": {
      "category": "ORGANIC CHEMISTRY MECHANISMS",
      "question": "What distinguishes SN1 from SN2 substitution reactions?",
      "hint": "Think about steps, carbocation intermediate, and stereochemistry.",
      "answer": "SN1 is two steps with carbocation intermediate (racemization). SN2 is one concerted step (inversion of configuration).",
      "explanation": "SN1 rate depends only on substrate concentration [R-X]. SN2 rate depends on both substrate and nucleophile [R-X][Nu-].",
      "takeaway": "Tertiary substrates favor SN1; primary substrates favor SN2."
    },
    "es": {
      "category": "MECANISMOS DE QUÍMICA ORGÁNICA",
      "question": "¿Qué distingue a las reacciones de sustitución SN1 de las SN2?",
      "hint": "Piensa en etapas, intermediario carbocatión y estereoquímica.",
      "answer": "SN1 tiene dos etapas con carbocatión intermediario (racemización). SN2 ocurre en un solo paso concertado (inversión de Walden).",
      "explanation": "La velocidad de SN1 depende solo del sustrato. La velocidad de SN2 depende del sustrato y del nucleófilo.",
      "takeaway": "Sustratos terciarios favorecen SN1; sustratos primarios favorecen SN2."
    },
    "fr": {
      "category": "MÉCANISMES DE CHIMIE ORGANIQUE",
      "question": "Qu'est-ce qui distingue les réactions de substitution SN1 et SN2 ?",
      "hint": "Pensez au nombre d'étapes, au carbocation intermédiaire et à la stéréochimie.",
      "answer": "SN1 se fait en deux étapes avec carbocation intermédiaire (racémisation). SN2 est une étape concertée (inversion de Walden).",
      "explanation": "La vitesse de SN1 ne dépend que du substrat. La vitesse de SN2 dépend du substrat et du nucléophile.",
      "takeaway": "Les substrats tertiaires favorisent SN1 ; les primaires favorisent SN2."
    },
    "de": {
      "category": "ORGANISCHE CHEMISCHE MECHANISMEN",
      "question": "Was unterscheidet SN1- von SN2-Substitutionsreaktionen?",
      "hint": "Schritte, Carbokation-Zwischenstufe und Stereochemie beachten.",
      "answer": "SN1 verläuft zweistufig über Carbokation (Racemisierung). SN2 einstufig konzertiert (Walden-Umkehr).",
      "explanation": "SN1-Geschwindigkeit hängt nur vom Substrat ab; SN2 von Substrat und Nucleophil.",
      "takeaway": "Tertiäre Substrate begünstigen SN1, primäre SN2."
    },
    "pt": {
      "category": "MECANISMOS DE QUÍMICA ORGÂNICA",
      "question": "O que distingue as reações de substituição nucleofílica SN1 e SN2?",
      "hint": "Pense nas etapas, intermediário carbocátion e estereoquímica.",
      "answer": "SN1 ocorre em duas etapas com carbocátion (racemização). SN2 é concertada em uma única etapa (inversão de configuração).",
      "explanation": "A velocidade de SN1 depende só do substrato. A de SN2 depende do substrato e do nucleófilo.",
      "takeaway": "Substratos terciários favorecem SN1; primários favorecem SN2."
    },
    "it": {
      "category": "MECCANISMI DI CHIMICA ORGANICA",
      "question": "Cosa distingue le reazioni di sostituzione SN1 da quelle SN2?",
      "hint": "Pensa a stadi, carbocatione intermedio e stereochimica.",
      "answer": "SN1 avviene in due stadi con carbocatione (racemizzazione). SN2 avviene in un unico stadio concertato (inversione).",
      "explanation": "La velocità di SN1 dipende solo dal substrato, mentre SN2 dipende sia dal substrato che dal nucleofilo.",
      "takeaway": "I substrati terziari favoriscono SN1; i primari favoriscono SN2."
    },
    "zh": {
      "category": "有机化学反应机理",
      "question": "SN1 和 SN2 亲核取代反应的核心区别是什么？",
      "hint": "从反应步骤、碳正离子中间体及立体化学构型考虑。",
      "answer": "SN1 是两步反应，生成碳正离子中间体（导致外消旋化）；SN2 是一步协同反应（导致构型完全翻转，瓦尔登翻转）。",
      "explanation": "SN1 速率仅取决于底物浓度；SN2 速率由底物和亲核试剂两者浓度决定。",
      "takeaway": "叔碳底物倾向于 SN1；伯碳底物倾向于 SN2。"
    },
    "ja": {
      "category": "有機化学の反応機構",
      "question": "SN1 反応と SN2 反応の主な違いは何ですか？",
      "hint": "段階数、カルボカチオン中間体、立体化学に着目してください。",
      "answer": "SN1 はカルボカチオン中間体を経由する2段階反応（ラセミ化）。SN2 は一斉に起きる1段階反応（立体反転／ワルデン反転）。",
      "explanation": "SN1 の反応速度は基質濃度のみに依存し、SN2 は基質と求核剤の両方の濃度に依存します。",
      "takeaway": "第3級基質は SN1 を優先し、第1級基質は SN2 を優先します。"
    },
    "ko": {
      "category": "유기화학 반응 메커니즘",
      "question": "SN1 반응과 SN2 치환 반응의 결정적인 차이점은 무엇인가요?",
      "hint": "반응 단계 수, 탄소 양이온 중간체, 입체화학을 고려하세요.",
      "answer": "SN1은 탄소 양이온 중간체를 거치는 2단계 반응(라세미화), SN2는 단일 협동 1단계 반응(입체 반전)입니다.",
      "explanation": "SN1 속도는 기질 농도에만 의존하며, SN2 속도는 기질과 친핵체 농도 모두에 비례합니다.",
      "takeaway": "3차 기질은 SN1을, 1차 기질은 SN2를 선호합니다."
    },
    "ar": {
      "category": "آليات الكيمياء العضوية",
      "question": "ما الفرق الأساسي بين تفاعلات الاستبدال النيكليوفيلي SN1 و SN2؟",
      "hint": "فكر في عدد الخطوات، الكاتيون الكربوني الوسيط، والكيمياء الفراغية.",
      "answer": "SN1 يتم في خطوتين مع وسيط كربوكاتيوني (راسمية). SN2 يتم في خطوة واحدة متزامنة (انقلاب التكوين).",
      "explanation": "سرعة SN1 تعتمد على الركيزة فقط، بينما SN2 تعتمد على تركيز الركيزة والنيكليوفيل معاً.",
      "takeaway": "الركائز الثالثية تفضل SN1 والأولية تفضل SN2."
    },
    "ru": {
      "category": "МЕХАНИЗМЫ ОРГАНИЧЕСКОЙ ХИМИИ",
      "question": "В чем различие между реакциями замещения SN1 и SN2?",
      "hint": "Обратите внимание на стадии, карбокатионный интермедиат и стереохимию.",
      "answer": "SN1 идет в две стадии через карбокатион (рацемизация). SN2 — одностадийный согласованный процесс (обращение конфигурации).",
      "explanation": "Скорость SN1 зависит только от субстрата, а SN2 — от субстрата и нуклеофила.",
      "takeaway": "Третичные субстраты способствуют SN1, а первичные — SN2."
    },
    "hi": {
      "category": "कार्बनिक रसायन तंत्र (Organic Chemistry Mechanisms)",
      "question": "SN1 और SN2 प्रतिस्थापन अभिक्रियाओं में मुख्य अंतर क्या है?",
      "hint": "चरणों की संख्या, कार्बोकैटायन मध्यवर्ती और त्रिविम रसायन (stereochemistry) पर विचार करें।",
      "answer": "SN1 कार्बोकैटायन के साथ दो चरणों में होती है (रेसिमीकरण)। SN2 एकल संसक्त चरण में होती है (कॉन्फ़िगरेशन का उलटाव)।",
      "explanation": "SN1 की दर केवल सब्सट्रेट सांद्रता पर निर्भर करती है। SN2 की दर सब्सट्रेट और न्यूक्लियोफाइल दोनों पर निर्भर करती है।",
      "takeaway": "तृतीयक (tertiary) सब्सट्रेट SN1 का समर्थन करते हैं; प्राथमिक सब्सट्रेट SN2 का समर्थन करते हैं।"
    }
  },
  "8": {
    "en": {
      "category": "CELLULAR RESPIRATION",
      "question": "How many net ATP molecules are produced per glucose in aerobic respiration?",
      "hint": "Glycolysis + Krebs Cycle + Electron Transport Chain.",
      "answer": "Approximately 30 to 32 ATP molecules.",
      "explanation": "Glycolysis yields 2 ATP, Krebs cycle yields 2 ATP, and Oxidative Phosphorylation yields 26-28 ATP.",
      "takeaway": "Oxygen acts as the final electron acceptor in the electron transport chain."
    },
    "es": {
      "category": "RESPIRACIÓN CELULAR",
      "question": "¿Cuántas moléculas netas de ATP se producen por glucosa en la respiración aeróbica?",
      "hint": "Glucólisis + Ciclo de Krebs + Cadena de transporte de electrones.",
      "answer": "Aproximadamente de 30 a 32 moléculas de ATP.",
      "explanation": "La glucólisis produce 2 ATP netos, el ciclo de Krebs 2 ATP, y la fosforilación oxidativa entre 26 y 28 ATP.",
      "takeaway": "El oxígeno actúa como el aceptor final de electrones en la cadena respiratoria."
    },
    "fr": {
      "category": "RESPIRATION CELLULAIRE",
      "question": "Combien de molécules d'ATP nettes sont produites par molécule de glucose lors de la respiration aérobie ?",
      "hint": "Glycolyse + Cycle de Krebs + Chaîne de transport d'électrons.",
      "answer": "Environ 30 à 32 molécules d'ATP.",
      "explanation": "La glycolyse produit 2 ATP nets, le cycle de Krebs 2 ATP et la phosphorylation oxydative 26 à 28 ATP.",
      "takeaway": "L'oxygène sert d'accepteur final d'électrons dans la chaîne respiratoire."
    },
    "de": {
      "category": "ZELLATMUNG",
      "question": "Wie viele Netto-ATP-Moleküle entstehen pro Glukosemolekül bei der aeroben Zellatmung?",
      "hint": "Glykolyse + Citratzyklus + Atmungskette.",
      "answer": "Etwa 30 bis 32 ATP-Moleküle.",
      "explanation": "Glykolyse liefert 2 ATP netto, der Citratzyklus 2 ATP und die oxidative Phosphorylierung 26-28 ATP.",
      "takeaway": "Sauerstoff fungiert als finaler Elektronenakzeptor in der Atmungskette."
    },
    "pt": {
      "category": "RESPIRAÇÃO CELULAR",
      "question": "Quantas moléculas líquidas de ATP são produzidas por glicose na respiração aeróbica?",
      "hint": "Glicólise + Ciclo de Krebs + Cadeia transportadora de elétrons.",
      "answer": "Aproximadamente 30 a 32 moléculas de ATP.",
      "explanation": "A glicólise produz 2 ATP líquidos, o ciclo de Krebs 2 ATP e a fosforilação oxidativa 26 a 28 ATP.",
      "takeaway": "O oxigênio atua como aceptor final de elétrons na cadeia respiratória."
    },
    "it": {
      "category": "RESPIRAZIONE CELLULARE",
      "question": "Quante molecole nette di ATP vengono prodotte per molecola di glucosio nella respirazione aerobica?",
      "hint": "Glicolisi + Ciclo di Krebs + Catena di trasporto degli elettroni.",
      "answer": "Circa 30-32 molecole di ATP.",
      "explanation": "La glicolisi produce 2 ATP netti, il ciclo di Krebs 2 ATP e la fosforilazione ossidativa 26-28 ATP.",
      "takeaway": "L'ossigeno agisce come accettore finale di elettroni nella catena di trasporto."
    },
    "zh": {
      "category": "细胞呼吸与能量代谢",
      "question": "有氧呼吸中，每分子葡萄糖大约净产生多少分子 ATP？",
      "hint": "糖酵解 + 三羧酸循环 + 电子传递链氧化磷酸化。",
      "answer": "大约 30 到 32 个 ATP 分子。",
      "explanation": "糖酵解净生成 2 个 ATP，三羧酸循环生成 2 个 ATP，氧化磷酸化生成 26-28 个 ATP。",
      "takeaway": "氧气在电子传递链中充当最终电子受体。"
    },
    "ja": {
      "category": "細胞呼吸とエネルギー産生",
      "question": "好気呼吸において、1分子のグルコースから正味で生成されるATPは何分子ですか？",
      "hint": "解糖系 ＋ クエン酸回路 ＋ 電子伝達系。",
      "answer": "およそ 30〜32 分子の ATP です。",
      "explanation": "解糖系で2 ATP、クエン酸回路で2 ATP、酸化的リン酸化で約26〜28 ATPが生成されます。",
      "takeaway": "酸素は電子伝達系における最終電子受容体として機能します。"
    },
    "ko": {
      "category": "세포 호흡과 ATP 생산",
      "question": "산소 호흡에서 포도당 1분자당 순수하게 생성되는 ATP는 약 몇 분자인가요?",
      "hint": "해당과정 + TCA 회로(크렙스 회로) + 전자전달계.",
      "answer": "약 30~32개의 ATP 분자입니다.",
      "explanation": "해당과정에서 2 ATP, TCA 회로에서 2 ATP, 산화적 인산화에서 26~28 ATP가 생성됩니다.",
      "takeaway": "산소는 전자전달계의 최종 전자 수용체 역할을 합니다."
    },
    "ar": {
      "category": "التنفس الخلوي",
      "question": "كم عدد جزيئات ATP الصافية الناتجة عن جزيء جلوكوز واحد في التنفس الهوائي؟",
      "hint": "التحلل السكري + دورة كريبس + سلسلة نقل الإلكترون.",
      "answer": "حوالي 30 إلى 32 جزيء ATP.",
      "explanation": "التحلل السكري ينتج 2 ATP، دورة كريبس تنتج 2 ATP، والفسفرة التأكسدية تنتج 26-28 ATP.",
      "takeaway": "يعمل الأكسجين كمستقبل أخير للإلكترونات في سلسلة نقل الإلكترون."
    },
    "ru": {
      "category": "КЛЕТОЧНОЕ ДЫХАНИЕ",
      "question": "Сколько молекул АТФ (нетто) образуется из 1 молекулы глюкозы при аэробном дыхании?",
      "hint": "Гликолиз + Цикл Кребса + Электронно-транспортная цепь.",
      "answer": "Приблизительно от 30 до 32 молекул АТФ.",
      "explanation": "Гликолиз дает 2 АТФ, цикл Кребса — 2 АТФ, окислительное фосфорилирование — 26-28 АТФ.",
      "takeaway": "Кислород служит конечным акцептором электронов в дыхательной цепи."
    },
    "hi": {
      "category": "कोशिकीय श्वसन (Cellular Respiration)",
      "question": "वायवीय श्वसन में ग्लूकोज के 1 अणु से लगभग कितने शुद्ध ATP अणु बनते हैं?",
      "hint": "ग्लाइकोलाइसिस + क्रेब्स चक्र + इलेक्ट्रॉन परिवहन श्रृंखला।",
      "answer": "लगभग 30 से 32 ATP अणु।",
      "explanation": "ग्लाइकोलाइसिस 2 ATP, क्रेब्स चक्र 2 ATP, और ऑक्सीडेटिव फॉस्फारिलीकरण 26-28 ATP देता है।",
      "takeaway": "ऑक्सीजन इलेक्ट्रॉन परिवहन श्रृंखला में अंतिम इलेक्ट्रॉन स्वीकर्ता के रूप में कार्य करता है।"
    }
  }
};

export const QUIZ_TITLES_TRANSLATIONS = {
  "q-m3": {
    "en": {
      "title": "Integration by Parts Mastery Quiz",
      "topicName": "Integration by Parts"
    },
    "es": {
      "title": "Cuestionario de Integración por Partes",
      "topicName": "Integración por Partes"
    },
    "fr": {
      "title": "Quiz sur l'Intégration par Parties",
      "topicName": "Intégration par Parties"
    },
    "de": {
      "title": "Quiz zur Partiellen Integration",
      "topicName": "Partielle Integration"
    },
    "pt": {
      "title": "Questionário de Integração por Partes",
      "topicName": "Integração por Partes"
    },
    "it": {
      "title": "Quiz sull'Integrazione per Parti",
      "topicName": "Integrazione per Parti"
    },
    "zh": {
      "title": "分部积分法专项测试",
      "topicName": "分部积分法"
    },
    "ja": {
      "title": "部分積分法マスタークイズ",
      "topicName": "部分積分法"
    },
    "ko": {
      "title": "부분적분법 마스터 퀴즈",
      "topicName": "부분적분법"
    },
    "ar": {
      "title": "اختبار إتقان التكامل بالتجزئة",
      "topicName": "التكامل بالتجزئة"
    },
    "ru": {
      "title": "Тест по интегрированию по частям",
      "topicName": "Интегрирование по частям"
    },
    "hi": {
      "title": "खंडशः समाकलन महारत प्रश्नोत्तरी",
      "topicName": "खंडशः समाकलन"
    }
  },
  "q-p3": {
    "en": {
      "title": "Electromagnetism & Faraday's Law Quiz",
      "topicName": "Electromagnetism & Flux"
    },
    "es": {
      "title": "Cuestionario de Electromagnetismo y Ley de Faraday",
      "topicName": "Electromagnetismo y Flujo"
    },
    "fr": {
      "title": "Quiz d'Électromagnétisme et Loi de Faraday",
      "topicName": "Électromagnétisme et Flux"
    },
    "de": {
      "title": "Quiz zu Elektromagnetismus & Faradayschem Gesetz",
      "topicName": "Elektromagnetismus & Fluss"
    },
    "pt": {
      "title": "Questionário de Eletromagnetismo e Lei de Faraday",
      "topicName": "Eletromagnetismo e Fluxo"
    },
    "it": {
      "title": "Quiz su Elettromagnetismo e Legge di Faraday",
      "topicName": "Elettromagnetismo e Flusso"
    },
    "zh": {
      "title": "电磁学与法拉第感应定律测试",
      "topicName": "电磁学与磁通量"
    },
    "ja": {
      "title": "電磁気学とファラデーの法則クイズ",
      "topicName": "電磁気学と磁束"
    },
    "ko": {
      "title": "전자기학 및 패러데이 법칙 퀴즈",
      "topicName": "전자기학 및 자기선속"
    },
    "ar": {
      "title": "اختبار الكهرومغناطيسية وقانون فراداي",
      "topicName": "الكهرومغناطيسية والتدفق"
    },
    "ru": {
      "title": "Тест по электромагнетизму и закону Фарадея",
      "topicName": "Электромагнетизм и поток"
    },
    "hi": {
      "title": "विद्युत चुंबकत्व और फैराडे नियम प्रश्नोत्तरी",
      "topicName": "विद्युत चुंबकत्व और प्रवाह"
    }
  },
  "q-c3": {
    "en": {
      "title": "Organic Chemistry Mechanisms Quiz",
      "topicName": "Organic Chemistry Mechanisms"
    },
    "es": {
      "title": "Cuestionario de Mecanismos de Química Orgánica",
      "topicName": "Mecanismos de Química Orgánica"
    },
    "fr": {
      "title": "Quiz sur les Mécanismes de Chimie Organique",
      "topicName": "Mécanismes de Chimie Organique"
    },
    "de": {
      "title": "Quiz zu organischen Reaktionsmechanismen",
      "topicName": "Organische Reaktionsmechanismen"
    },
    "pt": {
      "title": "Questionário de Mecanismos de Química Orgânica",
      "topicName": "Mecanismos de Química Orgânica"
    },
    "it": {
      "title": "Quiz sui Meccanismi di Chimica Organica",
      "topicName": "Meccanismi di Chimica Organica"
    },
    "zh": {
      "title": "有机化学反应机理测试",
      "topicName": "有机化学反应机理"
    },
    "ja": {
      "title": "有機化学反応機構クイズ",
      "topicName": "有機化学反応機構"
    },
    "ko": {
      "title": "유기화학 반응 메커니즘 퀴즈",
      "topicName": "유기화학 반응 메커니즘"
    },
    "ar": {
      "title": "اختبار آليات الكيمياء العضوية",
      "topicName": "آليات الكيمياء العضوية"
    },
    "ru": {
      "title": "Тест по механизмам органической химии",
      "topicName": "Механизмы органической химии"
    },
    "hi": {
      "title": "कार्बनिक रसायन तंत्र प्रश्नोत्तरी",
      "topicName": "कार्बनिक रसायन तंत्र"
    }
  }
};

export const QUIZ_QUESTIONS_TRANSLATIONS = {
  "qm3-1": {
    "es": {
      "question": "Al aplicar integración por partes a ∫ x·e^x dx, ¿cuál elección de u es mejor según LIATE?",
      "options": [
        "u = e^x",
        "u = x",
        "u = x·e^x",
        "u = 1"
      ],
      "explanation": "Las funciones algebraicas (x) van antes que las exponenciales (e^x) en LIATE, por lo que u = x."
    },
    "fr": {
      "question": "En appliquant l'intégration par parties à ∫ x·e^x dx, quel choix de u est le meilleur selon LIATE ?",
      "options": [
        "u = e^x",
        "u = x",
        "u = x·e^x",
        "u = 1"
      ],
      "explanation": "Les fonctions algébriques (x) précèdent les exponentielles (e^x) dans LIATE, donc u = x."
    },
    "de": {
      "question": "Welche Wahl von u ist bei ∫ x·e^x dx nach der LIATE-Regel am besten?",
      "options": [
        "u = e^x",
        "u = x",
        "u = x·e^x",
        "u = 1"
      ],
      "explanation": "Algebraische Funktionen (x) kommen vor Exponentialfunktionen (e^x), also u = x."
    },
    "pt": {
      "question": "Ao aplicar integração por partes a ∫ x·e^x dx, qual escolha de u é a melhor de acordo com LIATE?",
      "options": [
        "u = e^x",
        "u = x",
        "u = x·e^x",
        "u = 1"
      ],
      "explanation": "Funções algébricas (x) vêm antes de exponenciais (e^x) no LIATE, logo u = x."
    },
    "it": {
      "question": "Applicando l'integrazione per parti a ∫ x·e^x dx, quale scelta di u è ottimale secondo LIATE?",
      "options": [
        "u = e^x",
        "u = x",
        "u = x·e^x",
        "u = 1"
      ],
      "explanation": "Le funzioni algebriche (x) precedono quelle esponenziali (e^x) secondo LIATE, quindi u = x."
    },
    "zh": {
      "question": "对 ∫ x·e^x dx 应用分部积分法时，根据 LIATE 原则选取哪个作为 u 最佳？",
      "options": [
        "u = e^x",
        "u = x",
        "u = x·e^x",
        "u = 1"
      ],
      "explanation": "代数多项式 (x) 在 LIATE 中优先于指数函数 (e^x)，因此设 u = x。"
    },
    "ja": {
      "question": "∫ x·e^x dx に部分積分を適用する際、LIATE 則に基づき u として最適なものはどれですか？",
      "options": [
        "u = e^x",
        "u = x",
        "u = x·e^x",
        "u = 1"
      ],
      "explanation": "LIATE 則では代数関数 (x) が指数関数 (e^x) より優先されるため、u = x とします。"
    },
    "ko": {
      "question": "∫ x·e^x dx에 부분적분법을 적용할 때, LIATE 원칙에 따라 u로 가장 적절한 선택은?",
      "options": [
        "u = e^x",
        "u = x",
        "u = x·e^x",
        "u = 1"
      ],
      "explanation": "다항함수(x)가 지수함수(e^x)보다 LIATE에서 앞서므로 u = x로 설정합니다."
    },
    "ar": {
      "question": "عند تطبيق التكامل بالتجزئة على ∫ x·e^x dx، ما هو الخيار الأفضل لـ u وفق قاعدة LIATE؟",
      "options": [
        "u = e^x",
        "u = x",
        "u = x·e^x",
        "u = 1"
      ],
      "explanation": "الدوال الجبرية (x) تسبق الأسية (e^x) في ترتيب LIATE، لذا نضع u = x."
    },
    "ru": {
      "question": "При интегрировании по частям ∫ x·e^x dx какой выбор u наилучший по правилу LIATE?",
      "options": [
        "u = e^x",
        "u = x",
        "u = x·e^x",
        "u = 1"
      ],
      "explanation": "Алгебраические функции (x) предшествуют показательным (e^x) в LIATE, поэтому u = x."
    },
    "hi": {
      "question": "∫ x·e^x dx पर खंडशः समाकलन लागू करते समय, LIATE नियम के अनुसार u का सबसे अच्छा विकल्प क्या है?",
      "options": [
        "u = e^x",
        "u = x",
        "u = x·e^x",
        "u = 1"
      ],
      "explanation": "बीजगणितीय फलन (x) घातांकीय (e^x) से पहले आते हैं, इसलिए u = x चुनें।"
    }
  },
  "qm3-2": {
    "es": {
      "question": "¿Cuál es el resultado de evaluar ∫ x·e^x dx?",
      "options": [
        "x·e^x - e^x + C",
        "x·e^x + e^x + C",
        "e^x/x + C",
        "x²·e^x / 2 + C"
      ],
      "explanation": "∫ x·e^x dx = x·e^x - ∫ e^x dx = x·e^x - e^x + C = e^x(x - 1) + C."
    },
    "fr": {
      "question": "Quel est le résultat du calcul de ∫ x·e^x dx ?",
      "options": [
        "x·e^x - e^x + C",
        "x·e^x + e^x + C",
        "e^x/x + C",
        "x²·e^x / 2 + C"
      ],
      "explanation": "∫ x·e^x dx = x·e^x - ∫ e^x dx = e^x(x - 1) + C."
    },
    "de": {
      "question": "Was ist das Ergebnis von ∫ x·e^x dx?",
      "options": [
        "x·e^x - e^x + C",
        "x·e^x + e^x + C",
        "e^x/x + C",
        "x²·e^x / 2 + C"
      ],
      "explanation": "∫ x·e^x dx = x·e^x - ∫ e^x dx = e^x(x - 1) + C."
    },
    "pt": {
      "question": "Qual é o resultado de calcular ∫ x·e^x dx?",
      "options": [
        "x·e^x - e^x + C",
        "x·e^x + e^x + C",
        "e^x/x + C",
        "x²·e^x / 2 + C"
      ],
      "explanation": "∫ x·e^x dx = x·e^x - ∫ e^x dx = e^x(x - 1) + C."
    },
    "it": {
      "question": "Qual è il risultato del calcolo di ∫ x·e^x dx?",
      "options": [
        "x·e^x - e^x + C",
        "x·e^x + e^x + C",
        "e^x/x + C",
        "x²·e^x / 2 + C"
      ],
      "explanation": "∫ x·e^x dx = x·e^x - ∫ e^x dx = e^x(x - 1) + C."
    },
    "zh": {
      "question": "计算不定积分 ∫ x·e^x dx 的结果是什么？",
      "options": [
        "x·e^x - e^x + C",
        "x·e^x + e^x + C",
        "e^x/x + C",
        "x²·e^x / 2 + C"
      ],
      "explanation": "∫ x·e^x dx = x·e^x - ∫ e^x dx = e^x(x - 1) + C。"
    },
    "ja": {
      "question": "∫ x·e^x dx の不定積分を計算した結果は何ですか？",
      "options": [
        "x·e^x - e^x + C",
        "x·e^x + e^x + C",
        "e^x/x + C",
        "x²·e^x / 2 + C"
      ],
      "explanation": "∫ x·e^x dx = x·e^x - ∫ e^x dx = e^x(x - 1) + C です。"
    },
    "ko": {
      "question": "∫ x·e^x dx의 부정적분 계산 결과는 무엇인가요?",
      "options": [
        "x·e^x - e^x + C",
        "x·e^x + e^x + C",
        "e^x/x + C",
        "x²·e^x / 2 + C"
      ],
      "explanation": "∫ x·e^x dx = x·e^x - ∫ e^x dx = e^x(x - 1) + C입니다."
    },
    "ar": {
      "question": "ما هو ناتج حساب التكامل ∫ x·e^x dx؟",
      "options": [
        "x·e^x - e^x + C",
        "x·e^x + e^x + C",
        "e^x/x + C",
        "x²·e^x / 2 + C"
      ],
      "explanation": "∫ x·e^x dx = x·e^x - ∫ e^x dx = e^x(x - 1) + C."
    },
    "ru": {
      "question": "Каков результат вычисления интеграла ∫ x·e^x dx?",
      "options": [
        "x·e^x - e^x + C",
        "x·e^x + e^x + C",
        "e^x/x + C",
        "x²·e^x / 2 + C"
      ],
      "explanation": "∫ x·e^x dx = x·e^x - ∫ e^x dx = e^x(x - 1) + C."
    },
    "hi": {
      "question": "∫ x·e^x dx का मान क्या है?",
      "options": [
        "x·e^x - e^x + C",
        "x·e^x + e^x + C",
        "e^x/x + C",
        "x²·e^x / 2 + C"
      ],
      "explanation": "∫ x·e^x dx = x·e^x - ∫ e^x dx = e^x(x - 1) + C."
    }
  },
  "qp3-1": {
    "es": {
      "question": "¿Qué significa el signo negativo en la ley de Faraday Ɛ = -dΦ/dt?",
      "options": [
        "Ley de Ohm",
        "Ley de Lenz",
        "Ley de Ampère",
        "Ley de Gauss"
      ],
      "explanation": "La Ley de Lenz establece que la corriente inducida se opone al cambio en el flujo magnético."
    },
    "fr": {
      "question": "Que signifie le signe négatif dans la loi de Faraday Ɛ = -dΦ/dt ?",
      "options": [
        "Loi d'Ohm",
        "Loi de Lenz",
        "Loi d'Ampère",
        "Loi de Gauss"
      ],
      "explanation": "La loi de Lenz indique que le courant induit s'oppose à la variation du flux magnétique."
    },
    "de": {
      "question": "Was bedeutet das Minuszeichen im Faradayschen Gesetz Ɛ = -dΦ/dt?",
      "options": [
        "Ohmsches Gesetz",
        "Lenzsche Regel",
        "Amperesches Gesetz",
        "Gaußsches Gesetz"
      ],
      "explanation": "Die Lenzsche Regel besagt, dass der Induktionsstrom seiner Ursache entgegenwirkt."
    },
    "pt": {
      "question": "O que significa o sinal negativo na Lei de Faraday Ɛ = -dΦ/dt?",
      "options": [
        "Lei de Ohm",
        "Lei de Lenz",
        "Lei de Ampère",
        "Lei de Gauss"
      ],
      "explanation": "A Lei de Lenz afirma que a corrente induzida se opõe à variação do fluxo magnético."
    },
    "it": {
      "question": "Cosa indica il segno negativo nella legge di Faraday Ɛ = -dΦ/dt?",
      "options": [
        "Legge di Ohm",
        "Legge di Lenz",
        "Legge di Ampère",
        "Legge di Gauss"
      ],
      "explanation": "La legge di Lenz afferma che la corrente indotta si oppone alla variazione di flusso magnetico."
    },
    "zh": {
      "question": "法拉第电磁感应定律 Ɛ = -dΦ/dt 中的负号代表什么物理定律？",
      "options": [
        "欧姆定律",
        "楞次定律",
        "安培定律",
        "高斯定律"
      ],
      "explanation": "楞次定律表明感应电流的磁场总是阻碍引起感应电流的磁通量的变化。"
    },
    "ja": {
      "question": "ファラデーの電磁誘導の法則 Ɛ = -dΦ/dt における負号は何を表していますか？",
      "options": [
        "オームの法則",
        "レンツの法則",
        "アンペールの法則",
        "ガウスの法則"
      ],
      "explanation": "レンツの法則は、誘導電流が磁束の変化を妨げる方向に生じることを示しています。"
    },
    "ko": {
      "question": "패러데이 전자기 유도 법칙 Ɛ = -dΦ/dt에서 음의 부호(-)가 의미하는 것은?",
      "options": [
        "옴의 법칙",
        "렌츠의 법칙",
        "앙페르 법칙",
        "가우스 법칙"
      ],
      "explanation": "렌츠의 법칙은 유도 기전력이 자기선속의 변화를 방해하는 방향으로 형성됨을 나타냅니다."
    },
    "ar": {
      "question": "ماذا تعني الإشارة السالبة في قانون فراداي Ɛ = -dΦ/dt؟",
      "options": [
        "قانون أوم",
        "قانون لينز",
        "قانون أمبير",
        "قانون غاوس"
      ],
      "explanation": "ينص قانون لينز على أن التيار الحثي يعاكس التغير في التدفق المغناطيسي الذي أنشأه."
    },
    "ru": {
      "question": "Что означает знак минус в законе Фарадея Ɛ = -dΦ/dt?",
      "options": [
        "Закон Ома",
        "Правило Ленца",
        "Закон Ампера",
        "Закон Гаусса"
      ],
      "explanation": "Правило Ленца гласит, что индукционный ток направлен так, чтобы противодействовать изменению магнитного потока."
    },
    "hi": {
      "question": "फैराडे के नियम Ɛ = -dΦ/dt में ऋणात्मक चिह्न क्या दर्शाता है?",
      "options": [
        "ओम का नियम",
        "लेंज़ का नियम",
        "एम्पीयर का नियम",
        "गॉस का नियम"
      ],
      "explanation": "लेंज़ का नियम कहता है कि प्रेरित धारा चुंबकीय प्रवाह के परिवर्तन का विरोध करती है।"
    }
  },
  "qc3-1": {
    "es": {
      "question": "¿Qué factor favorece fuertemente el mecanismo de reacción SN1 sobre SN2?",
      "options": [
        "Sustrato primario",
        "Nucleófilo fuerte",
        "Sustrato terciario y disolvente prótico polar",
        "Disolvente aprótico"
      ],
      "explanation": "Los sustratos terciarios forman carbocationes estables y los disolventes próticos polares estabilizan el estado de transición iónico en SN1."
    },
    "fr": {
      "question": "Quel facteur favorise fortement le mécanisme réactionnel SN1 par rapport à SN2 ?",
      "options": [
        "Substrat primaire",
        "Nucléophile fort",
        "Substrat tertiaire et solvant protique polaire",
        "Solvant aprotique"
      ],
      "explanation": "Les substrats tertiaires forment des carbocations stables et les solvants protiques stabilisent l'état de transition en SN1."
    },
    "de": {
      "question": "Welcher Faktor begünstigt den SN1-Reaktionsmechanismus gegenüber SN2 stark?",
      "options": [
        "Primäres Substrat",
        "Starkes Nucleophil",
        "Tertiäres Substrat und polares protisches Lösungsmittel",
        "Aprotisches Lösungsmittel"
      ],
      "explanation": "Tertiäre Substrate bilden stabile Carbokationen und polare protische Lösungsmittel stabilisieren den Übergangszustand bei SN1."
    },
    "pt": {
      "question": "Qual fator favorece fortemente o mecanismo de reação SN1 sobre o SN2?",
      "options": [
        "Substrato primário",
        "Nucleófilo forte",
        "Substrato terciário e solvente prótico polar",
        "Solvente aprótico"
      ],
      "explanation": "Substratos terciários formam carbocátions estáveis e solventes próticos polares estabilizam o estado de transição na SN1."
    },
    "it": {
      "question": "Quale fattore favorisce fortemente il meccanismo SN1 rispetto a SN2?",
      "options": [
        "Substrato primario",
        "Nucleofilo forte",
        "Substrato terziario e solvente protico polare",
        "Solvente aprotico"
      ],
      "explanation": "I substrati terziari formano carbocationi stabili e i solventi protici polari stabilizzano lo stato di transizione ionico in SN1."
    },
    "zh": {
      "question": "哪种因素会显著促进 SN1 反应机理优先于 SN2 进行？",
      "options": [
        "伯碳底物",
        "强亲核试剂",
        "叔碳底物和极性质子溶剂",
        "极性非质子溶剂"
      ],
      "explanation": "叔碳底物能形成高稳定性的碳正离子，极性质子溶剂能稳定 SN1 反应的离子过渡态。"
    },
    "ja": {
      "question": "SN2 反応に対して SN1 反応機構を強く促進する要因はどれですか？",
      "options": [
        "第1級基質",
        "強力な求核剤",
        "第3級基質および極性プロトン性溶媒",
        "非プロトン性溶媒"
      ],
      "explanation": "第3級基質は安定なカルボカチオンを生成し、極性プロトン性溶媒は SN1 のイオン性遷移状態を安定化します。"
    },
    "ko": {
      "question": "SN2 반응에 비해 SN1 반응 메커니즘을 강력하게 선호하게 만드는 요인은?",
      "options": [
        "1차 기질",
        "강한 친핵체",
        "3차 기질 및 극성 양성자성 용매",
        "비양성자성 용매"
      ],
      "explanation": "3차 기질은 안정한 탄소 양이온을 형성하며, 극성 양성자성 용매는 SN1의 이온 전이 상태를 안정화합니다."
    },
    "ar": {
      "question": "ما هو العامل الذي يفضل بشدة آلية التفاعل SN1 على SN2؟",
      "options": [
        "ركيزة أولية",
        "نيكليوفيل قوي",
        "ركيزة ثالثية ومذيب بروتوني قطبي",
        "مذيب لا بروتوني"
      ],
      "explanation": "الركائز الثالثية تشكل كربوكاتيونات مستقرة والمذيبات البروتونية القطبية تثبت الحالة الانتقالية في SN1."
    },
    "ru": {
      "question": "Какой фактор сильнее всего способствует механизму реакции SN1 по сравнению с SN2?",
      "options": [
        "Первичный субстрат",
        "Сильный нуклеофил",
        "Третичный субстрат и полярный протонный растворитель",
        "Апротонный растворитель"
      ],
      "explanation": "Третичные субстраты образуют стабильные карбокатионы, а полярные протонные растворители стабилизируют переходное состояние в SN1."
    },
    "hi": {
      "question": "कौन सा कारक SN2 के मुकाबले SN1 अभिक्रिया तंत्र का दृढ़ता से समर्थन करता है?",
      "options": [
        "प्राथमिक सब्सट्रेट",
        "मजबूत न्यूक्लियोफाइल",
        "तृतीयक सब्सट्रेट और ध्रुवीय प्रोटिक विलायक",
        "एप्रोटिक विलायक"
      ],
      "explanation": "तृतीयक सब्सट्रेट स्थिर कार्बोकैटायन बनाते हैं और ध्रुवीय प्रोटिक विलायक SN1 में आयनिक संक्रमण अवस्था को स्थिर करते हैं।"
    }
  }
};

export function getLocalizedCards(cards = [], lang = 'en') {
  if (!cards || !Array.isArray(cards)) return [];
  const normLang = normalizeLanguageCode(lang);
  if (!normLang || normLang === 'en') return cards;

  return cards.map(c => {
    const cardTrans = CARDS_TRANSLATIONS[c.id]?.[normLang];
    if (!cardTrans) return c;
    return {
      ...c,
      category: cardTrans.category || c.category,
      question: cardTrans.question || c.question,
      hint: cardTrans.hint || c.hint,
      answer: cardTrans.answer || c.answer,
      explanation: cardTrans.explanation || c.explanation,
      takeaway: cardTrans.takeaway || c.takeaway,
    };
  });
}

export function getLocalizedQuizzes(quizzes = [], lang = 'en') {
  if (!quizzes || !Array.isArray(quizzes)) return [];
  const normLang = normalizeLanguageCode(lang);
  if (!normLang || normLang === 'en') return quizzes;

  return quizzes.map(q => {
    const qTitleTrans = QUIZ_TITLES_TRANSLATIONS[q.id]?.[normLang];
    const localizedQuestions = (q.questions || []).map(question => {
      const qTrans = QUIZ_QUESTIONS_TRANSLATIONS[question.id]?.[normLang];
      if (!qTrans) return question;
      return {
        ...question,
        question: qTrans.question || question.question,
        options: qTrans.options || question.options,
        explanation: qTrans.explanation || question.explanation,
      };
    });

    return {
      ...q,
      title: qTitleTrans?.title || q.title,
      topicName: qTitleTrans?.topicName || q.topicName,
      questions: localizedQuestions,
    };
  });
}
