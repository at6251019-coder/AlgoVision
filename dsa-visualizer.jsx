import { useState, useEffect, useRef, useCallback } from "react";

/* ─── palette ─── */
const P = {
  bg: "#0f0f1a", card: "#1a1a2e", card2: "#16213e",
  accent: "#7f5af0", accent2: "#2cb67d", accent3: "#ff6b6b",
  accent4: "#ffd166", accent5: "#4ecdc4", accent6: "#f77f00",
  text: "#e0def4", muted: "#8888a0", border: "#2a2a4a",
  codeBg: "#0d0d1a", white: "#fff",
};

/* ─── CATEGORIES & ALGOS ─── */
const CATEGORIES = {
  sorting: {
    icon: "⇅", label: "Sorting",
    algos: {
      bubble: { name: "Bubble Sort", tc: "O(n²)", sc: "O(1)", stable: "Yes" },
      selection: { name: "Selection Sort", tc: "O(n²)", sc: "O(1)", stable: "No" },
      insertion: { name: "Insertion Sort", tc: "O(n²)", sc: "O(1)", stable: "Yes" },
      quick: { name: "Quick Sort", tc: "O(n log n)", sc: "O(log n)", stable: "No" },
      merge: { name: "Merge Sort", tc: "O(n log n)", sc: "O(n)", stable: "Yes" },
    },
  },
  searching: {
    icon: "⌕", label: "Searching",
    algos: {
      linear: { name: "Linear Search", tc: "O(n)", sc: "O(1)" },
      binary: { name: "Binary Search", tc: "O(log n)", sc: "O(1)" },
    },
  },
  stacks: {
    icon: "☰", label: "Stack & Queue",
    algos: {
      stack: { name: "Stack (LIFO)", tc: "O(1) push/pop" },
      queue: { name: "Queue (FIFO)", tc: "O(1) enqueue/dequeue" },
    },
  },
  linkedlist: {
    icon: "⟶", label: "Linked List",
    algos: {
      singly: { name: "Singly Linked List" },
    },
  },
  trees: {
    icon: "🌲", label: "Trees",
    algos: {
      bst: { name: "Binary Search Tree" },
    },
  },
};

/* ─── CODE SNIPPETS ─── */
const CODES = {
  bubble: {
    lang: "C",
    lines: [
      "for (i = 0; i < n-1; i++) {",
      "    for (j = 0; j < n-i-1; j++) {",
      "        if (a[j] > a[j+1]) {",
      "            temp = a[j];",
      "            a[j] = a[j+1];",
      "            a[j+1] = temp;",
      "        }",
      "    }",
      "}",
    ],
    explain: [
      "i = pass number. After each pass, the largest unsorted element bubbles to the end.",
      "j = scanner. It walks left to right comparing neighbors.",
      "If left neighbor > right neighbor...",
      "...save left value in temp.",
      "...move right value to left position.",
      "...put temp (old left) into right position. Swap done!",
      "",
      "j is done for this pass. Largest value is now at the end.",
      "Repeat until fully sorted.",
    ],
  },
  selection: {
    lang: "C",
    lines: [
      "for (i = 0; i < n; i++) {",
      "    for (j = i+1; j < n; j++) {",
      "        if (a[j] < a[i]) {",
      "            temp = a[i];",
      "            a[i]  = a[j];",
      "            a[j]  = temp;",
      "        }",
      "    }",
      "}",
    ],
    explain: [
      "i = position to fill. It goes left to right, one by one.",
      "j = scout. Starts right after i, scans till the end.",
      "Is a[j] smaller than a[i]? If yes...",
      "...save a[i] in temp.",
      "...put a[j] into a[i] (smaller goes to i's position).",
      "...put temp into a[j] (old a[i] goes to j's position).",
      "Swap done!",
      "j moves to the next element and checks again.",
      "After all j's are done, position i has the smallest remaining value.",
    ],
  },
  insertion: {
    lang: "C",
    lines: [
      "for (i = 1; i < n; i++) {",
      "    key = a[i];",
      "    j = i - 1;",
      "    while (j >= 0 && a[j] > key) {",
      "        a[j+1] = a[j];",
      "        j--;",
      "    }",
      "    a[j+1] = key;",
      "}",
    ],
    explain: [
      "i picks up the next unsorted card.",
      "key = the value we need to insert in the right spot.",
      "j starts just before i, in the sorted region.",
      "While elements are bigger than key, shift them right.",
      "Shift a[j] one position to the right to make room.",
      "Move j back to check the next element.",
      "",
      "Drop the key into its correct position.",
      "Repeat for all elements.",
    ],
  },
  quick: {
    lang: "C",
    lines: [
      "void quickSort(int a[], int low, int high) {",
      "    if (low < high) {",
      "        pi = partition(a, low, high);",
      "        quickSort(a, low, pi - 1);",
      "        quickSort(a, pi + 1, high);",
      "    }",
      "}",
      "int partition(int a[], int low, int high) {",
      "    pivot = a[high];",
      "    i = low - 1;",
      "    for (j = low; j < high; j++) {",
      "        if (a[j] < pivot) {",
      "            i++;",
      "            temp = a[i];",
      "            a[i] = a[j];",
      "            a[j] = temp;",
      "        }",
      "    }",
      "    temp = a[i+1];",
      "    a[i+1] = a[high];",
      "    a[high] = temp;",
      "    return i + 1;",
      "}",
    ],
    explain: [
      "quickSort function takes array, low index, high index.",
      "Base condition: need at least 2 elements.",
      "Partition around a pivot. pi = pivot's final index.",
      "Recursively sort left of pivot.",
      "Recursively sort right of pivot.",
      "", "",
      "Partition function:",
      "Pick last element as pivot.",
      "i = boundary of 'smaller than pivot' zone. Starts before low.",
      "j scans from low to high-1.",
      "If current element is smaller than pivot...",
      "...grow the smaller zone (i++).",
      "...save a[i] in temp.",
      "...put a[j] into a[i].",
      "...put temp into a[j]. Swap done!",
      "",
      "",
      "Now place pivot in its correct position.",
      "Move a[i+1] to where pivot was.",
      "Put pivot at i+1.",
      "Return pivot's final index.",
      "",
    ],
  },
  merge: {
    lang: "C",
    lines: [
      "void mergeSort(int a[], int l, int r) {",
      "    if (l < r) {",
      "        mid = (l + r) / 2;",
      "        mergeSort(a, l, mid);",
      "        mergeSort(a, mid+1, r);",
      "        merge(a, l, mid, r);",
      "    }",
      "}",
      "void merge(int a[], int l, int mid, int r) {",
      "    // copy left half and right half",
      "    // into temp arrays L[] and R[]",
      "    i = 0; j = 0; k = l;",
      "    while (i < n1 && j < n2) {",
      "        if (L[i] <= R[j])",
      "            a[k++] = L[i++];",
      "        else",
      "            a[k++] = R[j++];",
      "    }",
      "    // copy remaining elements",
      "}",
    ],
    explain: [
      "mergeSort takes array, left index, right index.",
      "Need at least 2 elements to split.",
      "Find the midpoint.",
      "Recursively sort the left half.",
      "Recursively sort the right half.",
      "Merge the two sorted halves back together.",
      "",
      "",
      "Merge function: combines two sorted halves.",
      "Copy both halves into temporary arrays.",
      "",
      "i = left pointer, j = right pointer, k = position in original array.",
      "While both halves have elements left...",
      "...if left element is smaller or equal...",
      "...put it in array and move left pointer.",
      "...otherwise...",
      "...put right element in array and move right pointer.",
      "",
      "Copy any remaining elements from either half.",
      "",
    ],
  },
  linear: {
    lang: "C",
    lines: [
      "int linearSearch(int a[], int n, int target) {",
      "    for (i = 0; i < n; i++) {",
      "        if (a[i] == target) {",
      "            return i;  // Found!",
      "        }",
      "    }",
      "    return -1;  // Not found",
      "}",
    ],
    explain: [
      "Function takes array, size, and target value.",
      "Check each element one by one from left to right.",
      "Does this element match what we're looking for?",
      "Yes! Return the index where we found it.",
      "",
      "",
      "Checked everything, target is not in the array.",
      "",
    ],
  },
  binary: {
    lang: "C",
    lines: [
      "int binarySearch(int a[], int n, int target) {",
      "    low = 0;",
      "    high = n - 1;",
      "    while (low <= high) {",
      "        mid = (low + high) / 2;",
      "        if (a[mid] == target)",
      "            return mid;  // Found!",
      "        else if (a[mid] < target)",
      "            low = mid + 1;",
      "        else",
      "            high = mid - 1;",
      "    }",
      "    return -1;  // Not found",
      "}",
    ],
    explain: [
      "Function takes sorted array, size, and target.",
      "low starts at the beginning.",
      "high starts at the end.",
      "Keep searching while the range is valid.",
      "Check the middle element.",
      "Is it the target?",
      "Yes! Return the index.",
      "Target is bigger → search right half only.",
      "Move low pointer past mid.",
      "Target is smaller → search left half only.",
      "Move high pointer before mid.",
      "",
      "Range exhausted, target not found.",
      "",
    ],
  },
};

