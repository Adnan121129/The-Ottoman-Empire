import { Hero } from '@/components/sections/Hero';
import { Prologue } from '@/components/sections/Prologue';
import { Timeline } from '@/components/timeline/Timeline';
import { OnThisDay } from '@/components/sections/OnThisDay';
import { EmpireThroughTime } from '@/components/sections/EmpireThroughTime';
import { Siege1453 } from '@/components/sections/Siege1453';
import { AgeOfSuleiman } from '@/components/sections/AgeOfSuleiman';
import { TimeMachine } from '@/components/sections/TimeMachine';
import { TransformationStrip } from '@/components/sections/TransformationStrip';
import { FinalYearsChapter } from '@/components/sections/FinalYears';
import { Legacy } from '@/components/sections/Legacy';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Prologue />
      <Timeline />
      <OnThisDay />
      <EmpireThroughTime />
      <Siege1453 />
      <AgeOfSuleiman />
      <TimeMachine />
      <TransformationStrip />
      <FinalYearsChapter compact id="final-years-journey" />
      <Legacy />
    </>
  );
}
