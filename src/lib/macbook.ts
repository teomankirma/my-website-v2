// Apple 14-inch MacBook Pro (M5 family), millimetres. See docs/redesign/PLAN.md.
export const MACBOOK = {
  width: 312.6,
  depth: 221.2,
  height: 15.5,
  screenWidth: 302.4,
  screenHeight: 196.4,
  pixels: [3024, 1964],
} as const;
export const MODEL_SCALE = 6.8 / MACBOOK.width;
// Simple Icons Apple path, CC0. Also used in the decorative macOS menu bar.
export const APPLE_PATH =
  'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701';
export interface KeySpec {
  label: string;
  units: number;
  row: number;
  start: number;
  half?: 'top' | 'bottom';
}
const standard = (labels: string[]) => labels.map((label) => [label, 1] as const);
const rows: (readonly [string, number])[][] = [
  [
    ['esc', 1.5],
    ...standard([
      '☀\nF1',
      '☀\nF2',
      '▣\nF3',
      '⌕\nF4',
      '♩\nF5',
      '☾\nF6',
      '◂◂\nF7',
      '▷\nF8',
      '▸▸\nF9',
      '♬\nF10',
      '−\nF11',
      '+\nF12',
    ]),
    ['◎', 1.5],
  ],
  [
    ...standard([
      '~\n`',
      '!\n1',
      '@\n2',
      '#\n3',
      '$\n4',
      '%\n5',
      '^\n6',
      '&\n7',
      '*\n8',
      '(\n9',
      ')\n0',
      '_\n−',
      '+\n=',
    ]),
    ['delete', 2],
  ],
  [
    ['tab', 1.5],
    ...standard(['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{\n[', '}\n]']),
    ['|\n\\', 1.5],
  ],
  [
    ['caps lock', 1.75],
    ...standard(['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':\n;', '"\n\'']),
    ['return', 2.25],
  ],
  [
    ['shift', 2.25],
    ...standard(['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<\n,', '>\n.', '?\n/']),
    ['shift', 2.75],
  ],
  [
    ['fn', 1],
    ['⌃\ncontrol', 1],
    ['⌥\noption', 1],
    ['⌘\ncommand', 1.25],
    ['', 5.5],
    ['⌘\ncommand', 1.25],
    ['⌥\noption', 1],
    ['◂', 1],
    ['▾', 1],
    ['▸', 1],
  ],
];
export const KEYBOARD: KeySpec[] = rows.flatMap((row, rowIndex) => {
  let start = 0;
  return row.map(([label, units]) => {
    const key: KeySpec = {label, units, row: rowIndex, start};
    if (rowIndex === 5 && start >= 12) key.half = 'bottom';
    start += units;
    return key;
  });
});
KEYBOARD.push({label: '▴', units: 1, row: 5, start: 13, half: 'top'});
