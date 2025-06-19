const code = `
"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  CSSProperties,
} from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

interface DraggableLettersProps {
  text: string;
  direction?: "x" | "y" | "both";
  spacing?: number;
  verticalCenter?: boolean;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  letterClassName?: string;
  onDragStart?: (char: string, index: number) => void;
  onDragEnd?: (char: string, index: number) => void;
}

type LetterData = {
  char: string;
  top: number;
  left: number;
};

const DraggableLetters: React.FC<DraggableLettersProps> = ({
  text,
  direction = "both",
  spacing = 12,
  verticalCenter = true,
  containerClassName = "",
  containerStyle = {},
  letterClassName = "",
  onDragStart,
  onDragEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [letters, setLetters] = useState<LetterData[]>([]);

  useLayoutEffect(() => {
    if (!containerRef.current || letterRefs.current.length === 0) return;

    const containerWidth = containerRef.current.offsetWidth;
    const widths: number[] = text
      .split("")
      .map((_, i) => letterRefs.current[i]?.offsetWidth ?? 0);

    const totalWidth =
      widths.reduce((sum, w) => sum + w, 0) + spacing * (text.length - 1);
    const startX = (containerWidth - totalWidth) / 2;
    const top = verticalCenter
      ? containerRef.current.offsetHeight / 2 - 32
      : 100;

    const positions: LetterData[] = [];
    let currentLeft = startX;

    text.split("").forEach((char, i) => {
      positions.push({
        char,
        top,
        left: currentLeft,
      });
      currentLeft += (widths[i] ?? 0) + spacing;
    });

    setLetters(positions);
  }, [text, spacing, verticalCenter]);

  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll(".draggable-letter");

    els.forEach((el, i) => {
      Draggable.create(el, {
        bounds: containerRef.current!,
        inertia: true,
        type: direction === "both" ? "x,y" : direction,
        edgeResistance: 0.65,
        onPress: () => {
          const letter = letters[i];
          if (letter && onDragStart) onDragStart(letter.char, i);
        },
        onRelease: () => {
          const letter = letters[i];
          if (letter && onDragEnd) onDragEnd(letter.char, i);
        },
      });
    });
  }, [letters, direction, onDragStart, onDragEnd]);

  return (
    <div
      ref={containerRef}
      className={\`relative h-full w-full overflow-hidden rounded-lg p-6 \${containerClassName}\`}
      style={containerStyle}
    >
      {/* Hidden measuring layer */}
      <div className="absolute top-0 left-0 opacity-0 pointer-events-none">
        {text.split("").map((char, idx) => (
          <div
            key={\`measure-\${idx}\`}
            ref={(el) => {
              letterRefs.current[idx] = el;
            }}
            className="inline-block px-4 py-2 text-7xl font-bold"
          >
            {char}
          </div>
        ))}
      </div>

      {/* Visible draggable letters */}
      {letters.map((item, idx) => (
        <div
          key={\`letter-\${idx}\`}
          className={\`draggable-letter absolute cursor-move px-4 py-2 text-7xl font-bold text-white  rounded-md \${letterClassName}\`}
          style={{
            top: \`\${item.top}px\`,
            left: \`\${item.left}px\`,
          }}
        >
          {item.char}
        </div>
      ))}
    </div>
  );
};

export default DraggableLetters;

`;

const propsData = [
  {
    property: "text",
    type: "string",
    default: "–",
    description:
      "The string of characters to be rendered as individual draggable elements.",
  },
  {
    property: "direction",
    type: '"x" | "y" | "both"',
    default: '"both"',
    description:
      "Specifies the axis along which letters can be dragged: horizontal (`x`), vertical (`y`), or both.",
  },
  {
    property: "spacing",
    type: "number",
    default: "12",
    description:
      "Spacing (in pixels) between each letter when they are initially laid out.",
  },
  {
    property: "verticalCenter",
    type: "boolean",
    default: "true",
    description:
      "If true, vertically centers the letters in the container. If false, uses a fixed top position.",
  },
  {
    property: "containerClassName",
    type: "string",
    default: '""',
    description:
      "Optional custom class names for the outer container of the component.",
  },
  {
    property: "containerStyle",
    type: "CSSProperties",
    default: "{}",
    description: "Inline styles to apply directly to the container element.",
  },
  {
    property: "letterClassName",
    type: "string",
    default: '""',
    description:
      "Additional Tailwind or custom class names applied to each draggable letter.",
  },
  {
    property: "onDragStart",
    type: "(char: string, index: number) => void",
    default: "undefined",
    description:
      "Callback function called when a letter drag starts. Receives the character and its index.",
  },
  {
    property: "onDragEnd",
    type: "(char: string, index: number) => void",
    default: "undefined",
    description:
      "Callback function called when a letter drag ends. Receives the character and its index.",
  },
];

export const draggableLettersRaw = {
  installation: `npm i @gsap/react`,
  usage: `
<DraggableLetters text="LUNIPOD" />
  `,
  code: code,
  props: propsData,
};
