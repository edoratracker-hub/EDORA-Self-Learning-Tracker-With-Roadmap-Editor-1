"use client";
import { defaultEditorContent } from "@/lib/content";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "./ui/separator";

import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

interface EditorProps {
  classroomId?: string | null;
  fileId?: string | null;
  dynamicInitialContent?: JSONContent | null;
}

const TailwindAdvancedEditor = ({ classroomId, fileId, dynamicInitialContent }: EditorProps) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState<number>();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON();
    setCharsCount(editor.storage.characterCount.words());

    // Only write to localStorage for the local sandbox (no classroomId / fileId)
    if (!classroomId && !fileId) {
      const storageKey = "novel-content-local";
      window.localStorage.setItem("html-content-local", highlightCodeblocks(editor.getHTML()));
      window.localStorage.setItem(storageKey, JSON.stringify(json));
      window.localStorage.setItem("markdown-local", editor.storage.markdown.getMarkdown());
    }

    // --> ADDED: Save to Edora Tracker Database <--
    if (classroomId) {
      setSaveStatus("Saving...");
      try {
        await fetch(`http://localhost:3000/api/classroom/external/${classroomId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: json }),
        });
        setSaveStatus("Saved");
      } catch (err) {
        console.error("Failed to save to database", err);
        setSaveStatus("Save Failed");
      }
    } else if (fileId) {
      setSaveStatus("Saving...");
      try {
        await fetch(`http://localhost:3000/api/workspace/file/external/${fileId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: json }),
        });
        setSaveStatus("Saved");
      } catch (err) {
        console.error("Failed to save workspace file", err);
        setSaveStatus("Save Failed");
      }
    } else {
      setSaveStatus("Saved");
    }
  }, 500);

  useEffect(() => {
    if (dynamicInitialContent) {
      // DB content loaded from edora-tracker — use it directly
      setInitialContent(dynamicInitialContent);
    } else if (classroomId || fileId) {
      // We're in a classroom/file context but the document has no saved content yet.
      // Do NOT fall back to localStorage — that would show another document's content.
      setInitialContent(defaultEditorContent);
    } else {
      // Pure local sandbox — use the scoped local key
      const content = window.localStorage.getItem("novel-content-local");
      if (content) setInitialContent(JSON.parse(content));
      else setInitialContent(defaultEditorContent);
    }
  }, [dynamicInitialContent, classroomId, fileId]);

  if (!initialContent) return null;

  return (
    <div className="relative w-full max-w-screen-lg">
      <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
        <div className="bg-accent px-2 py-1 text-sm text-muted-foreground">{saveStatus}</div>
      </div>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative w-full"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;
