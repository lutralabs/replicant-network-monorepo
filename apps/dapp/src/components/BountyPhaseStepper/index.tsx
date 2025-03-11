import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
} from '@/components/ui/stepper';

interface StepperProps {
  currentPhase: string;
  phases: {
    id: string;
    name: string;
    description?: string;
    status: 'complete' | 'current' | 'upcoming' | 'failed' | 'stale';
  }[];
}

export function BountyPhasesStepper({ currentPhase, phases }: StepperProps) {
  // Find the index of the current phase
  const currentPhaseIndex = phases.findIndex(
    (phase) => phase.id === currentPhase || phase.status === 'current'
  );
  const activeStep = currentPhaseIndex !== -1 ? currentPhaseIndex + 1 : 1;

  return (
    <div className="space-y-8 text-center w-full p-4">
      <Stepper defaultValue={activeStep}>
        {phases.map((phase, index) => (
          <StepperItem
            key={phase.id}
            step={index + 1}
            completed={phase.status === 'complete'}
            failed={phase.status === 'failed'}
            stale={phase.status === 'stale'}
            className="max-md:items-start [&:not(:last-child)]:flex-1"
          >
            <div className="flex items-center gap-4 max-md:flex-col">
              <StepperIndicator />
              <div className="text-center md:-order-1 md:text-left">
                <StepperTitle>{phase.name}</StepperTitle>
                {phase.description && (
                  <p className="text-sm text-muted-foreground">
                    {phase.description}
                  </p>
                )}
              </div>
            </div>
            {index < phases.length - 1 && (
              <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
            )}
          </StepperItem>
        ))}
      </Stepper>
    </div>
  );
}
