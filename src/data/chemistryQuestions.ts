export type TopicId = "sulfur" | "so2" | "h2so4" | "true_false";

export interface McqOption {
  key: "A" | "B" | "C" | "D";
  text: string;
}

export interface TfStatement {
  key: "a" | "b" | "c" | "d";
  text: string;
  isTrue: boolean;
  explanation: string;
}

export type IllustrationId =
  | "s8_ring"
  | "so2_collection"
  | "so2_drying"
  | "mgso4_chalk"
  | "fe_s_lab"
  | "s_o2_lab"
  | "cu_h2so4_lab"
  | "sugar_h2so4_lab"
  | "contact_process";

export interface ChemistryQuestion {
  id: number;
  code: string;
  topic: TopicId;
  topicLabel: string;
  type: "mcq" | "true_false";
  stem: string;
  subItems?: string[];
  illustrationId?: IllustrationId;
  illustrationCaption?: string;
  options?: McqOption[];
  correctOption?: "A" | "B" | "C" | "D";
  statements?: TfStatement[];
  explanation: string;
  keyFormula: string;
  difficulty: "Nhận biết" | "Thông hiểu" | "Vận dụng";
}

export const TOPICS_META: {
  id: TopicId;
  title: string;
  subtitle: string;
  formulaBadge: string;
  questionRange: string;
  count: number;
  accentColor: string;
  description: string;
}[] = [
  {
    id: "sulfur",
    title: "Đơn chất Sulfur (Lưu huỳnh)",
    subtitle: "Cấu tạo phân tử S₈, tính chất vật lí, hóa học & khoáng vật tự nhiên",
    formulaBadge: "₁₆S • M = 32",
    questionRange: "Câu 1 – Câu 12",
    count: 12,
    accentColor: "amber",
    description:
      "Vị trí ô 16, chu kì 3, nhóm VIA; mạch vòng S₈; tính oxi hóa (tác dụng Fe, Hg, H₂) và tính khử (tác dụng O₂, F₂); quặng pyrite FeS₂ và thạch cao.",
  },
  {
    id: "so2",
    title: "Sulfur dioxide (SO₂)",
    subtitle: "Acidic oxide, tính khử - tính oxi hóa, điều chế, làm khô & môi trường",
    formulaBadge: "SO₂ • S⁺⁴",
    questionRange: "Câu 13 – Câu 24",
    count: 12,
    accentColor: "sky",
    description:
      "Khí mùi hắc, tan tốt trong nước; vừa có tính khử vừa có tính oxi hóa; thu khí với bông tẩm nước vôi, làm khô bằng P₂O₅; tác nhân gây mưa acid.",
  },
  {
    id: "h2so4",
    title: "Sulfuric acid & Muối Sulfate",
    subtitle: "Tính chất H₂SO₄ đặc, quy tắc pha loãng an toàn, phương pháp tiếp xúc & muối sulfate",
    formulaBadge: "H₂SO₄ • SO₄²⁻",
    questionRange: "Câu 25 – Câu 40",
    count: 16,
    accentColor: "teal",
    description:
      "Quy tắc rót từ từ acid vào nước, tính háo nước và oxi hóa mạnh của H₂SO₄ đặc, sản xuất oleum H₂SO₄·nSO₃, nhận biết SO₄²⁻ bằng Ba²⁺ và ứng dụng muối sulfate.",
  },
  {
    id: "true_false",
    title: "Đúng / Sai & Thí Nghiệm Thực Hành",
    subtitle: "7 câu hỏi chùm Đúng/Sai (28 mệnh đề) phân tích thí nghiệm & sản xuất công nghiệp",
    formulaBadge: "Đúng / Sai (4 ý)",
    questionRange: "Câu 41 – Câu 47",
    count: 7,
    accentColor: "violet",
    description:
      "Phân tích chuyên sâu các bước thí nghiệm Fe + S, S + O₂, SO₂ + H₂S/Br₂, Cu + H₂SO₄ đặc nóng, H₂SO₄ đặc + đường mía C₁₂H₂₂O₁₁ và dây chuyền sản xuất H₂SO₄.",
  },
];

