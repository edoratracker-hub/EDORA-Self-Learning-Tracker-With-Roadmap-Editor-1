"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ImagePlus, X, UploadIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  recruiterOrganizationSchema,
  type RecruiterOrganizationValues,
} from "@/app/lib/validations";
import { createRecruiterOrganization } from "@/app/actions/recruiter-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
  FieldSet,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";

export const RecruiterOrganizationForm = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  const form = useForm<RecruiterOrganizationValues>({
    resolver: zodResolver(recruiterOrganizationSchema as any),
    defaultValues: {
      companyName: "",
      location: "",
      website: "",
      phoneNumber: "",
      companyLogo: "",
    },
  });

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      const file = newFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setValue("companyLogo", base64String);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("companyLogo", "");
    }
  };

  const onSubmit = async (data: RecruiterOrganizationValues) => {
    setLoading(true);
    try {
      const res = await createRecruiterOrganization(data);

      if (res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }

      toast.success("Organization setup successfully!");
      router.push("/recruiter-organization-completed");
    } catch (err) {
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/90">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-center text-xl font-semibold">
          Set up your Organization
        </CardTitle>
        <CardDescription>
          Tell us about your company to start hiring.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                <Input
                  placeholder="Adot Shel Or"
                  {...form.register("companyName")}
                />
                <FieldError>
                  {form.formState.errors.companyName?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  placeholder="New York, NY"
                  {...form.register("location")}
                />
                <FieldError>
                  {form.formState.errors.location?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="website">Website</FieldLabel>
                <Input
                  placeholder="https://adotshelor.com"
                  {...form.register("website")}
                />
                <FieldError>
                  {form.formState.errors.website?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                <Input
                  placeholder="+91 34567890"
                  {...form.register("phoneNumber")}
                />
                <FieldError>
                  {form.formState.errors.phoneNumber?.message}
                </FieldError>
              </Field>
            </FieldSet>

            <Field>
              <FieldLabel>Company Logo</FieldLabel>
              <FileUpload
                maxFiles={1}
                maxSize={5 * 1024 * 1024}
                className="w-full "
                value={files}
                onValueChange={handleFilesChange}
                onFileReject={onFileReject}
              >
                <FileUploadDropzone>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                      <UploadIcon className="size-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">Drag & drop file here</p>
                    <p className="text-muted-foreground text-xs">
                      Or click to browse (max 1 file, up to 5MB)
                    </p>
                  </div>
                  <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                      Browse file
                    </Button>
                  </FileUploadTrigger>
                </FileUploadDropzone>
                <FileUploadList>
                  {files.map((file, index) => (
                    <FileUploadItem key={index} value={file}>
                      <FileUploadItemPreview />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <XIcon />
                        </Button>
                      </FileUploadItemDelete>
                    </FileUploadItem>
                  ))}
                </FileUploadList>
              </FileUpload>
            </Field>

            <Field>
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