/* ─── STEP GENERATORS ─── */
function genSortSteps(algo, init) {
  const a = [...init], n = a.length, steps = [];
  const snap = (hl, line, msg) => steps.push({ arr: [...a], hl, line, msg });

  if (algo === "bubble") {
    snap({}, 0, "Start bubble sort");
    for (let i = 0; i < n - 1; i++) {
      snap({ pass: i }, 0, `Pass ${i + 1}`);
      for (let j = 0; j < n - i - 1; j++) {
        snap({ j, j1: j + 1, doneFrom: n - i }, 2, `Compare a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]}`);
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          snap({ j, j1: j + 1, swap: true, doneFrom: n - i }, 4, `Swap! → ${a[j]} and ${a[j + 1]}`);
        }
      }
    }
    snap({ done: true }, 8, "Sorted!");
  }
  if (algo === "selection") {
    snap({}, 0, "Start selection sort");
    for (let i = 0; i < n; i++) {
      snap({ i, doneUpto: i }, 0, `i=${i}: We want the smallest remaining value at position ${i}. a[${i}]=${a[i]}`);
      for (let j = i + 1; j < n; j++) {
        if (a[j] < a[i]) {
          snap({ i, j, doneUpto: i }, 2, `j=${j}: a[${j}]=${a[j]} < a[${i}]=${a[i]} → YES! Swap them`);
          snap({ i, j, swap: true, doneUpto: i }, 3, `temp = a[${i}] = ${a[i]}`);
          [a[i], a[j]] = [a[j], a[i]];
          snap({ i, j, swap: true, doneUpto: i }, 5, `After swap: a[${i}]=${a[i]}, a[${j}]=${a[j]}. j moves on.`);
        } else {
          snap({ i, j, doneUpto: i }, 2, `j=${j}: a[${j}]=${a[j]} < a[${i}]=${a[i]} → NO. No swap, j moves on.`);
        }
      }
      snap({ doneUpto: i + 1 }, 8, `Position ${i} now has ${a[i]} — smallest remaining value!`);
    }
    snap({ done: true }, 8, "Sorted!");
  }
  if (algo === "insertion") {
    snap({}, 0, "Start insertion sort");
    for (let i = 1; i < n; i++) {
      const key = a[i];
      snap({ i, key: i, doneUpto: i }, 1, `Pick up card a[${i}]=${key}`);
      let j = i - 1;
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        snap({ i, j, shifting: true, doneUpto: i }, 4, `Shift a[${j}]=${a[j]} → right`);
        j--;
      }
      a[j + 1] = key;
      snap({ inserted: j + 1, doneUpto: i + 1 }, 7, `Insert ${key} at position ${j + 1}`);
    }
    snap({ done: true }, 8, "Sorted!");
  }
  if (algo === "quick") {
    snap({}, 0, "Start quick sort");
    function qs(lo, hi) {
      if (lo >= hi) return;
      const pv = a[hi];
      snap({ pivot: hi, range: [lo, hi] }, 8, `Pivot = a[${hi}] = ${pv}`);
      let i = lo - 1;
      for (let j = lo; j < hi; j++) {
        snap({ i: i >= lo ? i : undefined, j, pivot: hi, range: [lo, hi] }, 11, `j=${j}: a[${j}]=${a[j]} ${a[j] < pv ? "<" : "≥"} pivot ${pv}`);
        if (a[j] < pv) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
          snap({ i, j, pivot: hi, swap: true, range: [lo, hi] }, 14, `Swap a[${i}] and a[${j}]`);
        }
      }
      [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
      snap({ pivotFinal: i + 1, range: [lo, hi] }, 19, `Pivot ${pv} placed at index ${i + 1}`);
      qs(lo, i);
      qs(i + 2, hi);
    }
    qs(0, n - 1);
    snap({ done: true }, 0, "Sorted!");
  }
  if (algo === "merge") {
    snap({}, 0, "Start merge sort");
    function ms(l, r) {
      if (l >= r) return;
      const mid = Math.floor((l + r) / 2);
      snap({ range: [l, r], mid }, 2, `Split [${l}..${r}] at mid=${mid}`);
      ms(l, mid);
      ms(mid + 1, r);
      const L = a.slice(l, mid + 1), R = a.slice(mid + 1, r + 1);
      snap({ range: [l, r], merging: true }, 5, `Merge [${L}] + [${R}]`);
      let li = 0, ri = 0, k = l;
      while (li < L.length && ri < R.length) {
        a[k++] = L[li] <= R[ri] ? L[li++] : R[ri++];
      }
      while (li < L.length) a[k++] = L[li++];
      while (ri < R.length) a[k++] = R[ri++];
      snap({ range: [l, r], merged: true }, 5, `Result: [${a.slice(l, r + 1)}]`);
    }
    ms(0, n - 1);
    snap({ done: true }, 0, "Sorted!");
  }
  return steps;
}

