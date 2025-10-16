interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  return (
    <div className={`mx-auto w-full max-w-4xl ${currentStep >= 3 && "hidden"}`}>
      <div className={`flex items-center justify-between md:mb-2`}>
        <span className="text-muted-foreground text-sm font-medium">
          ขั้นตอนที่ {currentStep} จาก {totalSteps}
        </span>
        <span className="text-primary text-sm font-medium">{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>

      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`progress-step flex-1 ${
              index + 1 <= currentStep ? "progress-step-active" : "progress-step-inactive"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
