import { Link } from "react-router";
import { APP_TITLE } from "@/lib/app-config";

export function meta() {
  return [
    { title: `Поддержка — ${APP_TITLE}` },
    { name: "description", content: "Созвездия поддержавших проект" },
  ];
}

type Constellation = {
  name: string;
  donatedRub: number;
  donatedOn: string;
  stars: [number, number][];
  links: [number, number][];
};

const CONSTELLATIONS: Constellation[] = [
  {
    name: "Roddich",
    donatedRub: 0,
    donatedOn: "22.11.2026",
    stars: [
      [18, 46],
      [34, 14],
      [62, 16],
      [78, 42],
      [66, 74],
      [40, 82],
      [24, 62],
      [48, 50],
      [60, 62],
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 0],
      [6, 7],
      [7, 8],
    ],
  },
];

function glowFilter(donatedRub: number) {
  if (donatedRub >= 1000) {
    return "drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 12px #91f3d9) drop-shadow(0 0 24px #91f3d9)";
  }
  if (donatedRub >= 100) {
    return "drop-shadow(0 0 3px #ffffff) drop-shadow(0 0 6px #91f3d9)";
  }
  return "none";
}

function ConstellationView({ constellation }: { constellation: Constellation }) {
  return (
    <div className="flex flex-col items-center gap-0">
      <div className="group relative">
        <svg
          viewBox="0 0 96 96"
          width={140}
          height={140}
          style={{ filter: glowFilter(constellation.donatedRub), opacity: 0.5 }}
        >
          {constellation.links.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={constellation.stars[a]![0]}
              y1={constellation.stars[a]![1]}
              x2={constellation.stars[b]![0]}
              y2={constellation.stars[b]![1]}
              stroke="#ffffff"
              strokeWidth={1}
              strokeLinecap="round"
            />
          ))}
          {constellation.stars.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2} fill="#ffffff" />
          ))}
        </svg>
        <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-md border border-white/60 bg-black/55 px-2 py-1 text-center text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Надеюсь, у тебя получится продвинуть этот сайт, систр, удачи.
        </span>
      </div>
      <span className="group relative text-sm text-white/50">
        {constellation.name}
        <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {constellation.donatedOn}
        </span>
      </span>
    </div>
  );
}

export default function SupportRoute() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-[#161616] p-6 text-white">
      <div className="grid w-full max-w-[1300px] grid-cols-[1fr_auto_1fr] items-center">
        <p className="justify-self-start bg-[linear-gradient(90deg,rgba(255,255,255,0.7)_30%,#7fffd4_70%)] bg-clip-text text-xl font-black uppercase tracking-[0.3em] text-transparent">SONGRIDDLIE</p>
        <p className="-translate-x-2 text-xl font-bold uppercase tracking-[0.3em] text-white/70"><Link to="/" className="hover:text-white">ГЛАВНОЕ</Link> ● РЕЖИМ</p>
      </div>
      <section className="relative flex min-h-[750px] w-full max-w-[1300px] flex-wrap items-start justify-start gap-10 rounded-[40px] border-2 border-[#7fffd4] bg-[#1b1b1b] shadow-[0_0_12px_#7fffd4] p-10">
        {CONSTELLATIONS.map((c) => (
          <ConstellationView key={c.name} constellation={c} />
        ))}
        <div className="absolute left-1/2 top-1/2 flex h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full bg-cover bg-center p-10 shadow-[0_0_16px_#ffffff] text-center text-sm leading-snug" style={{ backgroundImage: `url("https://cdn.builder.io/api/v1/image/assets%2F95ec15179aac4b2dafacb4877231f878%2F2a327b63a2954f3897aef5e1dfd4f6c3?format=webp&width=800&height=1200")`, backgroundSize: "125%" }}>
          <p className="support-heading whitespace-nowrap text-xl font-black">
            {"ПОДДЕРЖАТЬ ПРОЕКТ".split("").map((letter, index) => (
              <span key={index} className="support-letter" style={{ animationDelay: `${index * 0.18}s` }}>
                {letter}
              </span>
            ))}
          </p>
          <p className="rounded-md bg-black/55 px-2 py-1 font-normal text-white opacity-90 shadow-[0_0_12px_6px_rgba(0,0,0,0.55)] [text-shadow:0_0_8px_rgba(0,0,0,0.9)]">Songriddlie создал один человек и занимается им один.</p>
          <p className="rounded-md bg-black/55 px-2 py-1 font-normal text-white opacity-90 shadow-[0_0_12px_6px_rgba(0,0,0,0.55)] [text-shadow:0_0_8px_rgba(0,0,0,0.9)]">Ваша поддержка помогает сайту работать и развиваться.</p>
          <a
            href="https://www.donationalerts.com/r/cocedka01_"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-[14px] border-2 border-[#91f3d9] bg-[#91f3d9] px-3 py-1 text-sm font-bold text-black transition-all duration-300 ease-out hover:scale-105 hover:text-[#3eb489]"
          >
            Поддержать проект
          </a>
        </div>
      </section>
    </div>
  );
}
