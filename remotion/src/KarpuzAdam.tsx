import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "./Character";
import { blink, hop, springAt, type Pose } from "./motion";

export const KARPUZ_DURATION = 180; // 6 s @ 30 fps; last frame matches first for a seamless loop

const HOPS = [108, 136];
const BLINKS = [22, 100, 162];
const WAVE_UP = 34;
const WAVE_DOWN = 86;

export const KarpuzAdam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Idle breath: period 60 divides the duration, so it loops cleanly.
  const breath = Math.sin((frame / 60) * Math.PI * 2);

  const pose: Pose = HOPS.map((h) => hop(frame, fps, h)).reduce(
    (a, b) => ({ dy: a.dy + b.dy, sx: a.sx + b.sx, sy: a.sy + b.sy, air: Math.max(a.air, b.air) }),
    { dy: 0, sx: 0, sy: 0, air: 0 },
  );

  // Wave: spring up, three waves, spring down.
  const raise = springAt(frame, fps, WAVE_UP) - springAt(frame, fps, WAVE_DOWN);
  const wag = Math.sin(((frame - WAVE_UP - 10) / 13.33) * Math.PI * 2) * 20 * Math.max(0, raise);

  const restL = 22 + breath * 3;
  const restR = -22 - breath * 3;
  const up = 145;
  const leftArm = restL + (up - restL) * pose.air;
  const rightArm = restR + (-155 - restR) * raise + wag + (-up - restR) * pose.air;

  const eyes = Math.max(...BLINKS.map((b) => blink(frame, b)));

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 42%, #fff3a8 0%, #ffd84d 45%, #ffb21f 100%)",
      }}
    >
      {/* Ground shadow shrinks as he rises */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 1478,
          width: 520,
          height: 70,
          marginLeft: -260,
          borderRadius: "50%",
          background: "rgba(140, 70, 0, 0.28)",
          transform: `scale(${1 + pose.dy / 400}, ${1 + pose.dy / 600})`,
          opacity: 1 + pose.dy / 500,
        }}
      />
      <div style={{ position: "absolute", left: 90, top: 350, width: 900, height: 1230 }}>
        <Character
          dy={pose.dy}
          sx={1 + pose.sx - breath * 0.008}
          sy={1 + pose.sy + breath * 0.015}
          leftArm={leftArm}
          rightArm={rightArm}
          blink={eyes}
          lookX={10 * raise}
          lookY={-8 * raise - 6 * pose.air}
          mouth={0.2 + 0.45 * raise + 0.8 * pose.air}
          brow={4 * raise + 12 * pose.air}
        />
      </div>
    </AbsoluteFill>
  );
};
