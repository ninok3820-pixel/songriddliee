import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { APP_TITLE } from "@/lib/app-config";
import { CoverBackground } from "@/components/cover-background";

export function meta() {
  return [
    { title: APP_TITLE },
    { name: "description", content: "Угадай песню по описанию" },
  ];
}

type Song = {
  description: string;
  options: string;
  answer: number;
  embedSrc: string;
};

const SONG_SETS: { date: string; songs: Song } = [
  {
    date: "2026-11-23",
    songs: [
      {
        description: "Рэп-трек про путь от домашних записей до больших концертов: в тексте есть отсылка к совету выкинуть микрофон, а по звуку — резкий переход к мощному дропу",
        options: ["VILLIAN, madk1d — ДИНАСТИЯ", "Aarne, Toxi\$ — KM", "NEXTIME, Даник — КИС Ю"],
        answer: 0,
        embedSrc: "https://music.yandex.ru/iframe/album/43177815/track/153919218",
      },
      {
        description: "Трэп-трек про безудержную вечеринку: герой перечисляет десятки видов алкоголя, устраивает дикие тусовки, а атмосфера — будто ночь никогда не закончится. В припеве постоянно звучит призыв “давай напьёмся” — и это становится главным рефреном трека.",
        options: ["урал гайсин — хочу быть с ней и всё", "Тимати — Moscow In Da Club", "Yanix — Алкоголь"],
        answer: 2,
        embedSrc: "https://music.yandex.ru/iframe/album/15510272/track/82789853",
      },
      {
        description: "Песня-обещание: в центре сюжета — готовность на любые жертвы ради любви, а настроение трека такое, будто это тост на большой свадьбе. Ритм бодрый, припев цепкий, атмосфера — праздничная и немного драматичная одновременно.",
        options: ["Лолита — Шпилька-каблучок", "Konfuz — Кайф ты поймала", "Мурат Тхагалегов — Калым"],
        answer: 2,
        embedSrc: "https://music.yandex.ru/iframe/album/25480090/track/32801075",
      },
      {
        description: "Танцевальный трек, где главная мысль звучит как манифест: различия не мешают, если внутри одна и та же энергия. Бит качает, вокал многослойный, а текст работает как приглашение к общему движению — будто это саундтрек к большому флешмобу.",
        options: ["Натали — О боже, какой мужчина", "Quest Pistols Show — Непохожие", "RaiM — Двигаться"],
        answer: 1,
        embedSrc: "https://music.yandex.ru/iframe/album/3414129/track/28535749",
      },
    ],
  },
  {
    date: "2026-11-24",
    songs: [
      {
        description: "Трек с плотным ритмом: припев построен на звукоподражании, которое стало интернет‑трендом, а куплеты обыгрывают типичные летние сюжеты — прогулки, танцы, неожиданные повороты.",
        options: ["MOT — День и Ночь", "Мэвл — Холодок", "БОРИК — ТЫЦН-ДЫЦН"],
        answer: 2,
        embedSrc: "https://music.yandex.ru/iframe/album/38385908/track/143326199",
      },
      {
        description: "В этом треке вся драма держится на одном слове из припева — его повторяют как заклинание. Герой обещает исполнить любое желание, если только его не отпустят. Атмосфера — влюблённость, ночь и желание остановить время.",
        options: ["Тима Белорусских — Витаминка", "Дима Билан — Держи", "Блестящие — Восточные сказки feat. Arash"],
        answer: 1,
        embedSrc: "https://music.yandex.ru/iframe/album/17378048",
      },
      {
        description: "Трек-приглашение на танцпол: вся драма здесь не в словах, а в ритме, который заставляет двигаться. Сюжет простой: не думай, не переживай, просто танцуй. Звучание — узнаваемый поп-данс с запоминающимся хуком, который моментально цепляет и остаётся в голове надолго.",
        options: ["Артур Пирожков — Зацепила", "Руки Вверх! — Танцуй", "Galibri & Mavik — Федерико Феллини"],
        answer: 1,
        embedSrc: "https://music.yandex.ru/iframe/album/7653890/track/53516751",
      },
      {
        description: "В этом треке любовь сравнивают с опасной игрой, а ключевое слово в припеве звучит как меткое определение героини: будто это её титул, который все повторяют хором. Настроение — игривое, дерзкое, с намёком на то, что сопротивляться бесполезно.",
        options: ["5sta Family — Снова вместе", "Ёлка — На большом воздушном шаре", "ЕГОР КРИД — Сердцеедка"],
        answer: 2,
        embedSrc: "https://music.yandex.ru/iframe/album/8045541/track/55233151",
      },
    ],
  },
];

