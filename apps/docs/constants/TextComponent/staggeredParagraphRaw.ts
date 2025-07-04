const code = `
"use client";

import React, {useRef, ReactNode, ReactElement, isValidElement} from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface StaggeredParagraphProps {
  children: ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
  className?: string;
}

interface SplitTextInstance {
  lines: Element[];
  words: Element[];
  chars: Element[];
  revert: () => void;
}

export default function StaggeredParagraph({
  children,
  animateOnScroll = true,
  delay = 0,
  className,
}: StaggeredParagraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLElement[]>([]);
  const splitRef = useRef<SplitTextInstance[]>([]);
  const lines = useRef<HTMLElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      splitRef.current = [];
      elementRef.current = [];
      lines.current = [];

      let elements: HTMLElement[] = [];

      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children) as HTMLElement[];
      } else {
        elements = [containerRef.current as HTMLElement];
      }

      elements.forEach((element) => {
        elementRef.current.push(element);

        const split = new SplitText(element, {
          type: "lines",
          mask: "lines",
          linesClass: "line++",
        });

        splitRef.current.push(split);

        const computedStyle = window.getComputedStyle(element);
        const textIndent = computedStyle.textIndent;

        if (textIndent && textIndent !== "0px") {
          const firstLine = split.lines?.[0];
          if (firstLine instanceof HTMLElement) {
            firstLine.style.paddingLeft = textIndent;
          }
          element.style.textIndent = "0";
        }

        lines.current.push(
          ...split.lines.filter(
            (el): el is HTMLElement => el instanceof HTMLElement
          )
        );
      });

      gsap.set(lines.current, {y: "100%"});

      const animationProps = {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(lines.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        });
      } else {
        gsap.to(lines.current, animationProps);
      }

      return () => {
        splitRef.current.forEach((split) => split?.revert?.());
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay],
    }
  );

  if (
    React.Children.count(children) === 1 &&
    isValidElement(children) &&
    typeof children.type === "string"
  ) {
    return React.cloneElement(children as ReactElement<any>, {
      ref: containerRef,
      className,
    });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true" className={className}>
      {typeof children === "string" || typeof children === "number" ? (
        <span>{children}</span>
      ) : (
        children
      )}
    </div>
  );
}

`;

const propsData = [
  {
    property: "children",
    type: "ReactNode",
    default: "–",
    description:
      "The content to apply the staggered animation to. Typically a paragraph or text element.",
  },
  {
    property: "animateOnScroll",
    type: "boolean",
    default: "true",
    description:
      "Whether the animation should be triggered when the element scrolls into view.",
  },
  {
    property: "delay",
    type: "number",
    default: "0",
    description: "Delay in seconds before the animation starts.",
  },
  {
    property: "className",
    type: "string",
    default: "–",
    description:
      "Optional additional class names for styling the wrapper element.",
  },
];

export const staggeredParagraphRaw = {
  installation: `npm i @gsap/react`,
  usage: `
<StaggeredParagraph>
  Lunipod UI is a sleek component library built with Tailwind
  CSS and GSAP, offering ready-to-use animated UI elements for
  modern web projects. Designed for effortless copy-paste
  integration, each component is responsive, customizable, and
  visually dynamic—perfect for developers who want clean design
  and smooth animations without extra setup.
</StaggeredParagraph>
  `,
  code: code,
  props: propsData,
};