export const CHEMISTRY_QUESTIONS: ChemistryQuestion[] = [
  // ==================== PHẦN 1: SULFUR (Câu 1 - 12) ====================
  {
    id: 1,
    code: "Câu 1",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Trong tự nhiên, đơn chất sulfur được phân bố ở vùng lân cận núi lửa và suối nước nóng. Khi núi lửa hoạt động, sulfur được giải phóng ra khỏi lõi Trái Đất chủ yếu ở dạng",
    options: [
      { key: "A", text: "SO₂." },
      { key: "B", text: "S." },
      { key: "C", text: "H₂S." },
      { key: "D", text: "SO₂ và H₂S." },
    ],
    correctOption: "D",
    explanation:
      "Khi núi lửa phun trào, các hợp chất khí chứa lưu huỳnh từ trong lòng Trái Đất thoát ra chủ yếu dưới dạng khí SO₂ (sulfur dioxide) và H₂S (hydrogen sulfide). Hai khí này cũng phản ứng với nhau (SO₂ + 2H₂S → 3S + 2H₂O) tạo thành đơn chất S bám quanh miệng núi lửa.",
    keyFormula: "SO₂ & H₂S",
    difficulty: "Nhận biết",
  },
  {
    id: 2,
    code: "Câu 2",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Sulfur được dân gian sử dụng để pha chế vào thuốc trị các bệnh ngoài da. Tên gọi dân gian của sulfur là",
    options: [
      { key: "A", text: "diêm sinh." },
      { key: "B", text: "đá vôi." },
      { key: "C", text: "phèn chua." },
      { key: "D", text: "giấm ăn." },
    ],
    correctOption: "A",
    explanation:
      "Trong dân gian và y học cổ truyền, lưu huỳnh (sulfur) được gọi là 'diêm sinh' (hoặc lưu hoàng), có tính sát khuẩn, trị ghẻ lở và các bệnh ngoài da. Đá vôi là CaCO₃, phèn chua là KAl(SO₄)₂·12H₂O, giấm ăn là dung dịch CH₃COOH 2–5%.",
    keyFormula: "S = Diêm sinh",
    difficulty: "Nhận biết",
  },
  {
    id: 3,
    code: "Câu 3",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Thạch cao sống là một dạng tồn tại phổ biến của sulfur trong tự nhiên, được sử dụng làm nguyên liệu để sản xuất xi măng, phấn viết bảng,... Công thức của thạch cao sống là",
    options: [
      { key: "A", text: "BaSO₄." },
      { key: "B", text: "CaSO₄.2H₂O." },
      { key: "C", text: "MgSO₄." },
      { key: "D", text: "CuSO₄.5H₂O." },
    ],
    correctOption: "B",
    explanation:
      "Phân biệt 3 loại thạch cao quan trọng:\n• Thạch cao sống: CaSO₄.2H₂O (dùng làm phụ gia xi măng, phấn viết bảng).\n• Thạch cao nung: CaSO₄.0,5H₂O hoặc CaSO₄.H₂O (dùng đúc tượng, bó bột).\n• Thạch cao khan: CaSO₄.",
    keyFormula: "CaSO₄·2H₂O",
    difficulty: "Nhận biết",
  },
  {
    id: 4,
    code: "Câu 4",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Trong tự nhiên, đồng vị của sulfur chiếm thành phần nhiều nhất là",
    options: [
      { key: "A", text: "³⁴S." },
      { key: "B", text: "³²S." },
      { key: "C", text: "³⁶S." },
      { key: "D", text: "³³S." },
    ],
    correctOption: "B",
    explanation:
      "Trong tự nhiên, sulfur có 4 đồng vị bền là ³²S (chiếm khoảng 94,99%), ³³S (0,75%), ³⁴S (4,25%) và ³⁶S (0,01%). Do đó đồng vị ³²S chiếm tỉ lệ lớn nhất (nguyên tử khối trung bình ≈ 32,06).",
    keyFormula: "³²S (94,99%)",
    difficulty: "Nhận biết",
  },
  {
    id: 5,
    code: "Câu 5",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Sulfur đóng vai trò chất khử khi tác dụng với đơn chất nào sau đây?",
    options: [
      { key: "A", text: "Fe." },
      { key: "B", text: "O₂." },
      { key: "C", text: "H₂." },
      { key: "D", text: "Hg." },
    ],
    correctOption: "B",
    explanation:
      "Sulfur (S⁰) thể hiện tính khử (số oxi hóa tăng từ 0 lên +4 hoặc +6) khi tác dụng với các phi kim có độ âm điện lớn hơn như O₂, F₂, Cl₂:\nS⁰ + O₂⁰ → S⁺⁴O₂⁻².\nKhi tác dụng với kim loại (Fe, Hg) hoặc H₂, S đóng vai trò chất oxi hóa (giảm từ 0 xuống -2).",
    keyFormula: "S⁰ + O₂ → S⁺⁴O₂",
    difficulty: "Thông hiểu",
  },
  {
    id: 6,
    code: "Câu 6",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Khi nhiệt kế thuỷ ngân vỡ, rắc chất bột nào sau đây lên thuỷ ngân rơi vãi sẽ chuyển hoá chúng thành hợp chất bền, ít độc hại?",
    options: [
      { key: "A", text: "Than đá." },
      { key: "B", text: "Đá vôi." },
      { key: "C", text: "Muối ăn." },
      { key: "D", text: "Sulfur." },
    ],
    correctOption: "D",
    explanation:
      "Mercury (thủy ngân - Hg) là kim loại lỏng rất độc, dễ bay hơi. Chỉ riêng Hg tác dụng được với bột sulfur (S) ngay ở nhiệt độ thường tạo thành muối mercury(II) sulfide (HgS) kết tủa rắn bền, không bay hơi:\nHg + S → HgS (ngay ở điều kiện thường).",
    keyFormula: "Hg + S → HgS",
    difficulty: "Nhận biết",
  },
  {
    id: 7,
    code: "Câu 7",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Cho các phản ứng sau. Số phản ứng trong đó sulfur đơn chất đóng vai trò chất khử là",
    subItems: [
      "(a) S + O₂ ⟶ SO₂;",
      "(b) S + 3F₂ ⟶ SF₆;",
      "(c) Hg + S ⟶ HgS;",
      "(d) H₂ + S ⟶ H₂S.",
    ],
    options: [
      { key: "A", text: "1." },
      { key: "B", text: "2." },
      { key: "C", text: "3." },
      { key: "D", text: "4." },
    ],
    correctOption: "B",
    explanation:
      "Xét sự thay đổi số oxi hóa của S trong từng phản ứng:\n• (a) S⁰ + O₂ → S⁺⁴O₂ (S tăng từ 0 lên +4 → Chất khử)\n• (b) S⁰ + 3F₂ → S⁺⁶F₆ (S tăng từ 0 lên +6 → Chất khử)\n• (c) Hg + S⁰ → Hg⁺²S⁻² (S giảm từ 0 xuống -2 → Chất oxi hóa)\n• (d) H₂ + S⁰ → H₂S⁻² (S giảm từ 0 xuống -2 → Chất oxi hóa)\nVậy có 2 phản ứng (a) và (b) trong đó sulfur đóng vai trò chất khử.",
    keyFormula: "(a) SO₂ & (b) SF₆",
    difficulty: "Thông hiểu",
  },
  {
    id: 8,
    code: "Câu 8",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Trong công nghiệp, phần lớn sulfur đơn chất sau khi khai thác ở các mỏ được dùng làm nguyên liệu để",
    options: [
      { key: "A", text: "lưu hoá cao su tự nhiên." },
      { key: "B", text: "sản xuất sulfuric acid." },
      { key: "C", text: "điều chế thuốc bảo vệ thực vật." },
      { key: "D", text: "bào chế thuốc đông y." },
    ],
    correctOption: "B",
    explanation:
      "Khoảng 90% lượng sulfur khai thác trên thế giới được dùng để sản xuất sulfuric acid (H₂SO₄) – hóa chất hàng đầu trong công nghiệp. Khoảng 10% còn lại dùng để lưu hóa cao su, sản xuất diêm, thuốc trừ sâu, dược phẩm,...",
    keyFormula: "90% S → H₂SO₄",
    difficulty: "Nhận biết",
  },
  {
    id: 9,
    code: "Câu 9",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Sulfur có kí hiệu hóa học là S, số hiệu nguyên tử là 16, độ âm điện là 2,58. Trong bảng tuần hoàn, sulfur ở",
    options: [
      { key: "A", text: "ô số 8, chu kì 3, nhóm VIA." },
      { key: "B", text: "ô số 16, chu kì 3, nhóm VIA." },
      { key: "C", text: "ô số 32, chu kì 3, nhóm VIA." },
      { key: "D", text: "ô số 16, chu kì 3, nhóm IIA." },
    ],
    correctOption: "B",
    explanation:
      "Cấu hình electron của Sulfur (Z = 16): 1s² 2s² 2p⁶ 3s² 3p⁴ ([Ne]3s²3p⁴).\n• Số hiệu nguyên tử Z = 16 → Ô số 16.\n• Có 3 lớp electron → Chu kì 3.\n• Có 6 electron lớp ngoài cùng, nguyên tố p → Nhóm VIA (chalcogen).",
    keyFormula: "Z=16, CK 3, VIA",
    difficulty: "Nhận biết",
  },
  {
    id: 10,
    code: "Câu 10",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Phần lớn sulfur tồn tại ở dạng hợp chất trong thành phần của các khoáng vật, như quặng pyrite, thạch cao, barite,... Thành phần chính của quặng pyrite là",
    options: [
      { key: "A", text: "FeS." },
      { key: "B", text: "FeS₂." },
      { key: "C", text: "CaSO₄." },
      { key: "D", text: "BaSO₄." },
    ],
    correctOption: "B",
    explanation:
      "Quặng pyrite (pyrite sắt, hay 'vàng của kẻ ngốc' vì có ánh kim màu vàng đồng) có thành phần chính là hợp chất FeS₂ (iron(II) disulfide). Còn CaSO₄.2H₂O là thạch cao, BaSO₄ là quặng barite.",
    keyFormula: "Quặng Pyrite: FeS₂",
    difficulty: "Nhận biết",
  },
  {
    id: 11,
    code: "Câu 11",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Ở dạng phân tử, sulfur gồm các nguyên tử liên kết cộng hóa trị với nhau tạo thành mạch vòng. Để đơn giản, người ta dùng kí hiệu S. Số nguyên tử sulfur ở dạng mạch vòng là",
    illustrationId: "s8_ring",
    illustrationCaption: "Mô hình cấu trúc phân tử mạch vòng hình vương miện của Sulfur (S₈)",
    options: [
      { key: "A", text: "4." },
      { key: "B", text: "6." },
      { key: "C", text: "8." },
      { key: "D", text: "2." },
    ],
    correctOption: "C",
    explanation:
      "Ở điều kiện thường, phân tử sulfur gồm 8 nguyên tử (S₈) liên kết cộng hóa trị không phân cực với nhau tạo thành mạch vòng khép kín có dạng hình vương miện (crown ring). Trong các phương trình hóa học, người ta viết gọn là S.",
    keyFormula: "Phân tử vòng S₈",
    difficulty: "Nhận biết",
  },
  {
    id: 12,
    code: "Câu 12",
    topic: "sulfur",
    topicLabel: "Sulfur (S)",
    type: "mcq",
    stem: "Cho các phát biểu sau. Số phát biểu đúng là",
    subItems: [
      "(a) Trong tự nhiên, sulfur tồn tại chủ yếu ở dạng muối sulfide và muối sulfate của một số kim loại.",
      "(b) Là một phi kim khá hoạt động nên trong tự nhiên không tìm thấy sulfur đơn chất.",
      "(c) Trứng gà ung có mùi thối đặc trưng một phần là do các hợp chất của sulfur có trong trứng phân huỷ gây ra.",
      "(d) Nguyên tố sulfur có mặt trong một số loại thực vật, đặc biệt là các loại rau quả có mùi mạnh như hành tây, sầu riêng,...",
      "(e) Thành phần chính của quặng pyrite là hợp chất của sulfur và lead (Pb).",
    ],
    options: [
      { key: "A", text: "3." },
      { key: "B", text: "2." },
      { key: "C", text: "4." },
      { key: "D", text: "5." },
    ],
    correctOption: "A",
    explanation:
      "Phân tích từng phát biểu:\n• (a) Đúng (như FeS₂, ZnS, PbS, CaSO₄.2H₂O, BaSO₄,...).\n• (b) Sai vì trong tự nhiên sulfur tồn tại cả ở dạng đơn chất (các mỏ lưu huỳnh gần núi lửa) và dạng hợp chất.\n• (c) Đúng (do protein chứa lưu huỳnh phân hủy sinh ra khí H₂S có mùi trứng thối).\n• (d) Đúng (các hợp chất hữu cơ chứa S tạo mùi đặc trưng cho hành, tỏi, sầu riêng).\n• (e) Sai vì quặng pyrite là FeS₂ (hợp chất của S và Fe, còn PbS là quặng galena).\nVậy có 3 phát biểu đúng là (a), (c), (d).",
    keyFormula: "Đúng: (a), (c), (d)",
    difficulty: "Vận dụng",
  },

  // ==================== PHẦN 2: SULFUR DIOXIDE (Câu 13 - 24) ====================
  {
    id: 13,
    code: "Câu 13",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Quá trình đốt than sinh ra nhiều loại khí thải, trong đó có khí SO₂. Khí SO₂ mùi xốc và có khả năng gây viêm đường hô hấp. Tên gọi của SO₂ là",
    options: [
      { key: "A", text: "sulfur trioxide." },
      { key: "B", text: "sulfuric acid." },
      { key: "C", text: "sulfur dioxide." },
      { key: "D", text: "hydrogen sulfide." },
    ],
    correctOption: "C",
    explanation:
      "Theo danh pháp IUPAC: SO₂ gọi là sulfur dioxide (hoặc sulfur(IV) oxide); SO₃ là sulfur trioxide; H₂SO₄ là sulfuric acid; H₂S là hydrogen sulfide.",
    keyFormula: "SO₂: sulfur dioxide",
    difficulty: "Nhận biết",
  },
  {
    id: 14,
    code: "Câu 14",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Trong số các chất khí: SO₂, CO₂, O₂, N₂. Khí tan tốt trong nước ở điều kiện thường là",
    options: [
      { key: "A", text: "O₂." },
      { key: "B", text: "CO₂." },
      { key: "C", text: "SO₂." },
      { key: "D", text: "N₂." },
    ],
    correctOption: "C",
    explanation:
      "SO₂ là phân tử phân cực và tác dụng một phần với nước (SO₂ + H₂O ⇌ H₂SO₃), ở 20°C 1 thể tích nước hòa tan được khoảng 40 thể tích khí SO₂. Trong khi đó O₂, N₂ rất ít tan và CO₂ tan ít hơn nhiều (1 lít nước chỉ hòa tan khoảng 1 lít CO₂).",
    keyFormula: "SO₂ tan nhiều trong H₂O",
    difficulty: "Nhận biết",
  },
  {
    id: 15,
    code: "Câu 15",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Một bạn học sinh thu khí SO₂ vào bình tam giác và đậy miệng bình bằng bông tẩm dung dịch E (để giữ không cho khí SO₂ bay ra) theo sơ đồ bên. Theo em, để hiệu quả nhất, bạn học sinh cần sử dụng E là dung dịch nào sau đây?",
    illustrationId: "so2_collection",
    illustrationCaption: "Sơ đồ thu khí SO₂ vào bình tam giác có nút bông tẩm dung dịch E ở miệng bình",
    options: [
      { key: "A", text: "Giấm ăn." },
      { key: "B", text: "Muối ăn." },
      { key: "C", text: "Nước vôi." },
      { key: "D", text: "Nước máy." },
    ],
    correctOption: "C",
    explanation:
      "SO₂ là một acidic oxide độc, mùi hắc. Để ngăn SO₂ thoát ra ngoài gây độc, bông ở miệng bình phải tẩm dung dịch kiềm (base) như NaOH hoặc nước vôi trong Ca(OH)₂ để trung hòa và giữ lại khí SO₂:\nSO₂ + Ca(OH)₂ → CaSO₃↓ + H₂O.",
    keyFormula: "SO₂ + Ca(OH)₂ → CaSO₃↓ + H₂O",
    difficulty: "Thông hiểu",
  },
  {
    id: 16,
    code: "Câu 16",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Sau khi điều chế, khí SO₂ có lẫn hơi nước được dẫn qua bình làm khô chứa các hạt chất rắn T rồi thu vào bình chứa theo hình vẽ sau. Chất T có thể là",
    illustrationId: "so2_drying",
    illustrationCaption: "Hệ thống bình làm khô khí SO₂ bằng chất rắn T và bình thu khí SO₂ khô",
    options: [
      { key: "A", text: "KOH." },
      { key: "B", text: "NaOH." },
      { key: "C", text: "CaO." },
      { key: "D", text: "P₂O₅." },
    ],
    correctOption: "D",
    explanation:
      "Nguyên tắc chọn chất làm khô: Hút nước mạnh nhưng KHÔNG phản ứng với khí cần làm khô.\nVì SO₂ là acidic oxide nên sẽ phản ứng với các chất có tính kiềm/base như KOH, NaOH, CaO. Do đó phải dùng chất làm khô có tính acid là hạt rắn P₂O₅ (phosphorus pentoxide).",
    keyFormula: "Làm khô SO₂ bằng P₂O₅",
    difficulty: "Thông hiểu",
  },
  {
    id: 17,
    code: "Câu 17",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Ở điều kiện thích hợp, sulfur dioxide đóng vai trò là chất oxi hoá khi tham gia phản ứng với chất nào sau đây?",
    options: [
      { key: "A", text: "NO₂." },
      { key: "B", text: "H₂S." },
      { key: "C", text: "NaOH." },
      { key: "D", text: "Ca(OH)₂." },
    ],
    correctOption: "B",
    explanation:
      "Khi tác dụng với chất khử mạnh là H₂S, số oxi hóa của S trong SO₂ giảm từ +4 xuống 0 (thể hiện tính oxi hóa):\nS⁺⁴O₂ + 2H₂S⁻² → 3S⁰↓ (vàng) + 2H₂O.\nVới NO₂ thì SO₂ đóng vai trò chất khử (SO₂ + NO₂ → SO₃ + NO); với NaOH và Ca(OH)₂ là phản ứng trao đổi không thay đổi số oxi hóa.",
    keyFormula: "SO₂ + 2H₂S → 3S↓ + 2H₂O",
    difficulty: "Thông hiểu",
  },
  {
    id: 18,
    code: "Câu 18",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Cho các chất khí sau: H₂S, NO, NO₂, SO₂. Số khí gây ô nhiễm môi trường khi phát thải vào không khí là",
    options: [
      { key: "A", text: "1." },
      { key: "B", text: "4." },
      { key: "C", text: "3." },
      { key: "D", text: "2." },
    ],
    correctOption: "B",
    explanation:
      "Cả 4 chất khí H₂S (khí độc mùi trứng thối), NO, NO₂ (khí độc NOₓ gây khói mù quang hóa và mưa acid) và SO₂ (khí độc mùi hắc gây mưa acid) đều là các khí gây ô nhiễm môi trường không khí nghiêm trọng.",
    keyFormula: "Cả 4 khí: H₂S, NO, NO₂, SO₂",
    difficulty: "Nhận biết",
  },
  {
    id: 19,
    code: "Câu 19",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Cho cân bằng hóa học sau: 2SO₂(g) + O₂(g) ⇌ 2SO₃(g); ΔᵣH°₂₉₈ < 0. Khi tăng nhiệt độ thì",
    options: [
      { key: "A", text: "tổng số mol khí trong hệ giảm." },
      { key: "B", text: "hiệu suất phản ứng tăng." },
      { key: "C", text: "cân bằng chuyển dịch theo chiều nghịch." },
      { key: "D", text: "nồng độ khí sản phẩm tăng." },
    ],
    correctOption: "C",
    explanation:
      "Phản ứng thuận có ΔᵣH°₂₉₈ < 0 là phản ứng tỏa nhiệt. Theo nguyên lí chuyển dịch cân bằng Le Chatelier, khi tăng nhiệt độ, cân bằng sẽ chuyển dịch theo chiều thu nhiệt, tức là chiều nghịch (làm giảm hiệu suất tạo SO₃ và tăng tổng số mol khí).",
    keyFormula: "ΔH < 0, tăng T → Chiều nghịch",
    difficulty: "Thông hiểu",
  },
  {
    id: 20,
    code: "Câu 20",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Oxide X là chất khí, mùi hắc, độc (gây ho, viêm đường hô hấp). Trong công nghiệp, X được dùng làm chất tẩy trắng bột gỗ, sản xuất sulfuric acid. Công thức của X là",
    options: [
      { key: "A", text: "CO₂." },
      { key: "B", text: "H₂S." },
      { key: "C", text: "SO₂." },
      { key: "D", text: "P₂O₅." },
    ],
    correctOption: "C",
    explanation:
      "SO₂ là oxide ở thể khí, mùi hắc, độc, có khả năng tẩy màu bột giấy/bột gỗ và là chất trung gian quan trọng nhất trong sản xuất H₂SO₄ công nghiệp.",
    keyFormula: "Oxide X = SO₂",
    difficulty: "Nhận biết",
  },
  {
    id: 21,
    code: "Câu 21",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Mưa acid tàn phá nhiều rừng cây, ăn mòn nhiều công trình kiến trúc bằng đá và kim loại. Tác nhân chính tạo ra mưa acid là",
    options: [
      { key: "A", text: "SO₂." },
      { key: "B", text: "H₂S." },
      { key: "C", text: "CO₂." },
      { key: "D", text: "CO." },
    ],
    correctOption: "A",
    explanation:
      "Hai tác nhân chính gây mưa acid (nước mưa có pH < 5,6) là khí SO₂ và các oxide của nitrogen (NOₓ). Trong khí quyển, SO₂ bị oxi hóa và hợp nước tạo thành H₂SO₄ làm nước mưa có tính acid.",
    keyFormula: "SO₂, NOₓ → Mưa acid",
    difficulty: "Nhận biết",
  },
  {
    id: 22,
    code: "Câu 22",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Cho các ứng dụng sau. Số ứng dụng của khí sulfur dioxide trong đời sống, sản xuất là",
    subItems: [
      "(1) sản xuất sulfuric acid;",
      "(2) tẩy trắng bột giấy;",
      "(3) diệt nấm mốc, thuốc đông y;",
      "(4) diệt trùng nước sinh hoạt.",
    ],
    options: [
      { key: "A", text: "1." },
      { key: "B", text: "2." },
      { key: "C", text: "3." },
      { key: "D", text: "4." },
    ],
    correctOption: "C",
    explanation:
      "Khí SO₂ có 3 ứng dụng đúng là (1) sản xuất H₂SO₄, (2) tẩy trắng bột giấy, đường, và (3) chống nấm mốc cho mây tre đan, dược liệu đông y.\nÝ (4) sai vì diệt trùng nước sinh hoạt thường dùng khí chlorine (Cl₂), ozone (O₃) hoặc hợp chất chloramine chứ không dùng SO₂.",
    keyFormula: "Ứng dụng SO₂: (1), (2), (3)",
    difficulty: "Thông hiểu",
  },
  {
    id: 23,
    code: "Câu 23",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Phát biểu nào diễn tả đúng tính chất hóa học của SO₂?",
    options: [
      { key: "A", text: "SO₂ chỉ có tính khử." },
      { key: "B", text: "SO₂ chỉ có tính oxi hoá." },
      { key: "C", text: "SO₂ vừa có tính khử, vừa có tính oxi hoá." },
      { key: "D", text: "SO₂ không có tính khử và không có tính oxi hoá." },
    ],
    correctOption: "C",
    explanation:
      "Trong SO₂, nguyên tố S có số oxi hóa trung gian +4 (nằm giữa mức thấp nhất -2 và cao nhất +6). Vì vậy khi tham gia phản ứng oxi hóa - khử, SO₂ có thể giảm xuống 0 (tính oxi hóa) hoặc tăng lên +6 (tính khử).",
    keyFormula: "S⁻² ← S⁺⁴ (SO₂) → S⁺⁶",
    difficulty: "Nhận biết",
  },
  {
    id: 24,
    code: "Câu 24",
    topic: "so2",
    topicLabel: "Sulfur dioxide (SO₂)",
    type: "mcq",
    stem: "Khí X khi vào cơ thể, khí này kết hợp với nước tạo acid, từ đó làm giảm pH của máu, làm rối loạn nhiều quá trình chuyển hóa trong cơ thể, làm giảm khả năng vận chuyển oxygen của hồng cầu. Vậy, khí X là",
    options: [
      { key: "A", text: "O₂." },
      { key: "B", text: "H₂." },
      { key: "C", text: "SO₂." },
      { key: "D", text: "N₂." },
    ],
    correctOption: "C",
    explanation:
      "Khí SO₂ khi hít vào phổi và đi vào máu sẽ tác dụng với nước tạo thành sulfurous acid (H₂SO₃), làm giảm pH máu, gây viêm đường hô hấp và suy giảm khả năng vận chuyển oxygen của hồng cầu.",
    keyFormula: "SO₂ + H₂O ⇌ H₂SO₃",
    difficulty: "Nhận biết",
  },

  // ==================== PHẦN 3: SULFURIC ACID - SULFATE (Câu 25 - 40) ====================
  {
    id: 25,
    code: "Câu 25",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Quá trình pha loãng dung dịch đậm đặc của acid nào sau đây toả rất nhiều nhiệt nên không được tự ý pha loãng?",
    options: [
      { key: "A", text: "HCl." },
      { key: "B", text: "H₂SO₄." },
      { key: "C", text: "CH₃COOH." },
      { key: "D", text: "HNO₃." },
    ],
    correctOption: "B",
    explanation:
      "Quá trình hydrate hóa H₂SO₄ đặc tỏa ra lượng nhiệt cực kì lớn. Nếu pha loãng sai cách (rót nước vào acid đặc), nước sôi đột ngột làm bắn các giọt acid đặc ra xung quanh gây bỏng nặng.",
    keyFormula: "Pha loãng H₂SO₄ đặc tỏa nhiệt lớn",
    difficulty: "Nhận biết",
  },
  {
    id: 26,
    code: "Câu 26",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Dung dịch acid nào sau đây có khả năng gây bỏng nếu rơi vào da?",
    options: [
      { key: "A", text: "HCl 36%." },
      { key: "B", text: "HNO₃ 63%." },
      { key: "C", text: "H₂SO₄ 98%." },
      { key: "D", text: "H₃PO₄ 85%." },
    ],
    correctOption: "C",
    explanation:
      "Dung dịch H₂SO₄ 98% (sulfuric acid đặc) có tính háo nước mãnh liệt và tính oxi hóa rất mạnh, lại tỏa nhiệt lớn khi tiếp xúc với nước trong mô tế bào nên gây bỏng hóa chất và hoại tử da cực kì nghiêm trọng ngay khi rơi vào da.",
    keyFormula: "H₂SO₄ 98% gây bỏng nặng",
    difficulty: "Nhận biết",
  },
  {
    id: 27,
    code: "Câu 27",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Khi pha loãng dung dịch sulfuric acid đặc cần tuân thủ thao tác nào sau đây để đảm bảo an toàn?",
    options: [
      { key: "A", text: "Rót từ từ acid vào nước." },
      { key: "B", text: "Rót nhanh acid vào nước." },
      { key: "C", text: "Rót từ từ nước vào acid." },
      { key: "D", text: "Rót nhanh nước vào acid." },
    ],
    correctOption: "A",
    explanation:
      "Quy tắc vàng khi pha loãng H₂SO₄ đặc: Rót TỪ TỪ acid đặc vào nước (theo đũa thủy tinh) và khuấy nhẹ bằng đũa thủy tinh. Tuyệt đối KHÔNG làm ngược lại (không đổ nước vào acid đặc).",
    keyFormula: "Rót từ từ Acid → Nước",
    difficulty: "Nhận biết",
  },
  {
    id: 28,
    code: "Câu 28",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Chất nào sau đây không bay hơi ở điều kiện thường do có nhiệt độ sôi rất cao?",
    options: [
      { key: "A", text: "H₂O." },
      { key: "B", text: "HNO₃." },
      { key: "C", text: "NH₃." },
      { key: "D", text: "H₂SO₄." },
    ],
    correctOption: "D",
    explanation:
      "H₂SO₄ là chất lỏng sánh như dầu, không màu, KHÔNG bay hơi ở điều kiện thường vì có nhiệt độ sôi rất cao (khoảng 337°C) do liên kết hydrogen rất bền giữa các phân tử.",
    keyFormula: "H₂SO₄ khó bay hơi (t°s ≈ 337°C)",
    difficulty: "Nhận biết",
  },
  {
    id: 29,
    code: "Câu 29",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Bước sơ cứu đầu tiên cần làm ngay khi một người bị bỏng sulfuric acid là",
    options: [
      { key: "A", text: "rửa với nước lạnh nhiều lần." },
      { key: "B", text: "trung hoà acid bằng NaHCO₃." },
      { key: "C", text: "băng bó tạm thời vết bỏng." },
      { key: "D", text: "đưa đến cơ sở y tế gần nhất." },
    ],
    correctOption: "A",
    explanation:
      "Khi bị bỏng sulfuric acid, bước sơ cứu ĐẦU TIÊN cần làm ngay lập tức là xả rửa vết bỏng dưới vòi nước sạch (nước lạnh) chảy mạnh nhiều lần trong 15–20 phút để rửa trôi nhanh acid và giải nhiệt, sau đó mới trung hòa nhẹ và đưa tới cơ sở y tế.",
    keyFormula: "Sơ cứu: Rửa nước lạnh nhiều lần",
    difficulty: "Nhận biết",
  },
  {
    id: 30,
    code: "Câu 30",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Ở thể lỏng, chất nào sau đây có dạng sánh như dầu do tồn tại liên kết hydrogen rất mạnh giữa các phân tử?",
    options: [
      { key: "A", text: "HF." },
      { key: "B", text: "H₂SO₄." },
      { key: "C", text: "H₂O." },
      { key: "D", text: "CH₃COOH." },
    ],
    correctOption: "B",
    explanation:
      "Phân tử H₂SO₄ có hai nhóm –OH và hai nguyên tử O liên kết đôi với S, tạo mạng lưới liên kết hydrogen liên phân tử rất mạnh, làm cho H₂SO₄ đặc ở thể lỏng có độ nhớt cao, sánh như dầu và nặng gần gấp đôi nước (D ≈ 1,84 g/cm³).",
    keyFormula: "H₂SO₄ sánh như dầu",
    difficulty: "Nhận biết",
  },
  {
    id: 31,
    code: "Câu 31",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Nhỏ 1 giọt dung dịch acid đặc nào sau đây lên tờ giấy trắng thì tờ giấy bị hoá đen ở chỗ tiếp xúc với acid?",
    options: [
      { key: "A", text: "HBr." },
      { key: "B", text: "HCl." },
      { key: "C", text: "HNO₃." },
      { key: "D", text: "H₂SO₄." },
    ],
    correctOption: "D",
    explanation:
      "Giấy trắng có thành phần chính là cellulose (C₆H₁₀O₅)ₙ. Dung dịch H₂SO₄ đặc có tính háo nước mạnh sẽ chiếm các nguyên tố H và O (dưới dạng H₂O) trong cellulose, để lại muội than (carbon - C) màu đen.",
    keyFormula: "(C₆H₁₀O₅)ₙ → 6nC (đen) + 5nH₂O",
    difficulty: "Nhận biết",
  },
  {
    id: 32,
    code: "Câu 32",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Trong công nghiệp sản xuất sulfuric acid, sulfur trioxide được hấp thụ vào dung dịch sulfuric acid đặc tạo thành những hợp chất có công thức chung là",
    options: [
      { key: "A", text: "H₂S₂O₇." },
      { key: "B", text: "H₂SO₄." },
      { key: "C", text: "H₂SO₄.nSO₃." },
      { key: "D", text: "(SO₃)ₙ." },
    ],
    correctOption: "C",
    explanation:
      "Hấp thụ khí SO₃ bằng dung dịch H₂SO₄ đặc (98%) thu được hỗn hợp các acid có công thức chung là H₂SO₄.nSO₃, gọi là oleum:\nH₂SO₄ + nSO₃ → H₂SO₄.nSO₃.",
    keyFormula: "Oleum: H₂SO₄·nSO₃",
    difficulty: "Nhận biết",
  },
  {
    id: 33,
    code: "Câu 33",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Trong công nghiệp sản xuất sulfuric acid, hai nguồn nguyên liệu được khai thác từ mỏ để cung cấp nguyên tố sulfur (S) là",
    options: [
      { key: "A", text: "ZnS, PbS." },
      { key: "B", text: "H₂S, SO₂." },
      { key: "C", text: "CaSO₄, BaSO₄." },
      { key: "D", text: "S, FeS₂." },
    ],
    correctOption: "D",
    explanation:
      "Trong phương pháp tiếp xúc sản xuất H₂SO₄, nguyên liệu chính khai thác từ mỏ để đốt tạo SO₂ ở giai đoạn 1 là đơn chất sulfur (S) hoặc quặng pyrite sắt (FeS₂).",
    keyFormula: "Nguyên liệu: S và FeS₂",
    difficulty: "Nhận biết",
  },
  {
    id: 34,
    code: "Câu 34",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Trong công nghiệp, sulfuric acid chủ yếu được sản xuất bằng phương pháp tiếp xúc, đi từ nguồn nguyên liệu chính là sulfur, quặng pyrite (chứa FeS₂) qua ba giai đoạn chính. Giai đoạn 3, hấp thụ sulfur trioxide bằng sulfuric acid đặc, tạo ra hỗn hợp oleum. Sau đó, pha loãng oleum vào nước thu được sulfuric acid loãng. Dung dịch sulfuric acid sử dụng để hấp thụ SO₃ có nồng độ là",
    options: [
      { key: "A", text: "70%." },
      { key: "B", text: "80%." },
      { key: "C", text: "98%." },
      { key: "D", text: "60%." },
    ],
    correctOption: "C",
    explanation:
      "Ở giai đoạn 3, người ta dùng dung dịch H₂SO₄ đặc nồng độ khoảng 98% để hấp thụ khí SO₃ trong tháp hấp thụ tạo thành oleum H₂SO₄.nSO₃ (tránh tạo sương mù acid khi dùng nước trực tiếp).",
    keyFormula: "H₂SO₄ đặc 98% hấp thụ SO₃",
    difficulty: "Nhận biết",
  },
  {
    id: 35,
    code: "Câu 35",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Muối X không tan trong nước và các dung môi hữu cơ. Trong y học, X thường được dùng làm chất cản quang trong xét nghiệm X-quang đường tiêu hoá. Công thức của X là",
    options: [
      { key: "A", text: "BaSO₄." },
      { key: "B", text: "Na₂SO₄." },
      { key: "C", text: "K₂SO₄." },
      { key: "D", text: "MgSO₄." },
    ],
    correctOption: "A",
    explanation:
      "Barium sulfate (BaSO₄) là chất rắn màu trắng, không tan trong nước, không tan trong acid dạ dày (HCl) và cản tia X rất tốt nên được uống làm thuốc cản quang khi chụp X-quang đường tiêu hóa.",
    keyFormula: "Thuốc cản quang: BaSO₄",
    difficulty: "Nhận biết",
  },
  {
    id: 36,
    code: "Câu 36",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Phân biệt được dung dịch Na₂SO₄ và NaCl bằng dung dịch nào sau đây?",
    options: [
      { key: "A", text: "MgCl₂." },
      { key: "B", text: "CsCl." },
      { key: "C", text: "HCl." },
      { key: "D", text: "BaCl₂." },
    ],
    correctOption: "D",
    explanation:
      "Dùng dung dịch BaCl₂ (chứa ion Ba²⁺):\n• Dung dịch Na₂SO₄ tạo kết tủa trắng BaSO₄: Na₂SO₄ + BaCl₂ → BaSO₄↓ (trắng) + 2NaCl.\n• Dung dịch NaCl không có hiện tượng.",
    keyFormula: "Ba²⁺ + SO₄²⁻ → BaSO₄↓ trắng",
    difficulty: "Nhận biết",
  },
  {
    id: 37,
    code: "Câu 37",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Cho vài giọt dung dịch BaCl₂ vào dung dịch nào sau đây sẽ tạo kết tủa trắng?",
    options: [
      { key: "A", text: "NaCl." },
      { key: "B", text: "Na₂SO₄." },
      { key: "C", text: "NaNO₃." },
      { key: "D", text: "NaOH." },
    ],
    correctOption: "B",
    explanation:
      "Thuốc thử nhận biết ion sulfate (SO₄²⁻) là dung dịch muối barium (như BaCl₂, Ba(NO₃)₂) hoặc Ba(OH)₂. Khi nhỏ BaCl₂ vào Na₂SO₄ xuất hiện kết tủa trắng BaSO₄ bền trong acid.",
    keyFormula: "Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl",
    difficulty: "Nhận biết",
  },
  {
    id: 38,
    code: "Câu 38",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Magnesium sulfate được sử dụng làm thuốc để cung cấp magnesium cho cơ thể, giúp giảm các cơn đau cơ, giảm hiện tượng chuột rút. Mỗi phân tử magnesium sulfate có thể kết hợp với 7 phân tử nước. Vì vậy, magnesium sulfate còn được sử dụng làm chất hút ẩm, chất hút mồ hôi tay của các vận động viên thể dục dụng cụ. Công thức của magnesium sulfate là",
    illustrationId: "mgso4_chalk",
    illustrationCaption: "Vận động viên sử dụng bột hút ẩm mồ hôi tay chứa magnesium sulfate",
    options: [
      { key: "A", text: "MgSO₄." },
      { key: "B", text: "MgSO₄.7H₂O." },
      { key: "C", text: "MgSO₃." },
      { key: "D", text: "MgSO₃.7H₂O." },
    ],
    correctOption: "A",
    explanation:
      "Đề bài hỏi công thức của 'magnesium sulfate' (muối khan có khả năng kết hợp thêm 7 phân tử H₂O để hút ẩm) nên công thức hóa học của magnesium sulfate là MgSO₄ (còn MgSO₄.7H₂O là muối Epsom / magnesium sulfate heptahydrate sau khi đã ngậm 7 phân tử nước).",
    keyFormula: "Magnesium sulfate: MgSO₄",
    difficulty: "Thông hiểu",
  },
  {
    id: 39,
    code: "Câu 39",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Thạch cao nung có khả năng hút nước và nhanh chóng chuyển lại thành thạch cao. Vì vậy, khi nhào trộn thạch cao nung với nước, nó có khả năng đông cứng rất nhanh. Nhờ tính chất này, thạch cao nung được sử dụng làm vật liệu xây dựng, nặn đúc tượng và khuôn đúc, bó chỉnh hình trong y học. Công thức của thạch cao nung là",
    options: [
      { key: "A", text: "CaSO₄." },
      { key: "B", text: "CaSO₄.2H₂O." },
      { key: "C", text: "CaSO₄.0,5H₂O." },
      { key: "D", text: "CaSO₄.7H₂O." },
    ],
    correctOption: "C",
    explanation:
      "Thạch cao nung có công thức CaSO₄.0,5H₂O (hoặc 2CaSO₄.H₂O / CaSO₄.H₂O tùy điều kiện nhiệt độ nung quanh 150°C). Khi trộn với nước nó kết hợp lại thành thạch cao sống CaSO₄.2H₂O và đông cứng nhanh:\nCaSO₄.0,5H₂O + 1,5H₂O → CaSO₄.2H₂O.",
    keyFormula: "Thạch cao nung: CaSO₄·0,5H₂O",
    difficulty: "Nhận biết",
  },
  {
    id: 40,
    code: "Câu 40",
    topic: "h2so4",
    topicLabel: "Sulfuric acid & Muối Sulfate",
    type: "mcq",
    stem: "Cho các phát biểu sau. Số phát biểu đúng là",
    subItems: [
      "(a) Nhiều muối sulfate tan tốt trong nước nhưng một số muối như CaSO₄, BaSO₄ rất ít tan trong nước.",
      "(b) Magnesium sulfate được dùng làm thuốc điều trị bệnh liên quan đến hồng cầu, dùng làm chất hút mồ hôi tay cho các vận động viên,...",
      "(c) Calcium sulfate là thành phần chính của các loại thạch cao. Phân tử chất này thường ngậm nước với số lượng các phân tử H₂O khác nhau, tạo ra các loại thạch cao có ứng dụng khác nhau.",
      "(d) Barium sulfate là chất rắn màu trắng, hầu như không tan trong nước. Chất này được dùng tạo màu trắng cho các loại giấy chất lượng cao.",
    ],
    options: [
      { key: "A", text: "1." },
      { key: "B", text: "2." },
      { key: "C", text: "3." },
      { key: "D", text: "4." },
    ],
    correctOption: "C",
    explanation:
      "Xét từng phát biểu:\n• (a) Đúng (đa số muối sulfate tan tốt, trừ BaSO₄, SrSO₄, PbSO₄ không tan; CaSO₄, Ag₂SO₄ ít tan).\n• (b) Sai vì muối dùng làm thuốc điều trị bệnh thiếu máu liên quan đến hồng cầu là Iron(II) sulfate (FeSO₄), còn MgSO₄ dùng giảm đau cơ, chuột rút và hút mồ hôi.\n• (c) Đúng.\n• (d) Đúng (BaSO₄ dùng làm chất độn trắng cho giấy cao cấp, sơn và chất cản quang).\nVậy có 3 phát biểu đúng là (a), (c), (d).",
    keyFormula: "Đúng: (a), (c), (d)",
    difficulty: "Vận dụng",
  },

  // ==================== PHẦN 4: ĐÚNG SAI (Câu 41 - 47) ====================
  {
    id: 41,
    code: "Câu 41",
    topic: "true_false",
    topicLabel: "Đúng/Sai & Thí nghiệm",
    type: "true_false",
    stem: "Tiến hành thí nghiệm sulfur tác dụng với iron (Fe) theo các bước sau:",
    subItems: [
      "Bước 1: Trộn đều bột sulfur với bột iron theo tỉ lệ khối lượng khoảng 1 : 1,5.",
      "Bước 2: Lấy khoảng 2 gam hỗn hợp vào ống nghiệm khô chịu nhiệt, dùng bông nút miệng ống nghiệm.",
      "Bước 3: Hơ nóng đều nửa dưới ống nghiệm trên ngọn lửa đèn cồn, sau đó đun tập trung vào phần chứa hỗn hợp.",
    ],
    illustrationId: "fe_s_lab",
    illustrationCaption: "Thí nghiệm đun nóng hỗn hợp bột Fe và bột S trong ống nghiệm chịu nhiệt",
    statements: [
      {
        key: "a",
        text: "Sản phẩm của phản ứng là FeS.",
        isTrue: true,
        explanation:
          "Đúng. Phương trình hóa học: Fe + S ⟶(t°) FeS (iron(II) sulfide, chất rắn màu xám đen).",
      },
      {
        key: "b",
        text: "Trong phản ứng trên sulfur đóng vai trò là chất oxi hóa.",
        isTrue: true,
        explanation:
          "Đúng. Số oxi hóa của S giảm từ 0 (trong S) xuống -2 (trong FeS) nên S là chất oxi hóa.",
      },
      {
        key: "c",
        text: "Trong phản ứng trên sulfur đóng vai trò là chất khử.",
        isTrue: false,
        explanation:
          "Sai. Fe tăng số oxi hóa từ 0 lên +2 nên Fe mới là chất khử, còn S là chất oxi hóa.",
      },
      {
        key: "d",
        text: "Khi đun, cần hơ đều nửa dưới ống nghiệm, sau đó đun tập trung để tránh vỡ ống nghiệm.",
        isTrue: true,
        explanation:
          "Đúng. Nguyên tắc an toàn phòng thí nghiệm khi đun ống nghiệm thủy tinh là hơ nóng đều trước để thủy tinh giãn nở đều, tránh nứt vỡ do sốc nhiệt.",
      },
    ],
    explanation:
      "Phản ứng: Fe⁰ + S⁰ ⟶(t°) Fe⁺²S⁻². Trong đó Fe là chất khử, S là chất oxi hóa. Các mệnh đề a, b, d Đúng; mệnh đề c Sai.",
    keyFormula: "Fe + S → FeS (Đ - Đ - S - Đ)",
    difficulty: "Thông hiểu",
  },
  {
    id: 42,
    code: "Câu 42",
    topic: "true_false",
    topicLabel: "Đúng/Sai & Thí nghiệm",
    type: "true_false",
    stem: "Tiến hành thí nghiệm sulfur tác dụng với oxygen theo các bước sau:",
    subItems: [
      "Bước 1: Lấy một ít bột sulfur vào muôi sắt (đã cắm xuyên qua nút cao su).",
      "Bước 2: Hơ nóng muôi sắt trên ngọn lửa đèn cồn đến khi sulfur nóng chảy và cháy một phần trong không khí.",
      "Bước 3: Đưa nhanh muôi sắt vào bình khí oxygen.",
    ],
    illustrationId: "s_o2_lab",
    illustrationCaption: "Thí nghiệm đốt cháy bột sulfur trong bình chứa khí oxygen nguyên chất",
    statements: [
      {
        key: "a",
        text: "Sản phẩm của phản ứng trên là SO₂.",
        isTrue: true,
        explanation:
          "Đúng. Khi đốt cháy sulfur trong không khí hay trong oxygen đều tạo ra khí sulfur dioxide: S + O₂ ⟶(t°) SO₂.",
      },
      {
        key: "b",
        text: "Trong phản ứng trên sulfur đóng vai trò là chất khử.",
        isTrue: true,
        explanation:
          "Đúng. Số oxi hóa của S tăng từ 0 lên +4 trong SO₂ nên S đóng vai trò là chất khử.",
      },
      {
        key: "c",
        text: "Sulfur cháy trong oxygen mãnh liệt hơn trong không khí.",
        isTrue: true,
        explanation:
          "Đúng. Trong không khí (O₂ chỉ chiếm ~21%) S cháy với ngọn lửa xanh nhạt; khi đưa vào bình O₂ nguyên chất, nồng độ O₂ cao nên S cháy sáng chói, mãnh liệt hơn nhiều.",
      },
      {
        key: "d",
        text: "Trong phản ứng trên sulfur vừa đóng vai trò là chất khử vừa đóng vai trò chất oxi hóa.",
        isTrue: false,
        explanation:
          "Sai. Trong phản ứng S⁰ + O₂⁰ → S⁺⁴O₂⁻², sulfur chỉ tăng số oxi hóa từ 0 lên +4 nên chỉ đóng vai trò là chất khử (O₂ là chất oxi hóa).",
      },
    ],
    explanation:
      "Phản ứng: S⁰ + O₂⁰ ⟶(t°) S⁺⁴O₂⁻². Sulfur cháy trong O₂ mãnh liệt với ngọn lửa màu xanh sáng và chỉ đóng vai trò chất khử. Đáp án: a Đúng, b Đúng, c Đúng, d Sai.",
    keyFormula: "S + O₂ → SO₂ (Đ - Đ - Đ - S)",
    difficulty: "Thông hiểu",
  },
  {
    id: 43,
    code: "Câu 43",
    topic: "true_false",
    topicLabel: "Đúng/Sai & Thí nghiệm",
    type: "true_false",
    stem: "Phát biểu nào sau đây là đúng hay sai về sulfur?",
    statements: [
      {
        key: "a",
        text: "Sulfur là một nguyên tố phi kim, chỉ có tính oxi hoá.",
        isTrue: false,
        explanation:
          "Sai. Sulfur đơn chất có số oxi hóa 0 (trung gian giữa -2 và +4, +6) nên vừa có tính oxi hóa, vừa có tính khử.",
      },
      {
        key: "b",
        text: "Khi tham gia phản ứng, sulfur thể hiện tính oxi hoá hoặc tính khử.",
        isTrue: true,
        explanation:
          "Đúng. Tác dụng với kim loại và H₂ thì S thể hiện tính oxi hóa (0 → -2); tác dụng với O₂, F₂ thì S thể hiện tính khử (0 → +4, +6).",
      },
      {
        key: "c",
        text: "Ở điều kiện thường, sulfur là chất rắn, màu vàng, không tan trong nước.",
        isTrue: true,
        explanation:
          "Đúng. Lưu huỳnh ở điều kiện thường là chất rắn tinh thể màu vàng chanh, không tan trong nước, tan nhiều trong dung môi không phân cực như CS₂, benzene.",
      },
      {
        key: "d",
        text: "Ở điều kiện thường, sulfur tồn tại dạng phân tử tám nguyên tử (S₈).",
        isTrue: true,
        explanation:
          "Đúng. Phân tử sulfur có cấu tạo mạch vòng khép kín gồm 8 nguyên tử liên kết cộng hóa trị với nhau (S₈).",
      },
    ],
    explanation:
      "Tổng kết về đơn chất Sulfur: Chất rắn màu vàng, không tan trong nước, phân tử S₈ dạng vòng, vừa có tính oxi hóa vừa có tính khử. Đáp án: a Sai, b Đúng, c Đúng, d Đúng.",
    keyFormula: "Tính chất S₈ (S - Đ - Đ - Đ)",
    difficulty: "Nhận biết",
  },
  {
    id: 44,
    code: "Câu 44",
    topic: "true_false",
    topicLabel: "Đúng/Sai & Thí nghiệm",
    type: "true_false",
    stem: "Cho các phương trình hóa học sau:",
    subItems: [
      "(1) SO₂ + 2H₂S ⟶ 3S + 2H₂O",
      "(2) SO₂ + Br₂ + 2H₂O ⟶ 2HBr + H₂SO₄",
    ],
    statements: [
      {
        key: "a",
        text: "Phản ứng (1), SO₂ thể hiện tính khử.",
        isTrue: false,
        explanation:
          "Sai. Ở phản ứng (1): S⁺⁴ (trong SO₂) nhận 4e giảm xuống S⁰ nên SO₂ thể hiện tính OXI HÓA (còn H₂S mới là chất khử).",
      },
      {
        key: "b",
        text: "Phản ứng (2), SO₂ thể hiện tính oxi hóa.",
        isTrue: false,
        explanation:
          "Sai. Ở phản ứng (2): S⁺⁴ (trong SO₂) nhường 2e tăng lên S⁺⁶ (trong H₂SO₄) nên SO₂ thể hiện tính KHỬ (còn Br₂ là chất oxi hóa).",
      },
      {
        key: "c",
        text: "Phản ứng (1) và (2) chứng minh SO₂ vừa thể hiện tính oxi hoá, vừa thể hiện tính khử.",
        isTrue: true,
        explanation:
          "Đúng. Phản ứng (1) chứng minh SO₂ có tính oxi hóa, phản ứng (2) chứng minh SO₂ có tính khử.",
      },
      {
        key: "d",
        text: "Có thể nhận biết SO₂ và CO₂ bằng thuốc thử là nước bromine.",
        isTrue: true,
        explanation:
          "Đúng. Khi dẫn qua dung dịch nước bromine (màu vàng nâu), khí SO₂ làm mất màu nước bromine theo phản ứng (2), còn khí CO₂ không phản ứng nên không làm mất màu.",
      },
    ],
    explanation:
      "Lưu ý bẫy đổi vai trò ở ý a và b: Phản ứng (1) SO₂ là chất oxi hóa (S⁺⁴ → S⁰); phản ứng (2) SO₂ là chất khử (S⁺⁴ → S⁺⁶). Đáp án: a Sai, b Sai, c Đúng, d Đúng.",
    keyFormula: "SO₂ + H₂S / Br₂ (S - S - Đ - Đ)",
    difficulty: "Thông hiểu",
  },
  {
    id: 45,
    code: "Câu 45",
    topic: "true_false",
    topicLabel: "Đúng/Sai & Thí nghiệm",
    type: "true_false",
    stem: "Tiến hành thí nghiệm copper (Cu) tác dụng với dung dịch sulfuric acid đặc, nóng theo các bước sau:",
    subItems: [
      "Bước 1: Cho vài lá Cu đã cắt nhỏ vào ống nghiệm, thêm tiếp khoảng 3 mL dung dịch H₂SO₄ 70%, dùng bông đã tẩm dung dịch NaOH loãng nút ống nghiệm.",
      "Bước 2: Hơ nóng đều ống nghiệm chứa dung dịch trên ngọn lửa đèn cồn, sau đó đun tập trung vào đáy ống nghiệm.",
    ],
    illustrationId: "cu_h2so4_lab",
    illustrationCaption: "Thí nghiệm đun nóng Cu với dung dịch H₂SO₄ đặc có nút bông tẩm NaOH",
    statements: [
      {
        key: "a",
        text: "Trong phản ứng trên, sulfuric acid đóng vai trò là chất oxi hóa.",
        isTrue: true,
        explanation:
          "Đúng. Phương trình: Cu + 2H₂SO₄(đặc, nóng) → CuSO₄ + SO₂↑ + 2H₂O. H₂SO₄ đặc đóng vai trò là chất oxi hóa (và cả môi trường tạo muối).",
      },
      {
        key: "b",
        text: "Có thể thay dung dịch H₂SO₄ 70% bằng dung dịch H₂SO₄ loãng thì hiện tượng ở bước 2 xảy ra tương tự.",
        isTrue: false,
        explanation:
          "Sai. Copper (Cu) đứng sau hydrogen trong dãy hoạt động hóa học nên KHÔNG tác dụng với dung dịch H₂SO₄ loãng dù đun nóng.",
      },
      {
        key: "c",
        text: "Bông tẩm dung dịch NaOH để ngăn SO₂ thoát ra ngoài không khí.",
        isTrue: true,
        explanation:
          "Đúng. Khí SO₂ sinh ra rất độc, bông tẩm NaOH hấp thụ SO₂ theo phản ứng: SO₂ + 2NaOH → Na₂SO₃ + H₂O (hoặc NaHSO₃).",
      },
      {
        key: "d",
        text: "Sản phẩm khử của phản ứng trên là SO₂.",
        isTrue: true,
        explanation:
          "Đúng. S⁺⁶ trong H₂SO₄ đặc bị Cu khử xuống S⁺⁴ trong phân tử khí SO₂.",
      },
    ],
    explanation:
      "Phản ứng: Cu + 2H₂SO₄(đặc, t°) → CuSO₄ (dung dịch màu xanh) + SO₂↑ (mùi hắc) + 2H₂O. Đáp án: a Đúng, b Sai, c Đúng, d Đúng.",
    keyFormula: "Cu + 2H₂SO₄(đ) → CuSO₄ + SO₂ + 2H₂O (Đ - S - Đ - Đ)",
    difficulty: "Thông hiểu",
  },
  {
    id: 46,
    code: "Câu 46",
    topic: "true_false",
    topicLabel: "Đúng/Sai & Thí nghiệm",
    type: "true_false",
    stem: "Tiến hành thí nghiệm khi cho dung dịch sulfuric acid đặc tác dụng với đường mía theo các bước như sau:",
    subItems: [
      "Bước 1: Lấy khoảng 10 gam đường mía cho vào cốc.",
      "Bước 2: Nhỏ đều trên bề mặt đường mía khoảng 2 mL dung dịch sulfuric acid đặc.",
    ],
    illustrationId: "sugar_h2so4_lab",
    illustrationCaption: "Thí nghiệm H₂SO₄ đặc làm hóa than đường mía (C₁₂H₂₂O₁₁) tạo cột than đen xốp",
    statements: [
      {
        key: "a",
        text: "Thí nghiệm trên chứng tỏ H₂SO₄ đặc có tính háo nước.",
        isTrue: true,
        explanation:
          "Đúng. H₂SO₄ đặc hút nước từ phân tử đường saccharose (C₁₂H₂₂O₁₁) biến đường trắng thành carbon (than) màu đen.",
      },
      {
        key: "b",
        text: "Sản phẩm khí thu được trong phản ứng trên là SO₂ và CO₂.",
        isTrue: true,
        explanation:
          "Đúng. Một phần C sinh ra bị H₂SO₄ đặc nóng oxi hóa tiếp tạo khí CO₂ và SO₂ làm cột than sủi bọt trào lên miệng cốc.",
      },
      {
        key: "c",
        text: "Trong thí nghiệm này xảy ra các quá trình sau: C₁₂H₂₂O₁₁ ⟶(+H₂SO₄ đ) C + H₂O ⟶(+H₂SO₄ đ) CO₂ + SO₂.",
        isTrue: true,
        explanation:
          "Đúng. Quá trình (1): C₁₂H₂₂O₁₁ ⟶(H₂SO₄ đặc) 12C + 11H₂O; Quá trình (2): C + 2H₂SO₄(đặc) ⟶ CO₂↑ + 2SO₂↑ + 2H₂O.",
      },
      {
        key: "d",
        text: "Trong thí nghiệm trên chỉ xảy ra quá trình hút nước của sulfuric acid, không xảy ra quá trình oxi hóa.",
        isTrue: false,
        explanation:
          "Sai. Thí nghiệm xảy ra đồng thời cả 2 quá trình: quá trình háo nước (than hóa đường) và quá trình oxi hóa - khử (C tác dụng với H₂SO₄ đặc tạo CO₂ và SO₂).",
      },
    ],
    explanation:
      "Thí nghiệm than hóa đường mía minh họa đồng thời tính háo nước và tính oxi hóa mạnh của H₂SO₄ đặc. Đáp án: a Đúng, b Đúng, c Đúng, d Sai.",
    keyFormula: "C₁₂H₂₂O₁₁ + H₂SO₄(đ) (Đ - Đ - Đ - S)",
    difficulty: "Vận dụng",
  },
  {
    id: 47,
    code: "Câu 47",
    topic: "true_false",
    topicLabel: "Đúng/Sai & Thí nghiệm",
    type: "true_false",
    stem: "Sulfuric acid là một trong những hoá chất quan trọng nhất được sử dụng trong công nghiệp; được sản xuất hàng trăm triệu tấn mỗi năm, chiếm nhiều nhất trong ngành công nghiệp hoá chất. Phương pháp sản xuất sulfuric acid phổ biến nhất là phương pháp tiếp xúc, theo đó acid có thể được điều chế qua các giai đoạn sau:",
    subItems: [
      "(1) FeS₂(s) + O₂(g) ⟶(t°) Fe₂O₃(s) + SO₂(g)",
      "(2) 2SO₂(g) + O₂(g) ⇌(450°C, V₂O₅) 2SO₃(g);   ΔᵣH°₂₉₈ = -196 kJ",
      "(3) H₂SO₄(aq) + SO₃(g) ⟶ H₂SO₄.nSO₃(l)",
      "(4) H₂SO₄.nSO₃(l) + H₂O(l) ⟶ H₂SO₄(aq)",
    ],
    illustrationId: "contact_process",
    illustrationCaption: "Sơ đồ 3 giai đoạn sản xuất Sulfuric acid trong công nghiệp bằng phương pháp tiếp xúc",
    statements: [
      {
        key: "a",
        text: "Trong quá trình sản xuất H₂SO₄, giai đoạn (1) có nguy cơ cao gây ô nhiễm môi trường.",
        isTrue: true,
        explanation:
          "Đúng. Giai đoạn đốt quặng pyrite (1) sinh ra khí độc SO₂ và bụi xỉ Fe₂O₃, nếu rò rỉ sẽ gây ô nhiễm không khí và mưa acid.",
      },
      {
        key: "b",
        text: "Người ta dùng sulfuric acid 98% H₂SO₄(aq) hấp thụ SO₃(g) trong phản ứng (3), quá trình này được thực hiện trong tháp tiếp xúc.",
        isTrue: true,
        explanation:
          "Đúng theo đáp án chuẩn của đề ôn tập (được tô vàng trong tài liệu gốc: dùng dung dịch H₂SO₄ 98% để hấp thụ SO₃ tạo oleum trong hệ thống thiết bị phương pháp tiếp xúc).",
      },
      {
        key: "c",
        text: "Để làm tăng hiệu suất của phản ứng (2), người ta hạ nhiệt độ của phản ứng xuống thấp.",
        isTrue: false,
        explanation:
          "Sai. Mặc dù phản ứng (2) tỏa nhiệt (ΔH = -196 kJ < 0), nhưng nếu hạ nhiệt độ xuống quá thấp thì tốc độ phản ứng sẽ cực kì chậm. Do đó trong công nghiệp phải duy trì nhiệt độ tối ưu khoảng 450°C – 500°C có xúc tác V₂O₅.",
      },
      {
        key: "d",
        text: "Ở giai đoạn 3 (phản ứng 3) có thể dùng nước hấp thụ SO₃ để sản xuất sulfuric acid đặc có nồng độ cao và thuận tiện hơn cho việc vận chuyển.",
        isTrue: false,
        explanation:
          "Sai. Không dùng nước trực tiếp hấp thụ SO₃ vì phản ứng tỏa nhiệt mạnh làm nước bay hơi tạo 'mù sulfuric acid' rất khó ngưng tụ và gây ăn mòn thiết bị. Hơn nữa, tạo oleum giúp vận chuyển an toàn và đạt nồng độ cao hơn.",
      },
    ],
    explanation:
      "Phương pháp tiếp xúc gồm 3 giai đoạn chính: Đốt S/FeS₂ tạo SO₂ → Oxi hóa SO₂ thành SO₃ (450°C, V₂O₅) → Dùng H₂SO₄ 98% hấp thụ SO₃ tạo oleum H₂SO₄.nSO₃ rồi pha loãng. Đáp án theo tài liệu gốc: a Đúng, b Đúng, c Sai, d Sai.",
    keyFormula: "Phương pháp tiếp xúc (Đ - Đ - S - S)",
    difficulty: "Vận dụng",
  },
];