const STORAGE_KEY = "songriddlie-progress";

type Progress = {
  date: string;
  index: number;
  picked: number | null;
  score: number;
  done: boolean;
};

function moscowDate(ms: number) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(ms);
}

function formatMoscowTime(ms: number) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(ms);
}

export default function HomeRoute() {
  const [now, setNow] = useState<number | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const cardRef = useRef<HTMLElement>(null);

  const today = now === null ? null : moscowDate(now);
  const songs = SONG_SETS.find((set) => set.date === today)?.songs ?? ;
  
  // Вычисляем состояние из progress
  const picked = progress?.picked ?? null;
  const song = progress && today !== null ? songs[progress.index] : undefined;
  const correct = song !== undefined && picked !== null && picked === song.answer;

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, );

  useEffect(() => {
    if (today === null) return;
    const fresh: Progress = { date: today, index: 0, picked: null, score: 0, done: false };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setProgress(fresh);
        return;
      }
      const parsed = JSON.parse(saved) as Progress;
      setProgress(parsed.date === today ? parsed : fresh);
    } catch {
      setProgress(fresh);
    }
  }, [today]);

  useEffect(() => {
    if (progress) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  useEffect(() => {
    if (picked === null) return;
    const id = setTimeout(
      () => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }),
      500,
    );
    return () => clearTimeout(id);
  }, [picked]);

  function pick(i: number) {
    if (!progress || !song || progress.picked !== null) return;
    setProgress({
      ...progress,
      picked: i,
      score: progress.score + (i === song.answer ? 1 : 0),
    });
  }

  function next() {
    if (!progress) return;
    if (progress.index + 1 >= songs.length) {
      setProgress({ ...progress, done: true, picked: null });
      return;
    }
    setProgress({ ...progress, index: progress.index + 1, picked: null });
  }

  // --- ИСПРАВЛЕННЫЙ JSX: чёткие условия, гарантированные закрывающие теги ---
  return (
    <div className="isolate flex min-h-screen flex-col gap-12 bg-[#161616] text-white">
      <CoverBackground />
      <header className="relative flex h-[76px] justify-center px-6 pt-6">
        <div className="grid w-full max-w-[1300px] grid-cols-[1fr_auto_1fr] items-center">
          <Link to="/" className="justify-self-start">
            <span className="bg-[linear-gradient(90deg,rgba(255,255,255,0.7)_30%,#7fffd4_70%)] bg-clip-text text-xl font-black uppercase tracking-[0.3em] text-transparent">
              SONGRIDDLIE
            </span>
          </Link>
        </div>
      </header>

      <section
        ref={cardRef}
        className={`mx-auto flex w-full max-w-[520px] flex-col items-center gap-4 rounded-[35px] border-2 border-[#91f3d9] bg-black/40 p-5 shadow-[0_0_12px_#91f3d9] backdrop-blur-xl transition-[margin] duration-500 ease-out \${picked === null ? "mt-28" : "-mt-10"}`}
      >
        {/* Сценарий 1: Нет песен на сегодня */}
        {today !== null && songs.length === 0 && (
          <p className="py-10 text-center text-lg">Новые песни скоро появятся</p>
        )}

        {/* Сценарий 2: Пройдено всё */}
        {progress?.done && (
          <div className="flex flex-col items-center gap-4 py-10">
            <p className="text-xl">Угадано песен: {progress.score} из {songs.length}</p>
            <p
              className="bg-clip-text text-center text-lg font-bold text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg,#ffffff,#7fffd4,#ffffff,#7fffd4,#ffffff)",
                backgroundSize: "200% 100%",
                animation: "title-shimmer 3s linear infinite",
              }}
            >
              каждые 4 трека обновляются через сутки
            </p>
            <p
              className="bg-clip-text font-mono text-3xl font-bold text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg,#ffffff,#7fffd4,#ffffff,#7fffd4,#ffffff)",
                backgroundSize: "200% 100%",
                animation: "title-shimmer 3s linear infinite",
              }}
            >
              {formatMoscowTime(now ?? 0)}
            </p>
          </div>
        )}

        {/* Сценарий 3: Игра в процессе */}
        {progress && song && !progress.done && (
          <>
            <p className="text-center text-base text-white/90">
              Песня {progress.index + 1} из {songs.length}
            </p>
            <blockquote className="w-full rounded-[15px] border-l-8 border-[#91f3d9] bg-[#dcc3c3] px-4 py-3 text-center text-sm italic text-black">
              «{song.description}»
            </blockquote>
            <div className="flex w-full flex-col gap-3">
              {song.options.map((o, i) => {
                const state =
                  picked === null
                    ? "bg-[#dcc3c3] hover:-translate-y-1 hover:bg-[#ecd5d5] active:translate-y-0 active:scale-[0.98]"
                    : i === song.answer
                      ? "bg-[#9dff7f]"
                      : i === picked
                        ? "bg-[#FB6464]"
                        : "bg-[#dcc3c3] opacity-70";
                return (
                  <button
                    key={o}
                    onClick={() => pick(i)}
                    className={`rounded-[15px] px-4 py-3 text-left text-black shadow-[0_-6px_14px_-2px_rgba(145,243,217,0.9),inset_0_2px_0_rgba(145,243,217,0.7)] transition duration-200 ease-out \${state}`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <>
                <p className={`mt-4 text-xl font-bold \${correct ? "text-[#98ff98]" : "text-[#FB6464]"}`}>
                  {correct ? "Правильно!" : "Неправильно!"}
                </p>
                <div className="w-full max-w-[470px] overflow-hidden rounded-[20px]">
                  <iframe
                    src={song.embedSrc}
                    title="Яндекс Музыка"
                    frameBorder="0"
                    allow="clipboard-write"
                    width={470}
                    height={270}
                    style={{ border: "none", width: "100%", height: 270, display: "block" }}
                  />
                </div>
                <button
                  onClick={next}
                  className="flex items-center gap-2 rounded-full bg-[#91f3d9] px-10 py-2 text-sm"
                >
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: "linear-gradient(90deg,#0a0a0a,#91f3d9,#0a0a0a,#91f3d9,#0a0a0a)",
                      backgroundSize: "200% 100%",
                      animation: "title-shimmer 3s linear infinite",
                    }}
                  >
                    Следующая песня
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <defs>
                      <linearGradient id="next-arrow-gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0a0a0a" />
                        <stop offset="50%" stopColor="#91f3d9" />
                        <stop offset="100%" stopColor="#0a0a0a" />
                      </linearGradient>
                    </defs>
                    <path d="M5 12l14 0" stroke="url(#next-arrow-gradient)" />
                    <path d="M13 18l6 -6" stroke="url(#next-arrow-gradient)" />
                    <path d="M13 6l6 6" stroke="url(#next-arrow-gradient)" />
                  </svg>
                </button>
              </>
            )}
            <p className="text-sm text-white/80">Угадано песен: {progress.score}</p>
          </>
        )}
      </section>

      <div className="relative z-10 mx-auto mt-auto flex w-[90%] flex-col rounded-[35px] bg-[#161616]/85 pt-4 pb-14 backdrop-blur-md [mask-image:radial-gradient(ellipse_80%_90%_at_center,black_60%,transparent_100%)]">
        <div className="flex px-6 pt-9">
          <Link
            to="/support"
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-[16px] border-2 border-[#91f3d9] bg-[#91f3d9] px-3 py-1 shadow-[0_0_12px_#91f3d9]"
          >
            <span className="text-sm font-bold text-black transition-colors hover:text-[#30ba8f]">Поддержать проект</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F95ec15179aac4b2dafacb4877231f878%2Fc031c1ec46a448738e83131a5845ace7?format=webp&width=800&height=1200"
              alt=""
              className="h-5 w-auto mix-blend-multiply"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
