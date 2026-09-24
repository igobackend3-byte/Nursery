import DecorativePetals from './DecorativePetals';
import DecorativeGlow from './DecorativeGlow';

function BotanicalFrame() {
  return (
    <div className="botanical-frame" aria-hidden="true">
      <DecorativeGlow variant="global" />

      <div className="botanical-edges">
        {/* A few floating petals for the global layer */}
        <DecorativePetals variant="global" count={3} />
      </div>
    </div>
  );
}

export default BotanicalFrame;
