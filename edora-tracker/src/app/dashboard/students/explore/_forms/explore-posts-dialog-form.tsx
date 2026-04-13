"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { PlusIcon, UploadIcon, XIcon, Loader2 } from "lucide-react";

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
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { createExplorePost } from "@/app/actions/explore-actions";
import { Badge } from "@/components/ui/badge";

export const ExplorePostsDialogForm = ({
  children,
  onPostCreated,
}: {
  children?: React.ReactNode;
  onPostCreated?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, "");
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleReset = () => {
    setContent("");
    setFiles([]);
    setTags([]);
    setTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Please write something before posting");
      return;
    }

    setLoading(true);
    try {
      const result = await createExplorePost({
        content: content.trim(),
        tags,
      });

      if (result.success) {
        toast.success("Post shared with the community!");
        handleReset();
        setOpen(false);
        onPostCreated?.();
      } else {
        toast.error(result.error || "Failed to create post");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <PlusIcon />
            <span>Create New Post</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex flex-col p-0 gap-0 sm:max-w-xl w-full sm:max-h-[80vh] overflow-hidden">
        <DialogHeader className="border-b px-4 py-4">
          <div className="space-y-1">
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Share your thoughts, projects, or questions with the community!
            </DialogDescription>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <form id="explore-post-form" onSubmit={handleSubmit} className="px-4 py-4">
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="post-content">
                      What&apos;s on your mind?
                    </FieldLabel>
                    <Textarea
                      id="post-content"
                      placeholder="Share an insight, experience, or question with the community..."
                      required
                      rows={5}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">
                      {content.length} characters
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Tags (optional)</FieldLabel>
                    <div className="space-y-2">
                      <Input
                        placeholder="Add a tag and press Enter (e.g., Career, React, AI)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        disabled={tags.length >= 5}
                      />
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="gap-1 cursor-pointer"
                              onClick={() => removeTag(tag)}
                            >
                              #{tag}
                              <XIcon className="size-3" />
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Press Enter or comma to add a tag (max 5)
                      </p>
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel>Image/Media (optional)</FieldLabel>
                    <FileUpload
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024}
                      className="w-full"
                      value={files}
                      onValueChange={setFiles}
                      onFileReject={onFileReject}
                    >
                      <FileUploadDropzone>
                        <div className="flex flex-col items-center gap-1 text-center">
                          <div className="flex items-center justify-center rounded-full border p-2.5">
                            <UploadIcon className="size-6 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-sm">
                            Drag &amp; drop file here
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Or click to browse (max 1 file, up to 5MB)
                          </p>
                        </div>
                        <FileUploadTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-fit"
                          >
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
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                              >
                                <XIcon />
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    </FileUpload>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </ScrollArea>

        <DialogFooter className="border-t px-4 py-4">
          <Button
            variant="outline"
            type="button"
            size="lg"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>

          <Button
            type="submit"
            form="explore-post-form"
            size="lg"
            disabled={loading || !content.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Sharing...
              </>
            ) : (
              "Share Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
