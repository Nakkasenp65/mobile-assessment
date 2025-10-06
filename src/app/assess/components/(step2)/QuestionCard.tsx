import { motion } from "framer-motion";
import { ConditionInfo } from "../../../../types/device";

interface QuestionCardProps {
  question: Question;
  selectedValue: string;
  onOptionChange: (questionId: keyof ConditionInfo, value: string) => void;
}

interface Question {
  id: keyof ConditionInfo;
  question: string;
  options: Array<{ value: string; label: string }>;
}

const QuestionCard = ({ question, selectedValue, onOptionChange }: QuestionCardProps) => (
  <div>
    <p className="text-foreground mb-6 flex h-12 items-center justify-center text-center text-xl font-medium">
      {question.question} *
    </p>
    <div className="space-y-3">
      {question.options.map((option) => (
        <label
          key={option.value}
          className={`hover:bg-accent flex cursor-pointer items-center rounded-xl border p-4 transition-all duration-200 ${
            selectedValue === option.value
              ? "border-primary bg-primary/10 ring-primary ring-2"
              : "border-border hover:border-primary/50"
          }`}
        >
          <input
            type="radio"
            name={question.id}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onOptionChange(question.id, option.value)}
            className="sr-only"
          />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 ${
              selectedValue === option.value ? "border-primary bg-primary" : "border-muted-foreground/50"
            }`}
          >
            {selectedValue === option.value && (
              <motion.div
                className="h-2 w-2 rounded-full bg-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </div>
          <span className="text-foreground text-base">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

export default QuestionCard;
