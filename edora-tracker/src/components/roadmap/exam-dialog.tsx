"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { type Exam, submitExamAction } from "@/app/actions/roadmap-actions";
import { toast } from "sonner";
import { Loader2, Trophy } from "lucide-react";

interface ExamDialogProps {
    exam: Exam;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ExamDialog({ exam, open, onOpenChange }: ExamDialogProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    const handleNext = () => {
        if (currentQuestion < exam.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        let finalScore = 0;
        exam.questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correctAnswer) {
                finalScore += 10;
            }
        });

        setScore(finalScore);

        if (exam.id) {
            const result = await submitExamAction(exam.id, selectedAnswers, finalScore);
            if (!result.success) {
                toast.error("Failed to save result: " + result.error);
            }
        }

        setIsSubmitting(false);
        toast.success(`Exam completed! Score: ${finalScore}/100`);
    };

    const reset = () => {
        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setScore(null);
    };

    const question = exam.questions[currentQuestion];
    const progressPercentage = ((currentQuestion + 1) / exam.questions.length) * 100;

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) setTimeout(reset, 500);
        }}>
            <DialogContent className="sm:max-w-[500px]">
                {score === null ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>{exam.title}</DialogTitle>
                            <DialogDescription>
                                Question {currentQuestion + 1} of {exam.questions.length} (10 points each)
                            </DialogDescription>
                            <div className="w-full bg-secondary h-2 mt-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </DialogHeader>

                        <div className="py-6 space-y-4">
                            <p className="text-lg font-medium leading-tight">{question.questionText}</p>
                            <RadioGroup
                                value={selectedAnswers[currentQuestion]}
                                onValueChange={(val) => {
                                    const newAnswers = [...selectedAnswers];
                                    newAnswers[currentQuestion] = val;
                                    setSelectedAnswers(newAnswers);
                                }}
                            >
                                {question.options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors">
                                        <RadioGroupItem value={opt} id={`opt-${idx}`} />
                                        <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <DialogFooter>
                            <Button
                                onClick={handleNext}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={!selectedAnswers[currentQuestion] || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                    currentQuestion === exam.questions.length - 1 ? "Finish Exam" : "Next Question"
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="py-8 flex flex-col items-center text-center space-y-4">
                        <div className="p-4 bg-yellow-100 rounded-full">
                            <Trophy className="h-12 w-12 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold">Great Job!</h2>
                        <p className="text-muted-foreground text-sm">You have completed the exam for this milestone.</p>
                        <div className="text-5xl font-extrabold text-blue-600">{score}/100</div>
                        <p className="text-xs text-muted-foreground">Your results have been stored securely in your profile.</p>
                        <Button onClick={() => onOpenChange(false)} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">Close Results</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
