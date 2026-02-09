"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CleanOnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onSkip?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  isNextLoading?: boolean;
  showBack?: boolean;
}

export function CleanOnboardingLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  onSkip,
  onNext,
  nextLabel = "Next",
  isNextLoading = false,
  showBack = true,
}: CleanOnboardingLayoutProps) {
  return (
    <div className="h-[calc(100vh-5rem)] bg-background flex flex-col">
      {/* Header with Logo? Or just clean */}
      {/* <div className="absolute top-8 left-8">
           <div className="font-bold text-xl">Shunya</div>
      </div> */}

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl"
        >
          {children}
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between w-full max-w-2xl gap-4 mt-8">
          <div className="flex items-center gap-2">
            {showBack && onBack && (
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                Back
              </Button>
            )}
            {onSkip && (
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip
              </Button>
            )}
          </div>

          {onNext && (
            <Button
              onClick={onNext}
              size="lg"
              className="min-w-[120px]"
              disabled={isNextLoading}
            >
              {isNextLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {nextLabel}
            </Button>
          )}
        </div>
      </main>

      <footer className="p-8 flex items-center justify-center flex-col gap-2 pb-12 w-full">
        {/* Carousel Dots */}
        <div className="flex items-center gap-3">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/20 w-2 hover:bg-primary/50"
              }`}
              layoutId={`pagination-${index}`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
