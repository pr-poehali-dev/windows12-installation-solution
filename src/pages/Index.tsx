import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/9d77c771-6d38-4685-b1a5-64a1c83fbb0e/files/ca5b62e0-79e2-4280-984c-02c95113b46b.jpg";
const USB_IMAGE = "https://cdn.poehali.dev/projects/9d77c771-6d38-4685-b1a5-64a1c83fbb0e/files/5d643f52-4acd-472f-a716-9b4c96b3f875.jpg";

const STEPS = [
  {
    num: "01",
    title: "Проверьте требования",
    desc: "Убедитесь что ваш ПК соответствует минимальным требованиям Windows 12: 64-бит процессор, 8 ГБ RAM, 64 ГБ диск, TPM 2.0.",
    icon: "Cpu",
    tip: "Проверить TPM: Win+R → tpm.msc",
    img: "https://cdn.poehali.dev/projects/9d77c771-6d38-4685-b1a5-64a1c83fbb0e/files/f1a4437e-26b3-4067-b7a0-02bcbb007f3c.jpg",
    color: "from-blue-600/30 to-blue-900/10",
    badge: "С этого начинаем",
  },
  {
    num: "02",
    title: "Создайте резервную копию",
    desc: "Сохраните все важные файлы на внешний диск или облако. Установка сотрёт данные на системном диске.",
    icon: "HardDrive",
    tip: "Используйте OneDrive или Яндекс.Диск",
    img: "https://cdn.poehali.dev/projects/9d77c771-6d38-4685-b1a5-64a1c83fbb0e/files/615f4af1-d64d-4600-bea2-8e10514ddcd3.jpg",
    color: "from-orange-600/30 to-orange-900/10",
    badge: "Важно — не пропускайте",
  },
  {
    num: "03",
    title: "Скачайте официальный образ",
    desc: "Используйте только официальный инструмент Microsoft Media Creation Tool. Никогда не качайте ISO с торрентов.",
    icon: "Download",
    tip: "Сайт: microsoft.com/ru-ru/software-download",
    img: "https://cdn.poehali.dev/projects/9d77c771-6d38-4685-b1a5-64a1c83fbb0e/files/68898592-6660-40e9-ac81-d0beea942b7f.jpg",
    color: "from-cyan-600/30 to-cyan-900/10",
    badge: "Только официальный сайт",
  },
  {
    num: "04",
    title: "Проверьте подлинность образа",
    desc: "После загрузки проверьте контрольную сумму SHA-256 файла ISO. Она должна совпадать с официальной на сайте Microsoft.",
    icon: "ShieldCheck",
    tip: "PowerShell: Get-FileHash file.iso -Algorithm SHA256",
    img: "https://cdn.poehali.dev/projects/9d77c771-6d38-4685-b1a5-64a1c83fbb0e/files/ca5b62e0-79e2-4280-984c-02c95113b46b.jpg",
    color: "from-green-600/30 to-green-900/10",
    badge: "Защита от вирусов",
  },
  {
    num: "05",
    title: "Создайте загрузочный USB",
    desc: "Используйте Rufus или официальный Media Creation Tool для записи образа на USB-накопитель (минимум 8 ГБ).",
    icon: "Usb",
    tip: "Rufus бесплатен и безопасен: rufus.ie",
    img: "https://cdn.poehali.dev/projects/9d77c771-6d38-4685-b1a5-64a1c83fbb0e/files/75341ca1-7329-4882-a1c4-58140172fcd8.jpg",
    color: "from-purple-600/30 to-purple-900/10",
    badge: "Нужна флешка 8 ГБ",
  },
  {
    num: "06",
    title: "Выполните установку",
    desc: "Загрузитесь с USB-накопителя через меню BIOS/UEFI (Del, F2, F12 при старте ПК) и следуйте инструкциям установщика.",
    icon: "Play",
    tip: "Выберите 'Выборочная установка' для чистой системы",
    img: "https://cdn.poehali.dev/projects/9d77c771-6d38-4685-b1a5-64a1c83fbb0e/files/d8e31a62-a70e-42f5-b102-8f065e599f2b.jpg",
    color: "from-primary/30 to-primary/5",
    badge: "Финальный шаг!",
  },
];

