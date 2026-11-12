/** Simple 24px line icons for navigation. Stroke inherits currentColor. */
const paths = {
  home: 'M3.5 10.5 12 3.5l8.5 7M5.5 9v11h4.5v-6h4v6h4.5V9',
  about: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5.5M12 7.6v.1',
  canvas: 'M4 5.5h11a1.5 1.5 0 0 1 1.5 1.5v6.5A1.5 1.5 0 0 1 15 15H9l-4 3.5V15H4a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 4 5.5ZM16.5 9H20a1.5 1.5 0 0 1 1.5 1.5V17a1.5 1.5 0 0 1-1.5 1.5h-.5V21l-3-2.5h-4.5a1.5 1.5 0 0 1-1.5-1.5v-2',
  events: 'M4.5 6h15a1 1 0 0 1 1 1v12.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM3.5 10.5h17M8 3.5v4M16 3.5v4',
  library: 'M4 4.5h5.5A2.5 2.5 0 0 1 12 7v13a2 2 0 0 0-2-2H4ZM20 4.5h-5.5A2.5 2.5 0 0 0 12 7v13a2 2 0 0 1 2-2h6Z',
  edit: 'M14.5 5.5l4 4M4 20l1-4.5L16 4.5a1.5 1.5 0 0 1 2.1 0l1.4 1.4a1.5 1.5 0 0 1 0 2.1L8.5 19Z',
  person: 'M12 11.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20.5c.8-4 3.8-6 7.5-6s6.7 2 7.5 6',
  flag: 'M5 21V4M5 4.5h11.5l-2 4 2 4H5',
  cake: 'M4 20.5h16M5 20.5v-7a1.5 1.5 0 0 1 1.5-1.5h11a1.5 1.5 0 0 1 1.5 1.5v7M5 15.5c1.2 1 2.3 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0M12 12V8.5M12 6v-.1',
  laptop: 'M5 5.5h14a1 1 0 0 1 1 1V16H4V6.5a1 1 0 0 1 1-1ZM2.5 19h19',
  shield: 'M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6ZM8.8 12l2.2 2.2 4.2-4.4',
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}
