"use client";

import { Quiz, QuizSchema, QuizSchemaType } from "@/types";
import {
  Control,
  Controller,
  Path,
  SubmitHandler,
  UseFormRegister,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createQuiz } from "@/data/actions";
import PhotoModal from "./PhotoModal";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

type QuizFormProps = {
  categories: {name: string}[]
};

export default function QuizForm({categories}: QuizFormProps) {
  const { toast } = useToast()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<Quiz>({
    resolver: zodResolver(QuizSchema),
  });

  const {replace} = useRouter()

  const onSubmit: SubmitHandler<Quiz> = async (data) => { 
    const res = await createQuiz(data as any as QuizSchemaType)

    toast({
      title: res.message,
      variant: res.error ? 'destructive' : 'default',      
    })
    
    replace('/')
  };

  const {
    append,
    fields: elements,
    remove,
  } = useFieldArray({
    name: "content",
    control,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <FormInput
        label="Title"
        register={register}
        value="title"
        errorMessage={errors.title?.message}
      />
      <FormTextarea
        label="Description"
        register={register}
        value="description"
        errorMessage={errors.description?.message}
        />
      <FormInput
        label="Time (seconds)"
        register={register}
        value="time"
        errorMessage={errors.time?.message}
        />
        <div className="grid">
      <PhotoModal onSelectPhoto={setValue} />
      <FormInput
        label="Image"
        register={register}
        value="imageUrl"
        errorMessage={errors.imageUrl?.message}
        isHidden={true}
        />
        </div>
      <CategorySelect categories={categories} control={control} />
      <h2 className="text-3xl font-bold text-center">Questions and answers</h2>
      <FormErrorElement errorMessage={errors.content?.message} />
      <div className="grid gap-5">
        {elements.map((el, number) => {
          const answers: React.ReactElement[] = [];
          for (let i = 0; i < 4; i++)
            answers.push(
          <FormInput
          key={i}
          label={`Answer ${i+1}`}
          register={register}
          value={`content.${number}.answers.${i}`}
          errorMessage={errors.content?.[number]?.answers?.[i]?.message}
          />
        );
        
        return (
          <div className="grid gap-5 border-2 rounded-sm p-5" key={el.id}>
              <FormInput
                label="Question"
                register={register}
                value={`content.${number}.question`}
                errorMessage={errors.content?.[number]?.question?.message}
                />
              {answers}
              <FormInput
                label="Correct answer"
                register={register}
                value={`content.${number}.correctAnswer`}
                errorMessage={errors.content?.[number]?.correctAnswer?.message}
              />
              <FormInput
                label="Points"
                register={register}
                value={`content.${number}.points`}
                errorMessage={errors.content?.[number]?.points?.message}
              />
              <Button
                onClick={() => {
                  remove(number);
                }}
                type="button"
                >
                Remove section
              </Button>
            </div>
          );
        })}
        <Button
          type="button"
          onClick={() =>
            append({
              question: "",
              correctAnswer: "",
              answers: ["", "", "", ""],
              points: "",
            })
          }
          >
          Create section
        </Button>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}

type FormInputProps = {
  label: string;
  register: UseFormRegister<Quiz>;
  value: Path<Quiz>;
  errorMessage?: string;
  isHidden?: boolean
};

function FormInput({ label, register, value, errorMessage, isHidden }: FormInputProps) {
  const labelId = value.split(".").join("");
  return (
    <div className="w-full">
      <Label className={cn({"hidden": isHidden})} htmlFor={labelId}>{label}</Label>
      <Input className={cn({"hidden": isHidden})} id={labelId} {...register(value)} />
      <FormErrorElement errorMessage={errorMessage} />
    </div>
  );
}

type FormTextareaProps = {
  label: string;
  register: UseFormRegister<Quiz>;
  value: Path<Quiz>;
  errorMessage?: string;
};

function FormTextarea({
  label,
  register,
  value,
  errorMessage,
}: FormTextareaProps) {
  const labelId = value.split(".").join("");
  return (
    <div>
      <Label htmlFor={labelId}>{label}</Label>
      <Textarea id={labelId} {...register(value)} />
      <FormErrorElement errorMessage={errorMessage} />
    </div>
  );
}

type FormErrorElementProps = {
  errorMessage?: string;
};

function FormErrorElement({ errorMessage }: FormErrorElementProps) {
  return errorMessage ? (
    <p className="text-red-600 text-sm">{errorMessage}</p>
  ) : null;
}

type CategorySelectProps = {
  control: Control<Quiz, any>;
  categories: {name: string}[]
};

function CategorySelect({ control, categories }: CategorySelectProps) {
  return (
    <div>
      <Label htmlFor="category">Category</Label>
      <Controller
        control={control}
        name="category"
        render={({ field, formState: {errors} }) => (
          <>
          <Select onValueChange={field.onChange} {...field}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(({name: category}) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormErrorElement errorMessage={errors.category?.message} />
          </>
        )}
      />
    </div>
  );
}
