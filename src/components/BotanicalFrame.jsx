import DecorativePetals from './DecorativePetals';
import DecorativeGlow from './DecorativeGlow';
import HangingVine from './HangingVine';
import DecorativeLeaves from './DecorativeLeaves';
import DecorativeFlowers from './DecorativeFlowers';

function BotanicalFrame() {
  return (
    <div className="botanical-frame" aria-hidden="true">
      <DecorativeGlow variant="global" />

      {/* Edge decorations that stay fixed or absolute to the top */}
      <div className="botanical-edges">
        <HangingVine variant="global" side="left" active={true} />
        <HangingVine variant="global" side="right" active={true} />
        
        {/* Some extra floating petals and leaves for the global layer */}
        <DecorativePetals variant="global" count={3} />
      </div>
    </div>
  );
}

export default BotanicalFrame;