function genSearchSteps(algo, arr, target) {
  const a = [...arr].sort((x, y) => x - y);
  const steps = [];
  if (algo === "linear") {
    for (let i = 0; i < a.length; i++) {
      const found = a[i] === target;
      steps.push({ arr: [...a], hl: { checking: i, found }, line: found ? 3 : 1, msg: `Check a[${i}]=${a[i]} ${found ? "= FOUND!" : "≠ " + target}` });
      if (found) return steps;
    }
    steps.push({ arr: [...a], hl: { notFound: true }, line: 6, msg: "Not found in array" });
  }
  if (algo === "binary") {
    let lo = 0, hi = a.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      steps.push({ arr: [...a], hl: { lo, hi, mid }, line: 4, msg: `low=${lo} high=${hi} mid=${mid} → a[${mid}]=${a[mid]}` });
      if (a[mid] === target) {
        steps.push({ arr: [...a], hl: { lo, hi, mid, found: true }, line: 6, msg: `Found ${target} at index ${mid}!` });
        return steps;
      }
      if (a[mid] < target) {
        steps.push({ arr: [...a], hl: { lo, hi, mid, goRight: true }, line: 8, msg: `${a[mid]} < ${target} → search right half` });
        lo = mid + 1;
      } else {
        steps.push({ arr: [...a], hl: { lo, hi, mid, goLeft: true }, line: 10, msg: `${a[mid]} > ${target} → search left half` });
        hi = mid - 1;
      }
    }
    steps.push({ arr: [...a], hl: { notFound: true }, line: 12, msg: "Not found!" });
  }
  return steps;
}

/* ─── Shared Styles ─── */
const S = {
  pill: (active) => ({
    padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
    background: active ? P.accent : P.card2, color: active ? P.white : P.muted,
    fontWeight: 600, fontSize: 12, fontFamily: "inherit", transition: "all .2s",
    whiteSpace: "nowrap",
  }),
  btn: (color = P.accent, disabled = false) => ({
    padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${disabled ? P.border : color}`,
    background: "transparent", color: disabled ? P.border : color,
    fontWeight: 700, fontSize: 13, cursor: disabled ? "default" : "pointer",
    fontFamily: "inherit", transition: "all .15s", opacity: disabled ? 0.4 : 1,
  }),
  input: {
    padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${P.border}`,
    background: P.card, color: P.text, fontFamily: "'Space Mono', monospace",
    fontSize: 13, outline: "none", width: "100%",
  },
};

/* ─── CODE VIEWER with line highlight ─── */
function CodeViewer({ code, activeLine }) {
  if (!code) return null;
  return (
    <div style={{ background: P.codeBg, borderRadius: 10, padding: "2px 0", overflow: "auto", border: `1px solid ${P.border}`, marginTop: 12 }}>
      <div style={{ padding: "10px 0" }}>
        {code.lines.map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "flex-start", padding: "1px 12px",
              background: activeLine === i ? "rgba(127,90,240,0.18)" : "transparent",
              borderLeft: activeLine === i ? `3px solid ${P.accent}` : "3px solid transparent",
              transition: "all .2s",
            }}
          >
            <span style={{ color: P.muted, fontSize: 11, width: 24, flexShrink: 0, textAlign: "right", marginRight: 12, fontFamily: "'Space Mono', monospace", lineHeight: "22px" }}>
              {i + 1}
            </span>
            <pre style={{ margin: 0, fontSize: 12.5, color: activeLine === i ? P.accent : P.text, fontFamily: "'Space Mono', monospace", lineHeight: "22px", whiteSpace: "pre-wrap" }}>
              {line}
            </pre>
          </div>
        ))}
      </div>
      {code.explain && activeLine !== undefined && code.explain[activeLine] && (
        <div style={{ padding: "8px 16px", borderTop: `1px solid ${P.border}`, fontSize: 12, color: P.accent4, lineHeight: 1.5 }}>
          💡 {code.explain[activeLine]}
        </div>
      )}
    </div>
  );
}

/* ─── BAR ─── */
function Bar({ value, max, state, label, onClick, width = 40 }) {
  const h = 20 + (value / max) * 140;
  const colors = {
    normal: { bg: P.card2, bd: P.border },
    i: { bg: "rgba(127,90,240,0.3)", bd: P.accent },
    j: { bg: "rgba(255,107,107,0.25)", bd: P.accent3 },
    swap: { bg: "rgba(255,209,102,0.3)", bd: P.accent4 },
    sorted: { bg: "rgba(44,182,125,0.25)", bd: P.accent2 },
    pivot: { bg: "rgba(247,127,0,0.3)", bd: P.accent6 },
    range: { bg: "rgba(78,205,196,0.2)", bd: P.accent5 },
    merged: { bg: "rgba(44,182,125,0.3)", bd: P.accent2 },
    checking: { bg: "rgba(255,209,102,0.3)", bd: P.accent4 },
    found: { bg: "rgba(44,182,125,0.4)", bd: P.accent2 },
    mid: { bg: "rgba(127,90,240,0.35)", bd: P.accent },
    lo: { bg: "rgba(78,205,196,0.25)", bd: P.accent5 },
    hi: { bg: "rgba(255,107,107,0.2)", bd: P.accent3 },
    outOfRange: { bg: "rgba(15,15,26,0.5)", bd: "rgba(42,42,74,0.5)" },
    key: { bg: "rgba(255,209,102,0.35)", bd: P.accent4 },
    inserted: { bg: "rgba(44,182,125,0.35)", bd: P.accent2 },
  };
  const c = colors[state] || colors.normal;
  return (
    <div onClick={onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: onClick ? "pointer" : "default" }}>
      {label && <span style={{ fontSize: 10, fontWeight: 700, color: c.bd, textTransform: "uppercase", letterSpacing: "0.08em", height: 14 }}>{label}</span>}
      {!label && <span style={{ height: 14 }} />}
      <div style={{
        width, height: h, background: c.bg, border: `2px solid ${c.bd}`,
        borderRadius: 6, display: "flex", alignItems: "flex-end", justifyContent: "center",
        paddingBottom: 6, transition: "all .3s ease", position: "relative",
      }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: P.text, fontFamily: "'Space Mono', monospace" }}>{value}</span>
      </div>
    </div>
  );
}

