import { useState, useEffect, useCallback, useRef } from "react";

// ─── KELIME HAVUZU ────────────────────────────────────────────────────────────
const WORD_BANK = [
  {
    id: 1, word: "Abundant", turkish: "Bol, çok miktarda",
    sentences: [
      { en: "The region has abundant natural resources.", tr: "Bölge, bol miktarda doğal kaynağa sahiptir." },
      { en: "Food was abundant at the festival.", tr: "Festivalde yiyecek boldu." },
      { en: "The garden is abundant with flowers in spring.", tr: "Bahçe ilkbaharda çiçeklerle dolu." },
    ], emoji: "🌿", color: "#10b981",
  },
  {
    id: 2, word: "Achieve", turkish: "Başarmak, elde etmek",
    sentences: [
      { en: "She worked hard to achieve her goals.", tr: "Hedeflerine ulaşmak için çok çalıştı." },
      { en: "It takes effort to achieve success.", tr: "Başarıya ulaşmak çaba gerektirir." },
      { en: "They achieved great results together.", tr: "Birlikte harika sonuçlar elde ettiler." },
    ], emoji: "🏆", color: "#f59e0b",
  },
  {
    id: 3, word: "Adapt", turkish: "Uyum sağlamak",
    sentences: [
      { en: "Animals must adapt to survive.", tr: "Hayvanlar yaşamak için uyum sağlamalıdır." },
      { en: "She quickly adapted to the new environment.", tr: "Yeni ortama hızla uyum sağladı." },
      { en: "The company adapted its strategy.", tr: "Şirket stratejisini uyarladı." },
    ], emoji: "🦋", color: "#8b5cf6",
  },
  {
    id: 4, word: "Adequate", turkish: "Yeterli, uygun",
    sentences: [
      { en: "The salary was adequate for their needs.", tr: "Maaş, ihtiyaçları için yeterliydi." },
      { en: "Make sure you get adequate sleep.", tr: "Yeterli uyku aldığınızdan emin olun." },
      { en: "The preparation was not adequate for the exam.", tr: "Hazırlık sınav için yeterli değildi." },
    ], emoji: "✅", color: "#06b6d4",
  },
  {
    id: 5, word: "Ambiguous", turkish: "Belirsiz, muğlak",
    sentences: [
      { en: "The instructions were ambiguous.", tr: "Talimatlar belirsizdi." },
      { en: "His answer was deliberately ambiguous.", tr: "Cevabı kasıtlı olarak muğlaktı." },
      { en: "The law contains some ambiguous language.", tr: "Kanun bazı muğlak ifadeler içermektedir." },
    ], emoji: "❓", color: "#ec4899",
  },
  {
    id: 6, word: "Analyze", turkish: "Analiz etmek, incelemek",
    sentences: [
      { en: "Scientists analyze data carefully.", tr: "Bilim insanları verileri dikkatli inceler." },
      { en: "We need to analyze the problem first.", tr: "Önce problemi analiz etmemiz gerekiyor." },
      { en: "She analyzed the results of the experiment.", tr: "Deneyin sonuçlarını analiz etti." },
    ], emoji: "🔬", color: "#3b82f6",
  },
  {
    id: 7, word: "Anticipate", turkish: "Öngörmek, beklemek",
    sentences: [
      { en: "We anticipate a busy season ahead.", tr: "Önümüzdeki yoğun dönemi öngörüyoruz." },
      { en: "She anticipated his needs before he asked.", tr: "O sormadan önce ihtiyaçlarını öngördü." },
      { en: "Nobody anticipated such a result.", tr: "Kimse böyle bir sonuç beklemiyordu." },
    ], emoji: "🔮", color: "#a855f7",
  },
  {
    id: 8, word: "Approach", turkish: "Yaklaşım, yaklaşmak",
    sentences: [
      { en: "Her approach to teaching is creative.", tr: "Öğretme yaklaşımı yaratıcıdır." },
      { en: "We need a new approach to solve this.", tr: "Bunu çözmek için yeni bir yaklaşıma ihtiyacımız var." },
      { en: "The deadline is approaching fast.", tr: "Son teslim tarihi hızla yaklaşıyor." },
    ], emoji: "🧭", color: "#14b8a6",
  },
  {
    id: 9, word: "Assume", turkish: "Varsaymak, üstlenmek",
    sentences: [
      { en: "Don't assume you know the answer.", tr: "Cevabı bildiğini varsayma." },
      { en: "She assumed responsibility for the project.", tr: "Proje sorumluluğunu üstlendi." },
      { en: "We can assume the meeting is cancelled.", tr: "Toplantının iptal edildiğini varsayabiliriz." },
    ], emoji: "💭", color: "#f97316",
  },
  {
    id: 10, word: "Benefit", turkish: "Fayda, yarar sağlamak",
    sentences: [
      { en: "Exercise has many health benefits.", tr: "Egzersizin birçok sağlık faydası vardır." },
      { en: "Everyone can benefit from reading.", tr: "Herkes okumaktan fayda sağlayabilir." },
      { en: "The new law benefits small businesses.", tr: "Yeni yasa küçük işletmelere yarar sağlıyor." },
    ], emoji: "💡", color: "#eab308",
  },
  {
    id: 11, word: "Clarify", turkish: "Açıklamak, netleştirmek",
    sentences: [
      { en: "Could you clarify what you mean?", tr: "Ne demek istediğinizi açıklayabilir misiniz?" },
      { en: "She clarified her position on the issue.", tr: "Konuyla ilgili tutumunu netleştirdi." },
      { en: "The teacher clarified the instructions.", tr: "Öğretmen talimatları açıkladı." },
    ], emoji: "💬", color: "#06b6d4",
  },
  {
    id: 12, word: "Collapse", turkish: "Çökmek, çöküş",
    sentences: [
      { en: "The building collapsed in the earthquake.", tr: "Bina depremde çöktü." },
      { en: "The economic system is about to collapse.", tr: "Ekonomik sistem çökmek üzere." },
      { en: "She collapsed from exhaustion.", tr: "Yorgunluktan yere düştü." },
    ], emoji: "🏚️", color: "#ef4444",
  },
  {
    id: 13, word: "Commitment", turkish: "Bağlılık, taahhüt",
    sentences: [
      { en: "Success requires commitment and hard work.", tr: "Başarı bağlılık ve sıkı çalışma gerektirir." },
      { en: "She made a commitment to her studies.", tr: "Derslerine bağlılık taahhüdünde bulundu." },
      { en: "His commitment to the team is impressive.", tr: "Takıma olan bağlılığı etkileyici." },
    ], emoji: "🤝", color: "#10b981",
  },
  {
    id: 14, word: "Consequently", turkish: "Sonuç olarak, dolayısıyla",
    sentences: [
      { en: "He didn't study; consequently, he failed.", tr: "Çalışmadı; dolayısıyla başarısız oldu." },
      { en: "The storm was severe; consequently, roads closed.", tr: "Fırtına şiddetliydi; sonuç olarak yollar kapandı." },
      { en: "She was late and consequently missed the train.", tr: "Geç kaldı ve dolayısıyla treni kaçırdı." },
    ], emoji: "➡️", color: "#6366f1",
  },
  {
    id: 15, word: "Considerable", turkish: "Önemli miktarda, önemli",
    sentences: [
      { en: "There's been considerable progress.", tr: "Önemli ilerlemeler kaydedildi." },
      { en: "He invested a considerable amount of time.", tr: "Önemli miktarda zaman yatırdı." },
      { en: "The damage was considerable.", tr: "Hasar önemliydi." },
    ], emoji: "📊", color: "#8b5cf6",
  },
  {
    id: 16, word: "Consistent", turkish: "Tutarlı, sürekli",
    sentences: [
      { en: "Be consistent in your daily practice.", tr: "Günlük pratiğinizde tutarlı olun." },
      { en: "Her performance is consistently high.", tr: "Performansı sürekli olarak yüksektir." },
      { en: "The results were consistent with our expectations.", tr: "Sonuçlar beklentilerimizle tutarlıydı." },
    ], emoji: "🎯", color: "#f59e0b",
  },
  {
    id: 17, word: "Contribute", turkish: "Katkıda bulunmak",
    sentences: [
      { en: "Everyone can contribute to society.", tr: "Herkes topluma katkıda bulunabilir." },
      { en: "She contributed greatly to the project.", tr: "Projeye büyük katkıda bulundu." },
      { en: "Stress can contribute to health problems.", tr: "Stres sağlık sorunlarına katkıda bulunabilir." },
    ], emoji: "🌱", color: "#10b981",
  },
  {
    id: 18, word: "Crucial", turkish: "Çok önemli, kritik",
    sentences: [
      { en: "Sleep is crucial for good health.", tr: "Uyku iyi sağlık için çok önemlidir." },
      { en: "This is a crucial moment in history.", tr: "Bu, tarihin kritik bir anıdır." },
      { en: "Communication is crucial in relationships.", tr: "İlişkilerde iletişim çok önemlidir." },
    ], emoji: "⚡", color: "#ef4444",
  },
  {
    id: 19, word: "Curious", turkish: "Meraklı",
    sentences: [
      { en: "Children are naturally curious.", tr: "Çocuklar doğası gereği meraklıdır." },
      { en: "She was curious about the new neighbor.", tr: "Yeni komşu hakkında meraklıydı." },
      { en: "He had a curious expression on his face.", tr: "Yüzünde meraklı bir ifade vardı." },
    ], emoji: "🔍", color: "#a855f7",
  },
  {
    id: 20, word: "Decline", turkish: "Reddetmek, düşüş",
    sentences: [
      { en: "She declined the job offer politely.", tr: "İş teklifini kibarca reddetti." },
      { en: "Sales have declined this year.", tr: "Satışlar bu yıl düştü." },
      { en: "The population is in decline.", tr: "Nüfus azalmaktadır." },
    ], emoji: "📉", color: "#ef4444",
  },
  {
    id: 21, word: "Demonstrate", turkish: "Göstermek, kanıtlamak",
    sentences: [
      { en: "She demonstrated her skills clearly.", tr: "Becerilerini açıkça gösterdi." },
      { en: "The experiment demonstrates a key principle.", tr: "Deney temel bir prensibi kanıtlıyor." },
      { en: "He demonstrated how to use the machine.", tr: "Makineyi nasıl kullanacağını gösterdi." },
    ], emoji: "📋", color: "#3b82f6",
  },
  {
    id: 22, word: "Determine", turkish: "Belirlemek, kararlı olmak",
    sentences: [
      { en: "Scientists determined the age of the fossil.", tr: "Bilim insanları fosilin yaşını belirledi." },
      { en: "She was determined to succeed.", tr: "Başarmaya kararlıydı." },
      { en: "The cause has yet to be determined.", tr: "Sebep henüz belirlenmedi." },
    ], emoji: "💪", color: "#f97316",
  },
  {
    id: 23, word: "Distinguish", turkish: "Ayırt etmek",
    sentences: [
      { en: "Can you distinguish between the two sounds?", tr: "İki ses arasındaki farkı ayırt edebilir misiniz?" },
      { en: "She distinguished herself from others.", tr: "Kendisini diğerlerinden ayırdı." },
      { en: "It's hard to distinguish between fact and fiction.", tr: "Gerçeği kurgudan ayırt etmek zordur." },
    ], emoji: "🔄", color: "#14b8a6",
  },
  {
    id: 24, word: "Efficient", turkish: "Verimli, etkin",
    sentences: [
      { en: "Electric cars are more efficient.", tr: "Elektrikli arabalar daha verimlidir." },
      { en: "She found a more efficient way to work.", tr: "Çalışmanın daha verimli bir yolunu buldu." },
      { en: "The system is highly efficient.", tr: "Sistem son derece etkindir." },
    ], emoji: "⚙️", color: "#06b6d4",
  },
  {
    id: 25, word: "Eliminate", turkish: "Ortadan kaldırmak",
    sentences: [
      { en: "We need to eliminate poverty.", tr: "Yoksulluğu ortadan kaldırmamız gerekiyor." },
      { en: "The treatment eliminated the infection.", tr: "Tedavi enfeksiyonu ortadan kaldırdı." },
      { en: "He eliminated all possible errors.", tr: "Tüm olası hataları ortadan kaldırdı." },
    ], emoji: "❌", color: "#ec4899",
  },
  {
    id: 26, word: "Emphasize", turkish: "Vurgulamak",
    sentences: [
      { en: "She emphasized the importance of safety.", tr: "Güvenliğin önemini vurguladı." },
      { en: "The teacher emphasized key vocabulary.", tr: "Öğretmen temel kelimeleri vurguladı." },
      { en: "His speech emphasized team spirit.", tr: "Konuşması takım ruhunu vurguladı." },
    ], emoji: "📣", color: "#eab308",
  },
  {
    id: 27, word: "Encounter", turkish: "Karşılaşmak, rastlamak",
    sentences: [
      { en: "We may encounter difficulties on the way.", tr: "Yolda zorluklarla karşılaşabiliriz." },
      { en: "She encountered an old friend at the market.", tr: "Pazarda eski bir arkadaşına rastladı." },
      { en: "Have you ever encountered a wild animal?", tr: "Hiç vahşi bir hayvanla karşılaştınız mı?" },
    ], emoji: "👀", color: "#10b981",
  },
  {
    id: 28, word: "Enhance", turkish: "Geliştirmek, artırmak",
    sentences: [
      { en: "Music can enhance your mood.", tr: "Müzik ruh halinizi geliştirebilir." },
      { en: "The update enhanced the app's performance.", tr: "Güncelleme uygulamanın performansını artırdı." },
      { en: "Exercise enhances both physical and mental health.", tr: "Egzersiz hem fiziksel hem de zihinsel sağlığı geliştirir." },
    ], emoji: "✨", color: "#a855f7",
  },
  {
    id: 29, word: "Essential", turkish: "Gerekli, vazgeçilmez",
    sentences: [
      { en: "Water is essential for all living things.", tr: "Su tüm canlılar için vazgeçilmezdir." },
      { en: "Practice is essential to learn a language.", tr: "Pratik, bir dil öğrenmek için gereklidir." },
      { en: "Trust is essential in any relationship.", tr: "Güven, her ilişkide gereklidir." },
    ], emoji: "💧", color: "#3b82f6",
  },
  {
    id: 30, word: "Establish", turkish: "Kurmak, tesis etmek",
    sentences: [
      { en: "They established a new school in the village.", tr: "Köyde yeni bir okul kurdular." },
      { en: "She established herself as an expert.", tr: "Kendini uzman olarak kanıtladı." },
      { en: "The company was established in 1990.", tr: "Şirket 1990'da kuruldu." },
    ], emoji: "🏛️", color: "#6366f1",
  },
  {
    id: 31, word: "Evaluate", turkish: "Değerlendirmek",
    sentences: [
      { en: "Teachers evaluate students regularly.", tr: "Öğretmenler öğrencileri düzenli olarak değerlendirir." },
      { en: "We need to evaluate the risks carefully.", tr: "Riskleri dikkatli değerlendirmemiz gerekiyor." },
      { en: "How do you evaluate your own performance?", tr: "Kendi performansınızı nasıl değerlendirirsiniz?" },
    ], emoji: "📝", color: "#f59e0b",
  },
  {
    id: 32, word: "Eventually", turkish: "Sonunda, er ya da geç",
    sentences: [
      { en: "She eventually found a solution.", tr: "Sonunda bir çözüm buldu." },
      { en: "Everyone eventually makes mistakes.", tr: "Herkes er ya da geç hata yapar." },
      { en: "He eventually accepted the truth.", tr: "Sonunda gerçeği kabul etti." },
    ], emoji: "⏳", color: "#8b5cf6",
  },
  {
    id: 33, word: "Evident", turkish: "Açık, belirgin",
    sentences: [
      { en: "It was evident that she was tired.", tr: "Yorgun olduğu açıktı." },
      { en: "His passion for music is evident.", tr: "Müziğe olan tutkusu belirgindir." },
      { en: "The results make the trend evident.", tr: "Sonuçlar eğilimi açıkça ortaya koyuyor." },
    ], emoji: "👁️", color: "#14b8a6",
  },
  {
    id: 34, word: "Expand", turkish: "Genişlemek, büyümek",
    sentences: [
      { en: "The company plans to expand overseas.", tr: "Şirket yurt dışına açılmayı planlıyor." },
      { en: "Reading expands your vocabulary.", tr: "Okumak kelime haznenizi geliştirir." },
      { en: "The city has expanded rapidly.", tr: "Şehir hızla büyüdü." },
    ], emoji: "📈", color: "#10b981",
  },
  {
    id: 35, word: "Extreme", turkish: "Aşırı, uç nokta",
    sentences: [
      { en: "They faced extreme weather conditions.", tr: "Aşırı hava koşullarıyla karşılaştılar." },
      { en: "He went to extreme lengths to succeed.", tr: "Başarmak için aşırı çaba harcadı." },
      { en: "Both extremes are dangerous.", tr: "Her iki uç da tehlikelidir." },
    ], emoji: "🌡️", color: "#ef4444",
  },
  {
    id: 36, word: "Familiar", turkish: "Tanıdık, aşina",
    sentences: [
      { en: "The voice sounded familiar.", tr: "Ses tanıdık geldi." },
      { en: "Are you familiar with this software?", tr: "Bu yazılıma aşina mısınız?" },
      { en: "She felt familiar with the topic.", tr: "Konuya aşinaydı." },
    ], emoji: "😊", color: "#f59e0b",
  },
  {
    id: 37, word: "Flexible", turkish: "Esnek",
    sentences: [
      { en: "We need a flexible schedule.", tr: "Esnek bir programa ihtiyacımız var." },
      { en: "Yoga makes your body more flexible.", tr: "Yoga vücudunuzu daha esnek yapar." },
      { en: "She has a flexible approach to problems.", tr: "Sorunlara esnek bir yaklaşımı var." },
    ], emoji: "🤸", color: "#a855f7",
  },
  {
    id: 38, word: "Focus", turkish: "Odaklanmak, odak noktası",
    sentences: [
      { en: "Focus on the most important task first.", tr: "Önce en önemli göreve odaklanın." },
      { en: "The focus of the meeting was budget.", tr: "Toplantının odak noktası bütçeydi." },
      { en: "She struggled to focus while tired.", tr: "Yorgunken odaklanmakta güçlük çekti." },
    ], emoji: "🎯", color: "#3b82f6",
  },
  {
    id: 39, word: "Generate", turkish: "Üretmek, oluşturmak",
    sentences: [
      { en: "Solar panels generate electricity.", tr: "Güneş panelleri elektrik üretir." },
      { en: "The business generates high profits.", tr: "İşletme yüksek kâr üretiyor." },
      { en: "Brainstorming generates creative ideas.", tr: "Beyin fırtınası yaratıcı fikirler oluşturur." },
    ], emoji: "⚡", color: "#eab308",
  },
  {
    id: 40, word: "Identify", turkish: "Tanımlamak, belirlemek",
    sentences: [
      { en: "Can you identify the problem?", tr: "Sorunu belirleyebilir misiniz?" },
      { en: "Police identified the suspect quickly.", tr: "Polis şüpheliyi hızla belirledi." },
      { en: "She identified a pattern in the data.", tr: "Verideki bir kalıbı belirledi." },
    ], emoji: "🔎", color: "#06b6d4",
  },
];

// ─── STORAGE HELPER ──────────────────────────────────────────────────────────
const STORAGE_KEY = "ielts_wordcard_v3";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    study: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    repeat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 1.33 13.53M4.93 19.07a10 10 0 0 1-1.33-13.53M19.07 19.07a10 10 0 0 1-13.53 1.33M4.93 4.93a10 10 0 0 1 13.53-1.33"/></svg>,
    flame: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    moon: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2
