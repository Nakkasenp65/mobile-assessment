import { motion } from "framer-motion";
import { ConditionInfo } from "../../page";

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
    <p className="text-center text-xl font-medium text-foreground mb-6 h-12 flex items-center justify-center">
      {question.question} *
    </p>
    <div className="space-y-3">
      {question.options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:bg-accent ${
            selectedValue === option.value
              ? "border-primary bg-primary/10 ring-2 ring-primary"
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
            className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
              selectedValue === option.value ? "border-primary bg-primary" : "border-muted-foreground/50"
            }`}
          >
            {selectedValue === option.value && (
              <motion.div
                className="w-2 h-2 rounded-full bg-white"
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