/* ─── PLAYBACK CONTROLS ─── */
function Playback({ cur, total, playing, onPrev, onNext, onPlay, onReset, speed, onSpeed }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", margin: "12px 0" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button style={S.btn(P.accent5, cur === 0)} onClick={onReset}>⏮</button>
        <button style={S.btn(P.text, cur === 0)} onClick={onPrev}>◀</button>
        <button onClick={onPlay} style={{ ...S.btn(playing ? P.accent3 : P.accent2), padding: "8px 24px" }}>
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
        <button style={S.btn(P.text, cur >= total - 1)} onClick={onNext}>▶</button>
        <button style={S.btn(P.accent5, cur >= total - 1)} onClick={() => { /* skip to end handled outside */ }}>⏭</button>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: P.muted }}>Speed</span>
        <input type="range" min={100} max={1500} step={100} value={1600 - speed} onChange={e => onSpeed(1600 - +e.target.value)} style={{ width: 80, accentColor: P.accent }} />
        <span style={{ fontSize: 11, color: P.muted, fontFamily: "'Space Mono', monospace" }}>{cur}/{total - 1}</span>
      </div>
      <div style={{ width: "100%", height: 3, background: P.card2, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${total > 1 ? (cur / (total - 1)) * 100 : 0}%`, background: `linear-gradient(90deg, ${P.accent}, ${P.accent2})`, borderRadius: 2, transition: "width .2s" }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* ─── SORTING VISUALIZER ─── */
/* ═══════════════════════════════════════════════════ */
function SortingVis({ algo }) {
  const [arr, setArr] = useState([38, 27, 43, 3, 9, 15, 22]);
  const [steps, setSteps] = useState([]);
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [input, setInput] = useState("38,27,43,3,9,15,22");
  const timer = useRef(null);

  useEffect(() => {
    setSteps(genSortSteps(algo, arr));
    setCur(0); setPlaying(false);
  }, [algo, arr]);

  useEffect(() => {
    if (playing && cur < steps.length - 1) timer.current = setTimeout(() => setCur(c => c + 1), speed);
    else if (cur >= steps.length - 1) setPlaying(false);
    return () => clearTimeout(timer.current);
  }, [playing, cur, speed, steps.length]);

  const step = steps[cur] || { arr, hl: {}, msg: "", line: 0 };
  const h = step.hl || {};
  const max = Math.max(...arr, 1);

  const cellState = (idx) => {
    if (h.done) return "sorted";
    if (h.doneUpto !== undefined && idx < h.doneUpto) return "sorted";
    if (h.doneFrom !== undefined && idx >= h.doneFrom) return "sorted";
    if (h.pivotFinal === idx) return "sorted";
    if (h.inserted === idx) return "inserted";
    if (h.merged && h.range && idx >= h.range[0] && idx <= h.range[1]) return "merged";
    if (h.merging && h.range && idx >= h.range[0] && idx <= h.range[1]) return "range";
    if (h.swap && (idx === h.i || idx === h.j || idx === h.j1)) return "swap";
    if (h.pivot === idx) return "pivot";
    if (idx === h.i || idx === h.mi) return "i";
    if (idx === h.j || idx === h.j1) return "j";
    if (h.shifting && idx === h.j) return "j";
    if (h.key === idx) return "key";
    if (h.range && idx >= h.range[0] && idx <= h.range[1]) return "range";
    return "normal";
  };
  const cellLabel = (idx) => {
    if (h.pivot === idx || h.pivotFinal === idx) return "pvt";
    if (idx === h.i && idx === h.j) return "i,j";
    if (idx === h.i || idx === h.mi) return "i";
    if (idx === h.j) return "j";
    if (idx === h.j1) return "j+1";
    if (h.key === idx) return "key";
    if (h.inserted === idx) return "✓";
    if (h.mid === idx) return "mid";
    return null;
  };

  return (
    <div>
      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. 38,27,43,3,9" style={{ ...S.input, flex: 1, minWidth: 140 }} />
        <button onClick={() => { const p = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n) && n > 0 && n < 100); if (p.length >= 3) setArr(p); }} style={S.btn(P.accent)}>Set</button>
        <button onClick={() => { const a = Array.from({ length: 7 + Math.floor(Math.random() * 4) }, () => Math.floor(Math.random() * 90) + 5); setArr(a); setInput(a.join(",")); }} style={S.btn(P.accent5)}>Random</button>
      </div>

      {/* Bars */}
      <div style={{ background: P.card, borderRadius: 12, padding: "20px 12px 16px", border: `1px solid ${P.border}`, minHeight: 200 }}>
        <div style={{ display: "flex", gap: 5, justifyContent: "center", alignItems: "flex-end", flexWrap: "wrap" }}>
          {step.arr.map((v, i) => <Bar key={i} value={v} max={max} state={cellState(i)} label={cellLabel(i)} />)}
        </div>
      </div>

      {/* Message */}
      <div style={{ background: P.codeBg, border: `1px solid ${P.border}`, borderRadius: 8, padding: "10px 14px", margin: "10px 0", fontSize: 13, color: P.accent4, fontFamily: "'Space Mono', monospace", lineHeight: 1.5 }}>
        {step.msg}
      </div>

      <Playback cur={cur} total={steps.length} playing={playing}
        onPrev={() => { if (cur > 0) { setCur(cur - 1); setPlaying(false); } }}
        onNext={() => { if (cur < steps.length - 1) { setCur(cur + 1); setPlaying(false); } }}
        onPlay={() => setPlaying(!playing)} onReset={() => { setCur(0); setPlaying(false); }}
        speed={speed} onSpeed={setSpeed} />

      <CodeViewer code={CODES[algo]} activeLine={step.line} />

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12, justifyContent: "center" }}>
        {[["i / position", P.accent], ["j / scanner", P.accent3], ["swap", P.accent4], ["pivot", P.accent6], ["sorted", P.accent2]].map(([l, c]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, border: `2px solid ${c}`, background: `${c}33` }} />
            <span style={{ fontSize: 11, color: P.muted }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* ─── SEARCHING VISUALIZER ─── */
/* ═══════════════════════════════════════════════════ */
function SearchVis({ algo }) {
  const [arr, setArr] = useState([3, 9, 15, 22, 27, 38, 43]);
  const [target, setTarget] = useState(22);
  const [steps, setSteps] = useState([]);
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const timer = useRef(null);

  useEffect(() => {
    const sorted = [...arr].sort((a, b) => a - b);
    setSteps(genSearchSteps(algo, sorted, target));
    setCur(0); setPlaying(false);
  }, [algo, arr, target]);

  useEffect(() => {
    if (playing && cur < steps.length - 1) timer.current = setTimeout(() => setCur(c => c + 1), speed);
    else if (cur >= steps.length - 1) setPlaying(false);
    return () => clearTimeout(timer.current);
  }, [playing, cur, speed, steps.length]);

  const step = steps[cur] || { arr, hl: {}, msg: "" };
  const h = step.hl || {};
  const max = Math.max(...arr, 1);

  const cellState = (idx) => {
    if (h.found && idx === (h.checking ?? h.mid)) return "found";
    if (h.notFound) return "normal";
    if (algo === "binary") {
      if (idx === h.mid) return "mid";
      if (h.lo !== undefined && h.hi !== undefined) {
        if (idx < h.lo || idx > h.hi) return "outOfRange";
        if (idx === h.lo) return "lo";
        if (idx === h.hi) return "hi";
      }
      return "normal";
    }
    if (idx === h.checking) return "checking";
    return "normal";
  };
  const cellLabel = (idx) => {
    if (h.found && idx === (h.checking ?? h.mid)) return "✓";
    if (algo === "binary") {
      if (idx === h.mid) return "mid";
      if (idx === h.lo) return "low";
      if (idx === h.hi) return "high";
    }
    if (idx === h.checking) return "→";
    return null;
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: P.muted }}>Target:</span>
        <input type="number" value={target} onChange={e => setTarget(+e.target.value)} style={{ ...S.input, width: 70 }} />
        <button onClick={() => { const a = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 5); setArr(a); setTarget(a[Math.floor(Math.random() * a.length)]); }} style={S.btn(P.accent5)}>Random</button>
        <span style={{ fontSize: 12, color: P.muted, marginLeft: 8 }}>Click any bar to search for it!</span>
      </div>

      <div style={{ background: P.card, borderRadius: 12, padding: "20px 12px 16px", border: `1px solid ${P.border}`, minHeight: 180 }}>
        <div style={{ display: "flex", gap: 5, justifyContent: "center", alignItems: "flex-end" }}>
          {step.arr.map((v, i) => <Bar key={i} value={v} max={max} state={cellState(i)} label={cellLabel(i)} onClick={() => { setTarget(v); }} />)}
        </div>
      </div>

      <div style={{ background: P.codeBg, border: `1px solid ${P.border}`, borderRadius: 8, padding: "10px 14px", margin: "10px 0", fontSize: 13, color: P.accent4, fontFamily: "'Space Mono', monospace" }}>
        {step.msg || `Searching for ${target}...`}
      </div>

      <Playback cur={cur} total={steps.length} playing={playing}
        onPrev={() => { if (cur > 0) { setCur(cur - 1); setPlaying(false); } }}
        onNext={() => { if (cur < steps.length - 1) { setCur(cur + 1); setPlaying(false); } }}
        onPlay={() => setPlaying(!playing)} onReset={() => { setCur(0); setPlaying(false); }}
        speed={speed} onSpeed={setSpeed} />

      <CodeViewer code={CODES[algo]} activeLine={step.line} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* ─── STACK & QUEUE VISUALIZER ─── */
/* ═══════════════════════════════════════════════════ */
function StackQueueVis({ algo }) {
  const [items, setItems] = useState([10, 20, 30]);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState(algo === "stack" ? "LIFO: Last In, First Out. Push and pop from the top!" : "FIFO: First In, First Out. Add at rear, remove from front!");
  const [highlight, setHighlight] = useState(null);
  const isStack = algo === "stack";

  const push = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    if (isStack) {
      setItems(prev => [...prev, val]);
      setMsg(`Pushed ${val} to top of stack`);
      setHighlight(items.length);
    } else {
      setItems(prev => [...prev, val]);
      setMsg(`Enqueued ${val} at rear of queue`);
      setHighlight(items.length);
    }
    setInput("");
    setTimeout(() => setHighlight(null), 800);
  };

  const pop = () => {
    if (items.length === 0) { setMsg("Empty! Nothing to remove."); return; }
    if (isStack) {
      const val = items[items.length - 1];
      setHighlight(items.length - 1);
      setMsg(`Popped ${val} from top`);
      setTimeout(() => { setItems(prev => prev.slice(0, -1)); setHighlight(null); }, 400);
    } else {
      const val = items[0];
      setHighlight(0);
      setMsg(`Dequeued ${val} from front`);
      setTimeout(() => { setItems(prev => prev.slice(1)); setHighlight(null); }, 400);
    }
  };

  const peek = () => {
    if (items.length === 0) { setMsg("Empty!"); return; }
    const idx = isStack ? items.length - 1 : 0;
    setHighlight(idx);
    setMsg(`Peek: ${items[idx]} (${isStack ? "top" : "front"} element)`);
    setTimeout(() => setHighlight(null), 1000);
  };

  const displayItems = isStack ? [...items].reverse() : items;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter value" onKeyDown={e => e.key === "Enter" && push()} style={{ ...S.input, width: 120 }} />
        <button onClick={push} style={S.btn(P.accent2)}>{isStack ? "Push" : "Enqueue"}</button>
        <button onClick={pop} style={S.btn(P.accent3)}>{isStack ? "Pop" : "Dequeue"}</button>
        <button onClick={peek} style={S.btn(P.accent4)}>Peek</button>
        <button onClick={() => { setItems([]); setMsg("Cleared!"); }} style={S.btn(P.muted)}>Clear</button>
      </div>

      <div style={{ background: P.card, borderRadius: 12, padding: 20, border: `1px solid ${P.border}`, minHeight: 200 }}>
        {isStack ? (
          /* Stack: vertical */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 11, color: P.accent, fontWeight: 700, marginBottom: 4 }}>← TOP</div>
            {displayItems.length === 0 && <div style={{ color: P.muted, fontSize: 13, padding: 40 }}>Stack is empty</div>}
            {displayItems.map((v, i) => {
              const realIdx = items.length - 1 - i;
              const isHl = highlight === realIdx;
              return (
                <div key={i} style={{
                  width: 120, padding: "10px 16px", textAlign: "center",
                  background: isHl ? "rgba(127,90,240,0.3)" : P.card2,
                  border: `2px solid ${isHl ? P.accent : P.border}`,
                  borderRadius: 8, color: P.text, fontWeight: 600,
                  fontFamily: "'Space Mono', monospace", fontSize: 15,
                  transition: "all .3s", transform: isHl ? "scale(1.08)" : "scale(1)",
                }}>
                  {v}
                </div>
              );
            })}
            <div style={{ fontSize: 11, color: P.muted, marginTop: 4 }}>BOTTOM</div>
          </div>
        ) : (
          /* Queue: horizontal */
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: P.accent2, fontWeight: 700 }}>FRONT →</span>
              <span style={{ fontSize: 11, color: P.accent6, fontWeight: 700 }}>← REAR</span>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              {displayItems.length === 0 && <div style={{ color: P.muted, fontSize: 13, padding: 40 }}>Queue is empty</div>}
              {displayItems.map((v, i) => {
                const isHl = highlight === i;
                return (
                  <div key={i} style={{
                    width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center",
                    background: isHl ? "rgba(44,182,125,0.3)" : P.card2,
                    border: `2px solid ${isHl ? P.accent2 : i === 0 ? P.accent2 : i === displayItems.length - 1 ? P.accent6 : P.border}`,
                    borderRadius: 8, color: P.text, fontWeight: 600,
                    fontFamily: "'Space Mono', monospace", fontSize: 15,
                    transition: "all .3s", transform: isHl ? "scale(1.1)" : "scale(1)",
                  }}>
                    {v}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ background: P.codeBg, border: `1px solid ${P.border}`, borderRadius: 8, padding: "10px 14px", margin: "10px 0", fontSize: 13, color: P.accent4, fontFamily: "'Space Mono', monospace" }}>
        {msg}
      </div>

      <CodeViewer code={isStack ? {
        lines: [
          "// Push - add to top",
          "void push(int stack[], int *top, int val) {",
          "    (*top)++;",
          "    stack[*top] = val;",
          "}",
          "",
          "// Pop - remove from top",
          "int pop(int stack[], int *top) {",
          "    int val = stack[*top];",
          "    (*top)--;",
          "    return val;",
          "}",
          "",
          "// Peek - look at top",
          "int peek(int stack[], int top) {",
          "    return stack[top];",
          "}",
        ],
        explain: [
          "Push: add a new element on top of the stack.",
          "",
          "Move top pointer up by 1.",
          "Place the value at the new top position.",
          "",
          "",
          "Pop: remove the top element.",
          "",
          "Save the top value before removing.",
          "Move top pointer down by 1.",
          "Return the removed value.",
          "",
          "",
          "Peek: just look at the top without removing.",
          "",
          "Return whatever is at the top position.",
          "",
        ],
      } : {
        lines: [
          "// Enqueue - add at rear",
          "void enqueue(int queue[], int *rear, int val) {",
          "    (*rear)++;",
          "    queue[*rear] = val;",
          "}",
          "",
          "// Dequeue - remove from front",
          "int dequeue(int queue[], int *front) {",
          "    int val = queue[*front];",
          "    (*front)++;",
          "    return val;",
          "}",
          "",
          "// Peek - look at front",
          "int peek(int queue[], int front) {",
          "    return queue[front];",
          "}",
        ],
        explain: [
          "Enqueue: add element at the rear of the queue.",
          "",
          "Move rear pointer forward by 1.",
          "Place the value at the new rear position.",
          "",
          "",
          "Dequeue: remove the front element.",
          "",
          "Save the front value before removing.",
          "Move front pointer forward by 1.",
          "Return the removed value.",
          "",
          "",
          "Peek: just look at the front without removing.",
          "",
          "Return whatever is at the front position.",
          "",
        ],
      }} activeLine={undefined} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* ─── LINKED LIST VISUALIZER ─── */
/* ═══════════════════════════════════════════════════ */
function LinkedListVis() {
  const [nodes, setNodes] = useState([10, 20, 30, 40, 50]);
  const [input, setInput] = useState("");
  const [posInput, setPosInput] = useState("");
  const [msg, setMsg] = useState("Click on any node, or add/remove elements to see how pointers update!");
  const [highlight, setHighlight] = useState(null);
  const [traversing, setTraversing] = useState(false);

  const addFront = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setNodes(prev => [val, ...prev]);
    setHighlight(0);
    setMsg(`Inserted ${val} at head. New node points to old head.`);
    setInput("");
    setTimeout(() => setHighlight(null), 800);
  };
  const addEnd = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setNodes(prev => [...prev, val]);
    setHighlight(nodes.length);
    setMsg(`Inserted ${val} at tail. Traversed to end, last node now points to new node.`);
    setInput("");
    setTimeout(() => setHighlight(null), 800);
  };
  const addAt = () => {
    const val = parseInt(input);
    const pos = parseInt(posInput);
    if (isNaN(val) || isNaN(pos) || pos < 0 || pos > nodes.length) { setMsg("Invalid position!"); return; }
    const copy = [...nodes];
    copy.splice(pos, 0, val);
    setNodes(copy);
    setHighlight(pos);
    setMsg(`Inserted ${val} at position ${pos}. Updated prev node's pointer.`);
    setInput(""); setPosInput("");
    setTimeout(() => setHighlight(null), 800);
  };
  const removeAt = () => {
    const pos = parseInt(posInput);
    if (isNaN(pos) || pos < 0 || pos >= nodes.length) { setMsg("Invalid position!"); return; }
    const val = nodes[pos];
    setHighlight(pos);
    setMsg(`Removing ${val} at position ${pos}. Prev node skips over it.`);
    setTimeout(() => {
      setNodes(prev => prev.filter((_, i) => i !== pos));
      setHighlight(null);
    }, 500);
    setPosInput("");
  };

  const traverse = async () => {
    if (traversing) return;
    setTraversing(true);
    for (let i = 0; i < nodes.length; i++) {
      setHighlight(i);
      setMsg(`Traversing: visiting node ${i} → value = ${nodes[i]}`);
      await new Promise(r => setTimeout(r, 500));
    }
    setMsg("Traversal complete! Reached NULL.");
    setHighlight(null);
    setTraversing(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Value" style={{ ...S.input, width: 80 }} />
        <input value={posInput} onChange={e => setPosInput(e.target.value)} placeholder="Pos" style={{ ...S.input, width: 60 }} />
        <button onClick={addFront} style={S.btn(P.accent2)}>Add front</button>
        <button onClick={addEnd} style={S.btn(P.accent5)}>Add end</button>
        <button onClick={addAt} style={S.btn(P.accent)}>Add at pos</button>
        <button onClick={removeAt} style={S.btn(P.accent3)}>Remove at pos</button>
        <button onClick={traverse} style={S.btn(P.accent4)}>Traverse</button>
      </div>

      <div style={{ background: P.card, borderRadius: 12, padding: "24px 16px", border: `1px solid ${P.border}`, overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: "fit-content", justifyContent: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: P.accent2, fontWeight: 700, marginRight: 8 }}>HEAD</span>
          {nodes.map((v, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div
                onClick={() => { setHighlight(i); setMsg(`Node ${i}: value=${v}, next=${i < nodes.length - 1 ? "→ node " + (i + 1) : "NULL"}`); setTimeout(() => setHighlight(null), 1200); }}
                style={{
                  display: "flex", cursor: "pointer", borderRadius: 8, overflow: "hidden",
                  border: `2px solid ${highlight === i ? P.accent : P.border}`,
                  background: highlight === i ? "rgba(127,90,240,0.2)" : P.card2,
                  transition: "all .3s", transform: highlight === i ? "scale(1.08)" : "scale(1)",
                }}
              >
                <div style={{ padding: "10px 14px", fontWeight: 700, fontSize: 15, color: P.text, fontFamily: "'Space Mono', monospace", borderRight: `1px solid ${P.border}` }}>
                  {v}
                </div>
                <div style={{ padding: "10px 8px", fontSize: 11, color: P.muted, display: "flex", alignItems: "center" }}>
                  {i < nodes.length - 1 ? "→" : "∅"}
                </div>
              </div>
              {i < nodes.length - 1 && (
                <div style={{ width: 24, height: 2, background: P.accent5 }} />
              )}
            </div>
          ))}
          {nodes.length > 0 && <span style={{ fontSize: 12, color: P.accent3, fontWeight: 700, marginLeft: 8 }}>NULL</span>}
          {nodes.length === 0 && <span style={{ color: P.muted, fontSize: 13 }}>Empty list → NULL</span>}
        </div>
      </div>

      <div style={{ background: P.codeBg, border: `1px solid ${P.border}`, borderRadius: 8, padding: "10px 14px", margin: "10px 0", fontSize: 13, color: P.accent4, fontFamily: "'Space Mono', monospace" }}>
        {msg}
      </div>

      <CodeViewer code={{
        lines: [
          "struct Node {",
          "    int data;",
          "    struct Node* next;",
          "};",
          "",
          "// Insert at front",
          "void insertFront(struct Node** head, int val) {",
          "    struct Node* newNode = malloc(sizeof(Node));",
          "    newNode->data = val;",
          "    newNode->next = *head;",
          "    *head = newNode;",
          "}",
          "",
          "// Traverse the list",
          "void traverse(struct Node* curr) {",
          "    while (curr != NULL) {",
          "        printf(\"%d \", curr->data);",
          "        curr = curr->next;",
          "    }",
          "}",
        ],
        explain: [
          "Node structure definition.",
          "Each node stores an integer value (data).",
          "And a pointer to the next node in the list.",
          "",
          "",
          "Insert a new node at the front of the list.",
          "Takes pointer to head and the value to insert.",
          "Allocate memory for a new node.",
          "Set the new node's data to val.",
          "Point new node's next to the current head.",
          "Update head to point to the new node.",
          "",
          "",
          "Walk through every node in the list.",
          "Start from the head node.",
          "Keep going until we reach NULL (end of list).",
          "Print the current node's data.",
          "Move to the next node.",
          "",
          "",
        ],
      }} activeLine={traversing ? 17 : undefined} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* ─── BST VISUALIZER ─── */
/* ═══════════════════════════════════════════════════ */
function BSTVis() {
  const [tree, setTree] = useState(null);
  const [msg, setMsg] = useState("Add values to build a BST! Smaller goes left, bigger goes right.");
  const [input, setInput] = useState("");
  const [highlight, setHighlight] = useState(null);
  const [traversalResult, setTraversalResult] = useState([]);

  const insert = (root, val) => {
    if (!root) return { val, left: null, right: null };
    if (val < root.val) return { ...root, left: insert(root.left, val) };
    if (val > root.val) return { ...root, right: insert(root.right, val) };
    return root;
  };

  const addNode = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setTree(prev => insert(prev, val));
    setMsg(`Inserted ${val}: traversed tree, placed ${val} in correct BST position.`);
    setHighlight(val);
    setInput("");
    setTimeout(() => setHighlight(null), 1000);
  };

  const doTraversal = async (type) => {
    const result = [];
    const traverse = async (node) => {
      if (!node) return;
      if (type === "preorder") { result.push(node.val); setHighlight(node.val); setMsg(`${type}: Visit ${node.val} → [${result.join(", ")}]`); await new Promise(r => setTimeout(r, 500)); }
      await traverse(node.left);
      if (type === "inorder") { result.push(node.val); setHighlight(node.val); setMsg(`${type}: Visit ${node.val} → [${result.join(", ")}]`); await new Promise(r => setTimeout(r, 500)); }
      await traverse(node.right);
      if (type === "postorder") { result.push(node.val); setHighlight(node.val); setMsg(`${type}: Visit ${node.val} → [${result.join(", ")}]`); await new Promise(r => setTimeout(r, 500)); }
    };
    await traverse(tree);
    setMsg(`${type} result: [${result.join(", ")}]`);
    setTraversalResult(result);
    setHighlight(null);
  };

  const renderTree = (node, x, y, spread, depth = 0) => {
    if (!node) return null;
    const isHl = highlight === node.val;
    const r = 22;
    return (
      <g key={`${node.val}-${x}-${y}`}>
        {node.left && <line x1={x} y1={y} x2={x - spread} y2={y + 60} stroke={P.accent5} strokeWidth={2} opacity={0.5} />}
        {node.right && <line x1={x} y1={y} x2={x + spread} y2={y + 60} stroke={P.accent5} strokeWidth={2} opacity={0.5} />}
        <circle cx={x} cy={y} r={r} fill={isHl ? P.accent : P.card2} stroke={isHl ? P.accent4 : P.border} strokeWidth={2} style={{ cursor: "pointer", transition: "all .3s" }}
          onClick={() => { setHighlight(node.val); setMsg(`Node ${node.val}: left=${node.left?.val ?? "null"}, right=${node.right?.val ?? "null"}`); setTimeout(() => setHighlight(null), 1200); }}
        />
        <text x={x} y={y + 5} textAnchor="middle" fill={P.text} fontSize={13} fontWeight={700} fontFamily="'Space Mono', monospace" style={{ pointerEvents: "none" }}>
          {node.val}
        </text>
        {renderTree(node.left, x - spread, y + 60, spread * 0.55, depth + 1)}
        {renderTree(node.right, x + spread, y + 60, spread * 0.55, depth + 1)}
      </g>
    );
  };

  const getDepth = (node) => {
    if (!node) return 0;
    return 1 + Math.max(getDepth(node.left), getDepth(node.right));
  };
  const depth = getDepth(tree);
  const svgH = Math.max(200, depth * 65 + 40);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addNode()} placeholder="Value" style={{ ...S.input, width: 80 }} />
        <button onClick={addNode} style={S.btn(P.accent2)}>Insert</button>
        <button onClick={() => { setTree(null); setMsg("Tree cleared!"); setTraversalResult([]); }} style={S.btn(P.muted)}>Clear</button>
        <span style={{ width: 1, height: 20, background: P.border, margin: "0 4px" }} />
        <button onClick={() => doTraversal("inorder")} style={S.btn(P.accent)}>Inorder</button>
        <button onClick={() => doTraversal("preorder")} style={S.btn(P.accent5)}>Preorder</button>
        <button onClick={() => doTraversal("postorder")} style={S.btn(P.accent6)}>Postorder</button>
      </div>

      <div style={{ background: P.card, borderRadius: 12, padding: 16, border: `1px solid ${P.border}`, minHeight: 200 }}>
        {!tree ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180, color: P.muted, fontSize: 14 }}>
            Enter a number and click Insert to start building the tree
          </div>
        ) : (
          <svg width="100%" height={svgH} viewBox={`0 0 500 ${svgH}`}>
            {renderTree(tree, 250, 30, 110)}
          </svg>
        )}
      </div>

      <div style={{ background: P.codeBg, border: `1px solid ${P.border}`, borderRadius: 8, padding: "10px 14px", margin: "10px 0", fontSize: 13, color: P.accent4, fontFamily: "'Space Mono', monospace", lineHeight: 1.5 }}>
        {msg}
        {traversalResult.length > 0 && (
          <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {traversalResult.map((v, i) => (
              <span key={i} style={{ background: "rgba(127,90,240,0.2)", border: `1px solid ${P.accent}`, borderRadius: 4, padding: "2px 8px", fontSize: 12, color: P.accent }}>{v}</span>
            ))}
          </div>
        )}
      </div>

      <CodeViewer code={{
        lines: [
          "struct Node {",
          "    int data;",
          "    struct Node* left;",
          "    struct Node* right;",
          "};",
          "",
          "// Insert into BST",
          "struct Node* insert(struct Node* root, int val) {",
          "    if (root == NULL) {",
          "        return createNode(val);",
          "    }",
          "    if (val < root->data) {",
          "        root->left = insert(root->left, val);",
          "    }",
          "    else if (val > root->data) {",
          "        root->right = insert(root->right, val);",
          "    }",
          "    return root;",
          "}",
          "",
          "// Inorder:   Left → Root → Right (sorted!)",
          "// Preorder:  Root → Left → Right",
          "// Postorder: Left → Right → Root",
        ],
        explain: [
          "BST Node structure.",
          "Each node stores data.",
          "Pointer to left child (smaller values).",
          "Pointer to right child (bigger values).",
          "",
          "",
          "Insert a value into the BST.",
          "Takes root pointer and value to insert.",
          "If we reach an empty spot...",
          "...create a new node here! Base case.",
          "",
          "If value is smaller than current node...",
          "...go left and recurse.",
          "",
          "If value is bigger than current node...",
          "...go right and recurse.",
          "",
          "Return the (possibly updated) root.",
          "",
          "",
          "Inorder gives elements in sorted order.",
          "Preorder visits root first, then children.",
          "Postorder visits children first, then root.",
        ],
      }} activeLine={undefined} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* ─── MAIN APP ─── */
