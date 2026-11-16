import React from "react";

export type CharacterProps = {
  /** Root squash/stretch, applied from the feet. */
  dy: number;
  sx: number;
  sy: number;
  /** Arm angles in degrees; 0 = hanging straight down. */
  leftArm: number;
  rightArm: number;
  /** Eyelid closure 0..1. */
  blink: number;
  /** Pupil offset in px. */
  lookX: number;
  lookY: number;
  /** Mouth openness 0..1. */
  mouth: number;
  /** Eyebrow lift in px. */
  brow: number;
};

const GROUND = 780;
const CX = 300;
const BODY_CY = 420;
const BODY_R = 205;

const RIND = "#2fa84f";
const STRIPE = "#17672f";
const OUTLINE = "#0f4a22";
const GLOVE = "#ffffff";
const SHOE = "#ff3b5c";

const Arm: React.FC<{ x: number; y: number; angle: number; flip?: boolean }> = ({
  x,
  y,
  angle,
  flip,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path
      d={`M0 0 Q ${flip ? -14 : 14} 60 0 112`}
      stroke={OUTLINE}
      strokeWidth={20}
      strokeLinecap="round"
      fill="none"
    />
    {/* Glove: cuff + palm + thumb */}
    <ellipse cx={0} cy={112} rx={26} ry={12} fill={GLOVE} stroke={OUTLINE} strokeWidth={5} />
    <circle cx={0} cy={140} r={32} fill={GLOVE} stroke={OUTLINE} strokeWidth={5} />
    <ellipse
      cx={flip ? 26 : -26}
      cy={128}
      rx={12}
      ry={16}
      fill={GLOVE}
      stroke={OUTLINE}
      strokeWidth={5}
    />
  </g>
);

const Leg: React.FC<{ x: number; dir: 1 | -1 }> = ({ x, dir }) => (
  <g>
    <path d={`M${x} 600 L${x} 735`} stroke={OUTLINE} strokeWidth={22} strokeLinecap="round" />
    <path
      d={`M${x - 40 * dir} 765 Q ${x - 46 * dir} 722 ${x + 4 * dir} 724 Q ${x + 40 * dir} 728 ${
        x + 44 * dir
      } 765 Z`}
      fill={SHOE}
      stroke={OUTLINE}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <rect
      x={Math.min(x - 44 * dir, x + 48 * dir)}
      y={760}
      width={92}
      height={16}
      rx={8}
      fill="#fff"
      stroke={OUTLINE}
      strokeWidth={6}
    />
  </g>
);

const Eye: React.FC<{ cx: number; blink: number; lookX: number; lookY: number }> = ({
  cx,
  blink,
  lookX,
  lookY,
}) => {
  const cy = 375;
  const ry = 58 * (1 - 0.94 * blink);
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={46} ry={ry} fill="#fff" stroke={OUTLINE} strokeWidth={6} />
      {blink < 0.6 && (
        <g transform={`translate(${lookX} ${lookY})`}>
          <circle cx={cx + 4} cy={cy + 8} r={25} fill="#1d1b24" />
          <circle cx={cx + 13} cy={cy - 3} r={9} fill="#fff" />
          <circle cx={cx - 4} cy={cy + 18} r={4} fill="#fff" />
        </g>
      )}
    </g>
  );
};

export const Character: React.FC<CharacterProps> = (p) => {
  const mouthDepth = 18 + p.mouth * 48;
  return (
    <svg viewBox="0 0 600 820" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="body">
          <circle cx={CX} cy={BODY_CY} r={BODY_R} />
        </clipPath>
        <radialGradient id="rind" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#5fd477" />
          <stop offset="0.6" stopColor={RIND} />
          <stop offset="1" stopColor="#1e8a3c" />
        </radialGradient>
        <clipPath id="mouth">
          <path d={`M235 468 Q300 488 365 468 Q300 ${468 + mouthDepth * 1.6} 235 468 Z`} />
        </clipPath>
      </defs>

      <g
        transform={`translate(${CX} ${GROUND + p.dy}) scale(${p.sx} ${p.sy}) translate(${-CX} ${-GROUND})`}
      >
        <Leg x={245} dir={1} />
        <Leg x={355} dir={-1} />

        {/* Body: whole watermelon */}
        <circle cx={CX} cy={BODY_CY} r={BODY_R} fill="url(#rind)" />
        <g clipPath="url(#body)" stroke={STRIPE} strokeWidth={24} fill="none" strokeLinecap="round">
          {[-170, -110, -52, 52, 110, 170].map((dx) => (
            <path
              key={dx}
              d={`M${CX + dx * 0.25} ${BODY_CY - BODY_R} C ${CX + dx * 1.1} ${BODY_CY - 90}, ${
                CX + dx * 1.1
              } ${BODY_CY + 90}, ${CX + dx * 0.25} ${BODY_CY + BODY_R}`}
            />
          ))}
        </g>
        <circle cx={CX} cy={BODY_CY} r={BODY_R} fill="none" stroke={OUTLINE} strokeWidth={8} />
        <ellipse cx={225} cy={300} rx={55} ry={30} fill="#fff" opacity={0.28} transform="rotate(-30 225 300)" />

        {/* Stem + leaf */}
        <path d="M300 218 Q296 190 312 172" stroke="#7a4a21" strokeWidth={12} strokeLinecap="round" fill="none" />
        <path d="M310 182 Q350 150 378 176 Q344 200 310 182 Z" fill="#6fd36a" stroke={OUTLINE} strokeWidth={5} />

        {/* Face plate: the red flesh peeks through like a bite-sized window */}
        <ellipse cx={CX} cy={405} rx={140} ry={128} fill="#ff6b78" stroke={OUTLINE} strokeWidth={6} />
        <ellipse cx={CX} cy={405} rx={128} ry={116} fill="none" stroke="#ffd9dd" strokeWidth={6} opacity={0.7} />
        {[
          [200, 450],
          [395, 455],
          [225, 315],
          [378, 318],
        ].map(([x, y]) => (
          <ellipse key={`${x}`} cx={x} cy={y} rx={6} ry={10} fill="#2a1a1a" transform={`rotate(${x < 300 ? -20 : 20} ${x} ${y})`} />
        ))}

        {/* Brows */}
        <g transform={`translate(0 ${-p.brow})`} stroke="#2a1a1a" strokeWidth={9} strokeLinecap="round" fill="none">
          <path d="M215 300 Q245 284 272 296" />
          <path d="M328 296 Q355 284 385 300" />
        </g>

        <Eye cx={248} blink={p.blink} lookX={p.lookX} lookY={p.lookY} />
        <Eye cx={352} blink={p.blink} lookX={p.lookX} lookY={p.lookY} />

        {/* Cheeks */}
        <ellipse cx={205} cy={440} rx={22} ry={13} fill="#ff2f55" opacity={0.45} />
        <ellipse cx={395} cy={440} rx={22} ry={13} fill="#ff2f55" opacity={0.45} />

        {/* Mouth */}
        <path
          d={`M235 468 Q300 488 365 468 Q300 ${468 + mouthDepth * 1.6} 235 468 Z`}
          fill="#7a1430"
          stroke="#2a1a1a"
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <g clipPath="url(#mouth)">
          <ellipse cx={300} cy={470 + mouthDepth * 1.3} rx={40} ry={22} fill="#ff8aa0" />
        </g>

        <Arm x={110} y={440} angle={p.leftArm} />
        <Arm x={490} y={440} angle={p.rightArm} flip />
      </g>
    </svg>
  );
};
