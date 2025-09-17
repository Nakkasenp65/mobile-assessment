interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          ขั้นตอนที่ {currentStep} จาก {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      
      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`flex-1 progress-step ${
              index + 1 <= currentStep
                ? "progress-step-active"
                : "progress-step-inactive"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;