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
  options: string[];
  answer: number;
  embedSrc: string;
};

const SONG_SETS: { date: string; songs: Song[] }[] = [
  {
    date: "2026-11-23",
    songs: [
      {
        description: "Рэп-трек про путь от домашних записей до больших концертов: в тексте есть отсылка к совету выкинуть микрофон, а по звуку — резкий переход к мощному дропу",
        options: ["VILLIAN, madk1d — ДИНАСТИЯ", "Aarne, Toxi$ — KM", "NEXTIME, Даник — КИС Ю"],
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
        embedSrc: "https://music.yandex.
