"use client";

import { ContentContainer } from "@/components/ContentContainer";
import ExtraInformation from "@/components/ExtraInformation";
import H1 from "@/components/H1";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { checkAnswers } from "@/data/actions";
import { cn } from "@/lib/utils";
import { Folders, Hourglass, LucideProps, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type QuizProps = {
  content: {
    question: string;
    answers: string[];
    points: number;
    id: number;
  }[];
  title: string;
  time: number;
  description: string;
  categoryName: string;
  user: string,
};

export default function Quiz({
  categoryName,
  content,
  description,
  time,
  title,
  user
}: QuizProps) {
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState(0);
  const [isResult, setIsResult] = useState(false);

  const handleGetResult = (value: number) => {
    setResult(value)
    setIsResult(true)
  }

  const maxPoints = content.reduce((acc, val) => acc + val.points, 0)
  return (
    <ContentContainer className="items-center">
      {!isActive && !isResult && (
        <InitialSection
          onStart={setIsActive}
          numberOfQuestions={content.length}
          category={categoryName}
          description={description}
          title={title}
          time={time}
        />
      )}
      {!!isActive && (
        <MainQuizSection content={content} onCheckSuccessfully={setIsActive} onResult={handleGetResult} time={time} />
      )}
      {!isActive && isResult && <ResultSection points={result} maxPoints={maxPoints} category={categoryName} user={user} />}
    </ContentContainer>
  );
}

type InitialSectionProps = {
  onStart: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  category: string;
  time: number;
  numberOfQuestions: number;
};

function InitialSection({
  onStart,
  category,
  description,
  numberOfQuestions,
  time,
  title,
}: InitialSectionProps) {
  const seconds = time % 60;
  const minutes = Math.floor(time / 60);
  const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  return (
    <>
      <H1>{title}</H1>
      <ExtraInformation>{description}</ExtraInformation>
      <Information text={formattedTime} Icon={Hourglass} />
      <Information text={category} Icon={Folders} />
      <Information
        text={`${numberOfQuestions} question${
          numberOfQuestions === 1 ? "" : "s"
        }`}
        Icon={MousePointer2}
      />
      <Button onClick={() => onStart(true)}>Start</Button>
    </>
  );
}

type InformationProps = {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
};

function Information({ text, Icon }: InformationProps) {
  return (
    <div className="flex gap-2 items-end">
      <Icon />
      <p>{text}</p>
    </div>
  );
}

type MainQuizSectionProps = {
  onCheckSuccessfully: Dispatch<SetStateAction<boolean>>;
  onResult: (value: number) => void;
  content: {
    question: string;
    answers: string[];
    points: number;
    id: number;
  }[];
  time: number;
};

function MainQuizSection({ onCheckSuccessfully, onResult, content, time }: MainQuizSectionProps) {
  const {toast} = useToast()
  const [index, setIndex] = useState(0);
  const path = usePathname()
  const quizId = Number(path.split('/').at(-1))

  const [userAnswers, setUserAnswers] = useState(() => {
    return content.map(({ id }) => ({ answer: -1, id }));
  });

  const { answers, question } = content[index];

  const isLastQuestion = content.length - 1 === index;

  const handleSelectAnswer = (answer: number, index: number) => {
    setUserAnswers((prevAnswers) => {
      const curAnswers = [...prevAnswers];
      curAnswers[index].answer = answer;
      return curAnswers;
    });
  };

  return (
    <>
      <div className="w-full flex justify-between text-lg">
        <Timer time={time} />
        <p>
          {index + 1}/{content.length}
        </p>
      </div>
      <H1>{question}</H1>
      <div className="grid gap-2 w-full">
        {answers.map((answer, i) => (
          <Button
            className={cn("hover:bg-emerald-500", {
              "bg-emerald-500": (i + 1) === userAnswers[index].answer,
            })}
            onClick={() => handleSelectAnswer(i+1, index)}
            key={answer}
          >
            {answer}
          </Button>
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        <Button
          disabled={index === 0}
          onClick={() => setIndex((index) => index - 1)}
        >
          Previous question
        </Button>
        {!isLastQuestion && (
          <Button onClick={() => setIndex((index) => index + 1)}>
            Next question
          </Button>
        )}
        {isLastQuestion && <Button onClick={async () => {
          const {error, message} = await checkAnswers(quizId, userAnswers)
          if (!error)
          {
            onResult(Number(message))
            onCheckSuccessfully(false)
          }
          else 
          {
            toast({
              variant: 'destructive',
              title: message
            })
          }
        }}>Check result</Button>}
      </div>
    </>
  );
}

type ResultsSectionProps = {
  points: number,
  maxPoints: number,
  category: string,
  user: string,
}

function ResultSection({points, maxPoints, category, user}: ResultsSectionProps) {
  return (
    <>
      <H1>Gratulacje!!!</H1>
      <p className="text-5xl font-bold uppercase">Twój wynik to:</p>
      <p>{points}/{maxPoints} POINTS ({Math.floor(points * 100 / maxPoints)}%)</p>
      <Link href={`/users/${user}`} className={buttonVariants()}>Zobacz inne quizy tego autora</Link>
      <Link href={`/category/${category}`} className={buttonVariants()}>Zobacz pozostałe quizy</Link>
    </>
  );
}

type TimerProps = {
  time: number,
}

function Timer({time}: TimerProps) {
  const [currentTime, setCurrentTime] = useState(time);

  const seconds = currentTime % 60;
  const minutes = Math.floor(currentTime / 60);
  const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime((cTime) => cTime - 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <p>{formattedTime}</p>;
}
