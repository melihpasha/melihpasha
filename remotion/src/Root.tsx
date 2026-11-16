import { Composition } from "remotion";
import { KarpuzAdam, KARPUZ_DURATION } from "./KarpuzAdam";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="KarpuzAdam"
    component={KarpuzAdam}
    durationInFrames={KARPUZ_DURATION}
    fps={30}
    width={1080}
    height={1920}
  />
);
