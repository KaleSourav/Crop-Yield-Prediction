'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UploadCloud, File as FileIcon, X } from 'lucide-react';
import { getYieldPrediction } from '@/app/actions';
import { PredictYieldOutput } from '@/ai/flows/yield-prediction';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  agriculturalDataFile: z.any().refine((file) => file, 'A data file is required.'),
});

type YieldPredictionFormProps = {
  onResults: (data: PredictYieldOutput | null) => void;
  onLoading: (isLoading: boolean) => void;
  onError: (error: string) => void;
};

const FileUpload = ({ field, setFile, disabled }: { field: any, setFile: (file: File | null) => void, disabled: boolean }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFile(file);
      field.onChange(file.name);
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    setFile(null);
    field.onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-secondary transition-all duration-300 ${!disabled ? 'cursor-pointer hover:border-primary hover:bg-primary/5' : 'cursor-not-allowed opacity-50'}`}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv"
        disabled={disabled}
      />
      {fileName ? (
        <div className="flex flex-col items-center text-center p-4">
          <FileIcon className="h-8 w-8 text-primary" />
          <p className="mt-2 text-sm font-medium truncate max-w-full">{fileName}</p>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">CSV file</p>
        </div>
      )}
    </div>
  );
};

export function YieldPredictionForm({
  onResults,
  onLoading,
  onError,
}: YieldPredictionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agriculturalDataFile: null,
    },
  });

  const readFileAsText = (fileToRead: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(fileToRead);
    });
  }

  const onSubmit = async () => {
    if (!file) {
      form.setError('agriculturalDataFile', { type: 'manual', message: 'Please select a file.' });
      return;
    }

    setIsSubmitting(true);
    onLoading(true);

    try {
      const fileContent = await readFileAsText(file);
      
      const result = await getYieldPrediction({ agriculturalData: fileContent });
      
      if (result.success) {
        onResults(result.success);
      } else {
        onError(result.failure || 'An unknown error occurred.');
        onResults(null);
      }
    } catch (e: any) {
      console.error(e);
      onError('An error occurred during prediction: ' + e.message);
      onResults(null);
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="agriculturalDataFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agricultural Data File</FormLabel>
              <FormControl>
                <FileUpload field={field} setFile={setFile} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting || !file}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Processing...' : 'Predict Yield'}
        </Button>
      </form>
    </Form>
  );
}