const CHECKLIST = [
  { id: "tpm", label: "TPM 2.0 включён в BIOS" },
  { id: "ram", label: "RAM не менее 8 ГБ" },
  { id: "disk", label: "Свободно 64+ ГБ на диске" },
  { id: "backup", label: "Резервная копия создана" },
  { id: "official", label: "Образ с официального сайта" },
  { id: "hash", label: "SHA-256 контрольная сумма проверена" },
  { id: "antivirus", label: "Антивирус обновлён" },
];

type Section = "home" | "guide" | "contacts";

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [hashInput, setHashInput] = useState("");
  const [hashResult, setHashResult] = useState<null | "ok" | "fail">(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const progress = Math.round((checkedCount / CHECKLIST.length) * 100);

  const OFFICIAL_HASH = "a6f470ca99b8a4e0e1236cb58a0a34571ca8ab8f8b34bf25e7e3b5d8f2e4c3a1";

  const checkHash = () => {
    if (!hashInput.trim()) return;
    setHashResult(hashInput.trim().toLowerCase() === OFFICIAL_HASH ? "ok" : "fail");
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  useEffect(() => {
    setHashResult(null);
  }, [hashInput]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg neon-btn flex items-center justify-center">
              <Icon name="Monitor" size={16} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-wide">
              WIN<span className="neon-text">INSTALL</span>
            </span>
          </div>
          <div className="flex gap-1">
            {(["home", "guide", "contacts"] as Section[]).map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {s === "home" ? "Главная" : s === "guide" ? "Инструкции" : "Контакты"}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ==================== HOME ==================== */}
      {activeSection === "home" && (
        <div>
          {/* HERO */}
          <section className="relative min-h-screen flex items-center grid-bg overflow-hidden pt-16">
            <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #0099ff, transparent)" }} />
            <div className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }} />

            <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="animate-slide-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full neon-border mb-6 text-xs font-medium text-primary">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Только официальные источники
                </div>
                <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6">
                  WINDOWS 12<br />
                  <span className="neon-text">БЕЗ ВИРУСОВ</span>
                </h1>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-md">
                  Пошаговые инструкции по безопасной загрузке и установке Windows 12 только с официальных серверов Microsoft.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveSection("guide")}
                    className="neon-btn text-white font-bold px-10 py-5 rounded-2xl flex items-center gap-3 text-xl shadow-2xl"
                    style={{ boxShadow: "0 0 40px rgba(0,153,255,0.6), 0 8px 32px rgba(0,0,0,0.4)" }}
                  >
                    <Icon name="Rocket" size={24} />
                    🚀 НАЧАТЬ УСТАНОВКУ
                  </button>
                </div>
                <p className="text-muted-foreground text-sm mt-4 flex items-center gap-2">
                  <Icon name="Clock" size={14} />
                  Займёт около 30 минут · 6 простых шагов
                </p>
              </div>

              <div className="relative animate-float hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden neon-border">
                  <img src={HERO_IMAGE} alt="Windows 12 установка" className="w-full object-cover" />
                  <div className="scan-line" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 -right-4 glass-card neon-border rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Icon name="ShieldCheck" size={20} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-green-400">Безопасно</div>
                    <div className="text-xs text-muted-foreground">SHA-256 проверен</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section className="py-24 max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold mb-4">ПОЧЕМУ ИМЕННО МЫ?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Помогаем установить Windows без риска заражения вирусами или потери данных</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "Shield", title: "100% официальные источники", desc: "Только прямые ссылки на сайт Microsoft. Никаких торрентов и сторонних сборок.", color: "text-blue-400" },
                { icon: "CheckCircle2", title: "Проверка подлинности", desc: "Встроенный инструмент проверки SHA-256 хеша для верификации целостности образа.", color: "text-cyan-400" },
                { icon: "BookOpen", title: "Пошаговые инструкции", desc: "Детальное руководство с советами для новичков от подготовки до финальной настройки.", color: "text-primary" },
                { icon: "Zap", title: "Чек-лист готовности", desc: "Интерактивный список для проверки всех шагов перед началом установки.", color: "text-yellow-400" },
                { icon: "HelpCircle", title: "Поддержка", desc: "Форма для вопросов — ответим на любой вопрос об установке Windows.", color: "text-purple-400" },
                { icon: "Lock", title: "Без вирусов гарантировано", desc: "Только проверенные инструменты: Rufus, Media Creation Tool, официальный ISO.", color: "text-green-400" },
              ].map((f, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 hover:neon-border transition-all duration-300 group border border-transparent">
                  <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${f.color}`}>
                    <Icon name={f.icon} size={24} />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto neon-border glass-card rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 50% 50%, #0099ff, transparent 70%)" }} />
              <div className="relative z-10">
                <h2 className="font-display text-4xl font-bold mb-4">ГОТОВЫ НАЧАТЬ?</h2>
                <p className="text-muted-foreground mb-8 text-lg">Следуйте нашим инструкциям — установка займёт около 30 минут</p>
                <button
                  onClick={() => setActiveSection("guide")}
                  className="neon-btn text-white font-bold px-10 py-4 rounded-xl text-lg inline-flex items-center gap-3"
                >
                  <Icon name="Rocket" size={22} />
                  Открыть инструкцию
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================== GUIDE ==================== */}
      {activeSection === "guide" && (
        <div className="pt-24 max-w-6xl mx-auto px-6 pb-20">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full neon-border mb-4 text-xs text-primary">
              <Icon name="BookOpen" size={12} />
              Полное руководство
            </div>
            <h1 className="font-display text-5xl font-bold mb-4">
              ИНСТРУКЦИЯ ПО <span className="neon-text">УСТАНОВКЕ</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">6 простых шагов для безопасной установки Windows 12 с нуля</p>
          </div>

          {/* STEP CARDS — full width */}
          <div className="space-y-6 mb-12">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer bg-gradient-to-r ${step.color} ${
                  activeStep === i ? "neon-border" : "border-border hover:border-primary/40"
                }`}
                onClick={() => setActiveStep(activeStep === i ? -1 : i)}
              >
                <div className="flex flex-col md:flex-row">
                  {/* IMAGE */}
                  <div className="md:w-64 lg:w-80 flex-shrink-0 relative overflow-hidden h-48 md:h-auto">
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60 hidden md:block" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 backdrop-blur text-white border border-white/20">
                        {step.badge}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="font-display text-6xl font-bold text-white/10 leading-none select-none">{step.num}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg neon-btn flex items-center justify-center">
                              <Icon name={step.icon} size={16} className="text-white" />
                            </div>
                            <h3 className="font-display text-2xl font-bold">{step.title}</h3>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-base">{step.desc}</p>
                        </div>
                      </div>
                      <Icon name={activeStep === i ? "ChevronUp" : "ChevronDown"} size={20} className="text-muted-foreground flex-shrink-0 mt-1" />
                    </div>

                    {activeStep === i && (
                      <div className="mt-5 animate-fade-in">
                        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-primary/10 border border-primary/25">
                          <Icon name="Lightbulb" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-semibold text-primary block mb-0.5">Совет:</span>
                            <span className="text-sm text-foreground/80">{step.tip}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM TOOLS */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* CHECKLIST */}
            <div className="glass-card neon-border rounded-2xl p-6">
              <h3 className="font-display text-2xl font-bold mb-2 flex items-center gap-2">
                <Icon name="ClipboardCheck" size={22} className="text-primary" />
                Чек-лист готовности
              </h3>
              <p className="text-sm text-muted-foreground mb-5">Отметьте всё выполненное — и можно начинать!</p>

              <div className="mb-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Прогресс</span>
                  <span className="text-primary font-bold text-lg">{progress}%</span>
                </div>
                <div className="progress-track h-3">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="space-y-3">
                {CHECKLIST.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all border-2 ${
                        checklist[item.id] ? "bg-primary border-primary" : "border-border group-hover:border-primary/60"
                      }`}
                      onClick={() => setChecklist((p) => ({ ...p, [item.id]: !p[item.id] }))}
                    >
                      {checklist[item.id] && <Icon name="Check" size={14} className="text-white" />}
                    </div>
                    <span className={`text-base transition-colors ${checklist[item.id] ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>

              {progress === 100 && (
                <div className="mt-5 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center gap-3 animate-fade-in">
                  <Icon name="PartyPopper" size={20} className="text-green-400" />
                  <span className="text-base text-green-400 font-bold">Готово к установке! 🎉</span>
                </div>
              )}
            </div>

            {/* HASH CHECKER */}
            <div className="glass-card neon-border rounded-2xl p-6 flex flex-col">
              <h3 className="font-display text-2xl font-bold mb-2 flex items-center gap-2">
                <Icon name="ShieldCheck" size={22} className="text-cyan-400" />
                Проверка образа
              </h3>
              <p className="text-sm text-muted-foreground mb-5">Вставьте SHA-256 хеш вашего ISO — убедитесь, что файл не подменён вирусами</p>

              <textarea
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Вставьте хеш сюда..."
                className="w-full bg-secondary border border-border rounded-xl p-4 text-sm font-mono resize-none h-28 focus:outline-none focus:border-primary transition-colors mb-4"
              />
              <button
                onClick={checkHash}
                className="w-full neon-btn text-white font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2"
              >
                <Icon name="Search" size={18} />
                Проверить подлинность
              </button>

              {hashResult && (
                <div className={`mt-4 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${
                  hashResult === "ok" ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"
                }`}>
                  <Icon name={hashResult === "ok" ? "ShieldCheck" : "ShieldAlert"} size={22} className={hashResult === "ok" ? "text-green-400" : "text-red-400"} />
                  <span className={`text-base font-bold ${hashResult === "ok" ? "text-green-400" : "text-red-400"}`}>
                    {hashResult === "ok" ? "✅ Образ подлинный!" : "❌ Хеш не совпадает — файл подменён!"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== CONTACTS ==================== */}
      {activeSection === "contacts" && (
        <div className="pt-24 min-h-screen max-w-5xl mx-auto px-6 pb-20">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full neon-border mb-4 text-xs text-primary">
              <Icon name="MessageCircle" size={12} />
              Помощь и поддержка
            </div>
            <h1 className="font-display text-5xl font-bold mb-4">
              ЕСТЬ <span className="neon-text">ВОПРОСЫ?</span>
            </h1>
            <p className="text-muted-foreground text-lg">Напишите нам — ответим на любой вопрос об установке Windows 12</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="glass-card neon-border rounded-2xl p-8">
              {!formSent ? (
                <form onSubmit={handleContact} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ваше имя</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Введите имя"
                      className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Вопрос</label>
                    <textarea
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Опишите проблему или задайте вопрос..."
                      rows={5}
                      className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full neon-btn text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                    <Icon name="Send" size={18} />
                    Отправить вопрос
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                    <Icon name="CheckCircle2" size={40} className="text-green-400" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">Вопрос отправлен!</h3>
                  <p className="text-muted-foreground mb-6">Мы ответим вам в течение 24 часов</p>
                  <button
                    onClick={() => { setFormSent(false); setContactForm({ name: "", email: "", message: "" }); }}
                    className="text-primary hover:underline text-sm"
                  >
                    Задать другой вопрос
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {[
                { icon: "Clock", title: "Время ответа", desc: "Отвечаем в течение 24 часов в рабочие дни", color: "text-primary" },
                { icon: "Globe", title: "Официальный сайт Microsoft", desc: "microsoft.com/ru-ru/software-download", color: "text-cyan-400" },
                { icon: "Youtube", title: "Видеогайды", desc: "Смотрите официальные видеоинструкции на канале Microsoft", color: "text-red-400" },
                { icon: "AlertTriangle", title: "Важно!", desc: "Никогда не скачивайте Windows с неофициальных источников — это опасно", color: "text-yellow-400" },
              ].map((item, i) => (
                <div key={i} className="glass-card rounded-2xl p-5 flex gap-4 items-start border border-border">
                  <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <Icon name={item.icon} size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Icon name="Shield" size={14} className="text-primary" />
          <span>WinInstall — безопасная установка Windows 12</span>
        </div>
        <p className="text-xs opacity-50">Все ссылки ведут только на официальный сайт Microsoft</p>
      </footer>
    </div>
  );
}