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
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    target: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    rotate: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  };
  return icons[name] || null;
};

// ─── ANA UYGULAMA ─────────────────────────────────────────────────────────────
export default function App() {
  const today = new Date().toISOString().split("T")[0];

  const initState = () => {
    const saved = loadState();
    if (saved) return saved;
    return {
      learned: [],
      review: [],
      struggling: [],
      sentenceIndex: {},
      streak: 0,
      lastStudyDate: null,
      dailyGoal: 10,
      todayCount: 0,
      todayDate: today,
      totalSessions: 0,
      darkMode: true,
    };
  };

  const [state, setState] = useState(initState);
  const [tab, setTab] = useState("study");
  const [flipped, setFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [cardAnim, setCardAnim] = useState("enter");
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState("");

  const dm = state.darkMode;

  // Renkler
  const theme = {
    bg: dm ? "#0f0f13" : "#f8f7f4",
    surface: dm ? "#1a1a24" : "#ffffff",
    surfaceAlt: dm ? "#22222e" : "#f0eff8",
    border: dm ? "#2a2a38" : "#e5e4f0",
    text: dm ? "#f0efff" : "#1a1a2e",
    textSub: dm ? "#8888aa" : "#666688",
    accent: "#7c5cfc",
    green: "#10b981",
    amber: "#f59e0b",
    red: "#ef4444",
    navBg: dm ? "#13131a" : "#ffffff",
  };

  // State persist
  useEffect(() => { saveState(state); }, [state]);

  // Streak ve günlük reset
  useEffect(() => {
    if (state.todayDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      setState(s => ({
        ...s,
        todayDate: today,
        todayCount: 0,
        streak: s.lastStudyDate === yStr ? s.streak : 0,
      }));
    }
  }, []);

  // Aktif kart havuzu
  const getPool = useCallback(() => {
    const learnedSet = new Set(state.learned);
    const available = WORD_BANK.filter(w => !learnedSet.has(w.id));
    if (available.length === 0) return WORD_BANK;
    // struggling'ler 2x ağırlık
    const pool = [];
    for (const w of available) {
      pool.push(w);
      if (state.struggling.includes(w.id)) pool.push(w);
    }
    return pool;
  }, [state.learned, state.struggling]);

  const nextCard = useCallback(() => {
    const pool = getPool();
    const rand = pool[Math.floor(Math.random() * pool.length)];
    setCurrentCard(rand);
    setFlipped(false);
    setCardAnim("enter");
  }, [getPool]);

  useEffect(() => {
    if (!currentCard) nextCard();
  }, []);

  const animateOut = (fn) => {
    setCardAnim("exit");
    setTimeout(() => { fn(); nextCard(); }, 280);
  };

  const markLearned = () => animateOut(() => {
    setState(s => {
      const learned = [...new Set([...s.learned, currentCard.id])];
      const review = s.review.filter(id => id !== currentCard.id);
      const struggling = s.struggling.filter(id => id !== currentCard.id);
      const todayCount = s.todayCount + 1;
      const streak = s.lastStudyDate === today ? s.streak : (s.lastStudyDate === getPrevDay() ? s.streak + 1 : 1);
      return { ...s, learned, review, struggling, todayCount, streak, lastStudyDate: today };
    });
  });

  const markReview = () => animateOut(() => {
    setState(s => ({
      ...s,
      review: [...new Set([...s.review, currentCard.id])],
      todayCount: s.todayCount + 1,
      lastStudyDate: today,
    }));
  });

  const markStruggling = () => animateOut(() => {
    setState(s => {
      const idx = ((s.sentenceIndex[currentCard.id] || 0) + 1) % currentCard.sentences.length;
      return {
        ...s,
        struggling: [...new Set([...s.struggling, currentCard.id])],
        sentenceIndex: { ...s.sentenceIndex, [currentCard.id]: idx },
        todayCount: s.todayCount + 1,
        lastStudyDate: today,
      };
    });
  });

  const getPrevDay = () => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const resetAll = () => {
    if (window.confirm("Tüm ilerleme silinecek. Emin misiniz?")) {
      setState({ learned: [], review: [], struggling: [], sentenceIndex: {}, streak: 0, lastStudyDate: null, dailyGoal: 10, todayCount: 0, todayDate: today, totalSessions: 0, darkMode: state.darkMode });
      setCurrentCard(null);
      setTimeout(nextCard, 50);
    }
  };

  const progressPct = Math.round((state.learned.length / WORD_BANK.length) * 100);
  const goalPct = Math.min(100, Math.round((state.todayCount / state.dailyGoal) * 100));

  // Cümle seçimi
  const getSentence = (word) => {
    const idx = state.sentenceIndex[word.id] || 0;
    return word.sentences[idx % word.sentences.length];
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

  const styles = {
    app: {
      minHeight: "100dvh",
      background: theme.bg,
      color: theme.text,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    },
    header: {
      padding: "16px 20px 12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: `1px solid ${theme.border}`,
      background: theme.navBg,
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    logo: {
      fontSize: 18,
      fontWeight: 800,
      background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.5px",
    },
    streakBadge: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      background: dm ? "#1f1500" : "#fff7e6",
      border: `1px solid ${dm ? "#3d2800" : "#fbbf24"}`,
      borderRadius: 20,
      padding: "4px 10px",
      fontSize: 13,
      fontWeight: 700,
      color: "#f59e0b",
    },
    nav: {
      display: "flex",
      background: theme.navBg,
      borderTop: `1px solid ${theme.border}`,
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 480,
      zIndex: 10,
    },
    navItem: (active) => ({
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "8px 4px 10px",
      cursor: "pointer",
      gap: 3,
      color: active ? theme.accent : theme.textSub,
      fontSize: 10,
      fontWeight: active ? 700 : 500,
      transition: "color 0.2s",
      border: "none",
      background: "none",
    }),
    content: {
      flex: 1,
      overflowY: "auto",
      padding: "16px 16px 80px",
    },
    card: {
      perspective: 1000,
      marginBottom: 16,
    },
    cardInner: (flip) => ({
      position: "relative",
      minHeight: 320,
      transformStyle: "preserve-3d",
      transform: flip ? "rotateY(180deg)" : "rotateY(0deg)",
      transition: "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }),
    cardFace: {
      position: "absolute",
      inset: 0,
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      borderRadius: 24,
      overflow: "hidden",
    },
    cardFront: (word) => ({
      background: `linear-gradient(145deg, ${word.color}22, ${word.color}44)`,
      border: `1px solid ${word.color}55`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      gap: 16,
    }),
    cardBack: {
      transform: "rotateY(180deg)",
      background: dm ? "#1e1e2e" : "#ffffff",
      border: `1px solid ${theme.border}`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: 28,
      gap: 14,
    },
    emojiBox: (color) => ({
      fontSize: 56,
      width: 100,
      height: 100,
      background: `${color}22`,
      borderRadius: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `2px solid ${color}33`,
    }),
    wordText: {
      fontSize: 32,
      fontWeight: 800,
      letterSpacing: "-1px",
      textAlign: "center",
    },
    tapHint: {
      fontSize: 12,
      color: theme.textSub,
      display: "flex",
      alignItems: "center",
      gap: 4,
      marginTop: 8,
    },
    turkishMeaning: {
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-0.5px",
      color: theme.accent,
    },
    label: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: 1,
      color: theme.textSub,
    },
    exampleEn: {
      fontSize: 15,
      lineHeight: 1.6,
      color: theme.text,
      fontStyle: "italic",
    },
    exampleTr: {
      fontSize: 13,
      lineHeight: 1.6,
      color: theme.textSub,
    },
    divider: {
      height: 1,
      background: theme.border,
      margin: "4px 0",
    },
    btnRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 10,
    },
    btn: (color, bg) => ({
      background: bg || `${color}18`,
      border: `1.5px solid ${color}44`,
      borderRadius: 16,
      padding: "12px 8px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 5,
      color: color,
      fontSize: 11,
      fontWeight: 700,
      transition: "all 0.15s",
      outline: "none",
    }),
    progressSection: {
      background: theme.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 14,
      border: `1px solid ${theme.border}`,
    },
    progressBar: (pct, color) => ({
      height: 8,
      borderRadius: 999,
      background: theme.surfaceAlt,
      overflow: "hidden",
      marginTop: 8,
      position: "relative",
    }),
    progressFill: (pct, color) => ({
      height: "100%",
      width: `${pct}%`,
      background: `linear-gradient(90deg, ${color}, ${color}cc)`,
      borderRadius: 999,
      transition: "width 0.6s ease",
    }),
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 14,
    },
    statCard: (color) => ({
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: 20,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }),
    statNum: (color) => ({
      fontSize: 28,
      fontWeight: 800,
      color: color,
      letterSpacing: "-1px",
    }),
    statLabel: {
      fontSize: 12,
      color: theme.textSub,
      fontWeight: 500,
    },
    wordList: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    wordItem: (color) => ({
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: 16,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 12,
    }),
    wordItemEmoji: {
      fontSize: 24,
      width: 40,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: theme.textSub,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 12,
      marginTop: 4,
    },
    emptyState: {
      textAlign: "center",
      padding: "48px 24px",
      color: theme.textSub,
    },
    settingRow: {
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: 16,
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
      cursor: "pointer",
    },
    toggle: (on) => ({
      width: 44,
      height: 24,
      borderRadius: 12,
      background: on ? theme.accent : theme.surfaceAlt,
      position: "relative",
      transition: "background 0.2s",
      cursor: "pointer",
      border: "none",
      outline: "none",
    }),
    toggleKnob: (on) => ({
      position: "absolute",
      top: 2,
      left: on ? 22 : 2,
      width: 20,
      height: 20,
      borderRadius: 10,
      background: "#fff",
      transition: "left 0.2s",
      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
    }),
    modal: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 50,
      padding: 24,
    },
    modalBox: {
      background: theme.surface,
      borderRadius: 24,
      padding: 24,
      width: "100%",
      maxWidth: 340,
      border: `1px solid ${theme.border}`,
    },
  };

  // Card animation class
  const cardWrapStyle = {
    transition: "opacity 0.28s, transform 0.28s",
    opacity: cardAnim === "exit" ? 0 : 1,
    transform: cardAnim === "exit" ? "scale(0.94) translateY(8px)" : "scale(1) translateY(0)",
  };

  // ─── TABS ─────────────────────────────────────────────────────────────────

  const renderStudy = () => {
    if (!currentCard) return null;
    const sentence = getSentence(currentCard);
    return (
      <div>
        {/* Progress bars */}
        <div style={styles.progressSection}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.textSub }}>Genel İlerleme</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.accent }}>{progressPct}%</span>
          </div>
          <div style={styles.progressBar()}>
            <div style={styles.progressFill(progressPct, theme.accent)} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.textSub }}>Günlük Hedef ({state.todayCount}/{state.dailyGoal})</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.green }}>{goalPct}%</span>
          </div>
          <div style={styles.progressBar()}>
            <div style={styles.progressFill(goalPct, theme.green)} />
          </div>
        </div>

        {/* Card */}
        <div style={{ ...styles.card, ...cardWrapStyle }}>
          <div style={styles.cardInner(flipped)} onClick={() => setFlipped(f => !f)}>
            {/* Front */}
            <div style={{ ...styles.cardFace, ...styles.cardFront(currentCard) }}>
              <div style={styles.emojiBox(currentCard.color)}>{currentCard.emoji}</div>
              <div style={{ ...styles.wordText, color: currentCard.color }}>{currentCard.word}</div>
              <div style={styles.tapHint}>
                <Icon name="rotate" size={13} color={theme.textSub} />
                <span style={{ color: theme.textSub }}>Çevirmek için dokun</span>
              </div>
            </div>
            {/* Back */}
            <div style={{ ...styles.cardFace, ...styles.cardBack }}>
              <div style={styles.label}>Türkçe Anlamı</div>
              <div style={styles.turkishMeaning}>{currentCard.turkish}</div>
              <div style={styles.divider} />
              <div style={styles.label}>Örnek Cümle</div>
              <div style={styles.exampleEn}>"{sentence.en}"</div>
              <div style={styles.exampleTr}>— {sentence.tr}</div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={styles.btn(theme.green)} onClick={markLearned}>
            <Icon name="check" size={18} color={theme.green} />
            Öğrendim
          </button>
          <button style={styles.btn(theme.amber)} onClick={markReview}>
            <Icon name="repeat" size={18} color={theme.amber} />
            Tekrar Çalış
          </button>
          <button style={styles.btn(theme.red)} onClick={markStruggling}>
            <Icon name="x" size={18} color={theme.red} />
            Öğrenemedim
          </button>
        </div>
      </div>
    );
  };

  const renderWordList = (ids, emptyMsg, badgeColor) => {
    const words = WORD_BANK.filter(w => ids.includes(w.id));
    if (words.length === 0) return (
      <div style={styles.emptyState}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Henüz kelime yok</div>
        <div style={{ fontSize: 13 }}>{emptyMsg}</div>
      </div>
    );
    return (
      <div style={styles.wordList}>
        {words.map(w => (
          <div key={w.id} style={styles.wordItem(w.color)}>
            <div style={styles.wordItemEmoji}>{w.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: w.color }}>{w.word}</div>
              <div style={{ fontSize: 12, color: theme.textSub, marginTop: 2 }}>{w.turkish}</div>
            </div>
            <div style={{
              width: 8, height: 8, borderRadius: 4,
              background: badgeColor, flexShrink: 0
            }} />
          </div>
        ))}
      </div>
    );
  };

  const renderStats = () => (
    <div>
      <div style={styles.statsGrid}>
        {[
          { label: "Öğrenilen", val: state.learned.length, color: theme.green, emoji: "✅" },
          { label: "Tekrar", val: state.review.length, color: theme.amber, emoji: "🔄" },
          { label: "Zorlandım", val: state.struggling.length, color: theme.red, emoji: "💪" },
          { label: "Streak", val: `${state.streak}🔥`, color: "#f97316", emoji: "🏅" },
        ].map((s, i) => (
          <div key={i} style={styles.statCard(s.color)}>
            <div style={{ fontSize: 22 }}>{s.emoji}</div>
            <div style={styles.statNum(s.color)}>{s.val}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ ...styles.progressSection, marginTop: 4 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Toplam İlerleme</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: theme.textSub }}>{state.learned.length} / {WORD_BANK.length} kelime</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: theme.accent }}>{progressPct}%</span>
        </div>
        <div style={styles.progressBar()}>
          <div style={styles.progressFill(progressPct, theme.accent)} />
        </div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: theme.textSub }}>Bugün çalışılan</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{state.todayCount} kart</span>
        </div>
        <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: theme.textSub }}>Günlük hedef</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{state.dailyGoal} kart</span>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <div
        style={styles.settingRow}
        onClick={() => setState(s => ({ ...s, darkMode: !s.darkMode }))}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name={dm ? "moon" : "sun"} size={18} color={theme.accent} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>Karanlık Mod</span>
        </div>
        <button style={styles.toggle(dm)}>
          <div style={styles.toggleKnob(dm)} />
        </button>
      </div>
      <div style={styles.settingRow} onClick={() => { setNewGoal(String(state.dailyGoal)); setShowGoalModal(true); }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="target" size={18} color={theme.accent} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>Günlük Hedef</span>
        </div>
        <span style={{ fontWeight: 700, color: theme.accent }}>{state.dailyGoal} kart</span>
      </div>
      <div style={styles.settingRow} onClick={resetAll}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="trash" size={18} color={theme.red} />
          <span style={{ fontWeight: 600, fontSize: 14, color: theme.red }}>İlerlemeyi Sıfırla</span>
        </div>
      </div>
      <div style={{ ...styles.progressSection, marginTop: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: theme.textSub }}>UYGULAMA BİLGİSİ</div>
        <div style={{ fontSize: 13, color: theme.textSub, lineHeight: 1.8 }}>
          Kelime Sayısı: <strong style={{ color: theme.text }}>{WORD_BANK.length}</strong><br />
          Seviye: <strong style={{ color: theme.text }}>IELTS B1</strong><br />
          Versiyon: <strong style={{ color: theme.text }}>3.0</strong>
        </div>
      </div>
    </div>
  );

  const TABS = [
    { id: "study", label: "Çalış", icon: "study" },
    { id: "learned", label: "Öğrendim", icon: "check" },
    { id: "review", label: "Tekrar", icon: "repeat" },
    { id: "struggling", label: "Zorlandım", icon: "x" },
    { id: "stats", label: "İstatistik", icon: "chart" },
    { id: "settings", label: "Ayarlar", icon: "settings" },
  ];

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>WordIELTS</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {state.todayCount >= state.dailyGoal && (
            <div style={{ fontSize: 11, color: theme.green, fontWeight: 700, background: `${theme.green}18`, border: `1px solid ${theme.green}33`, borderRadius: 20, padding: "3px 8px" }}>
              🎉 Hedef tamam!
            </div>
          )}
          <div style={styles.streakBadge}>
            <Icon name="flame" size={13} color="#f59e0b" />
            {state.streak} gün
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {tab === "study" && renderStudy()}
        {tab === "learned" && (
          <div>
            <div style={styles.sectionTitle}>✅ Öğrenilen Kelimeler ({state.learned.length})</div>
            {renderWordList(state.learned, "Henüz öğrendiğiniz kelime yok. Çalışmaya başlayın!", theme.green)}
          </div>
        )}
        {tab === "review" && (
          <div>
            <div style={styles.sectionTitle}>🔄 Tekrar Çalışılacaklar ({state.review.length})</div>
            {renderWordList(state.review, "Tekrar listesi boş. Çalışmaya devam edin!", theme.amber)}
          </div>
        )}
        {tab === "struggling" && (
          <div>
            <div style={styles.sectionTitle}>💪 Zorlandığım Kelimeler ({state.struggling.length})</div>
            {renderWordList(state.struggling, "Harika! Zorlandığınız kelime yok.", theme.red)}
          </div>
        )}
        {tab === "stats" && renderStats()}
        {tab === "settings" && renderSettings()}
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {TABS.map(t => (
          <button key={t.id} style={styles.navItem(tab === t.id)} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={20} color={tab === t.id ? theme.accent : theme.textSub} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Goal Modal */}
      {showGoalModal && (
        <div style={styles.modal} onClick={() => setShowGoalModal(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Günlük Hedef</div>
            <input
              type="number"
              value={newGoal}
              onChange={e => setNewGoal(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 16, fontWeight: 700,
                background: theme.surfaceAlt, border: `1.5px solid ${theme.border}`,
                color: theme.text, outline: "none", boxSizing: "border-box",
              }}
              min={1} max={100}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button style={{ ...styles.btn(theme.textSub), flex: 1, flexDirection: "row", justifyContent: "center", padding: 12 }} onClick={() => setShowGoalModal(false)}>İptal</button>
              <button style={{ ...styles.btn(theme.accent), flex: 1, flexDirection: "row", justifyContent: "center", padding: 12, background: theme.accent, color: "#fff", border: "none" }} onClick={() => {
                const g = parseInt(newGoal);
                if (g > 0 && g <= 100) setState(s => ({ ...s, dailyGoal: g }));
                setShowGoalModal(false);
              }}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