/* ═══════════════════════════════════════════════════ */
export default function DSAVisualizer() {
  const [cat, setCat] = useState("sorting");
  const [algo, setAlgo] = useState("bubble");
  const catData = CATEGORIES[cat];
  const algoData = catData.algos[algo];

  useEffect(() => {
    const firstAlgo = Object.keys(CATEGORIES[cat].algos)[0];
    setAlgo(firstAlgo);
  }, [cat]);

  return (
    <div style={{ background: P.bg, minHeight: "100vh", fontFamily: "'Nunito', sans-serif", color: P.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, background: `linear-gradient(135deg, ${P.accent}, ${P.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          DSA Visualizer
        </h1>
        <p style={{ fontSize: 12, color: P.muted, marginTop: 2 }}>Interactive data structures & algorithms</p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 6, padding: "12px 16px", overflow: "auto", justifyContent: "center", flexWrap: "wrap" }}>
        {Object.entries(CATEGORIES).map(([key, val]) => (
          <button key={key} onClick={() => setCat(key)} style={{
            ...S.pill(cat === key),
            display: "flex", alignItems: "center", gap: 5,
            ...(cat === key ? { background: `linear-gradient(135deg, ${P.accent}, ${P.accent2})`, color: P.white } : {}),
          }}>
            <span style={{ fontSize: 14 }}>{val.icon}</span> {val.label}
          </button>
        ))}
      </div>

      {/* Algorithm Tabs */}
      <div style={{ display: "flex", gap: 5, padding: "4px 16px 12px", overflow: "auto", justifyContent: "center", flexWrap: "wrap" }}>
        {Object.entries(catData.algos).map(([key, val]) => (
          <button key={key} onClick={() => setAlgo(key)} style={S.pill(algo === key)}>
            {val.name}
          </button>
        ))}
      </div>

      {/* Info Bar */}
      <div style={{ margin: "0 16px 12px", background: P.card, borderRadius: 10, padding: "10px 16px", border: `1px solid ${P.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontWeight: 800, fontSize: 15 }}>{algoData.name}</span>
        <div style={{ display: "flex", gap: 10 }}>
          {algoData.tc && <span style={{ fontSize: 11, color: P.accent, background: "rgba(127,90,240,0.15)", padding: "3px 10px", borderRadius: 12, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>Time: {algoData.tc}</span>}
          {algoData.sc && <span style={{ fontSize: 11, color: P.accent2, background: "rgba(44,182,125,0.15)", padding: "3px 10px", borderRadius: 12, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>Space: {algoData.sc}</span>}
          {algoData.stable && <span style={{ fontSize: 11, color: P.accent4, background: "rgba(255,209,102,0.15)", padding: "3px 10px", borderRadius: 12, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>Stable: {algoData.stable}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "0 16px 24px" }}>
        {cat === "sorting" && <SortingVis algo={algo} />}
        {cat === "searching" && <SearchVis algo={algo} />}
        {cat === "stacks" && <StackQueueVis algo={algo} />}
        {cat === "linkedlist" && <LinkedListVis />}
        {cat === "trees" && <BSTVis />}
      </div>
    </div>
  );
}
