"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCalendarEvent } from "@/app/actions/calendar-actions";
import { toast } from "sonner";
import { format } from "date-fns";

interface AddEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onEventAdded: () => void;
}

export function AddEventDialog({
  isOpen,
  onClose,
  selectedDate,
  onEventAdded,
}: AddEventDialogProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(format(selectedDate, "yyyy-MM-dd"));
  const [time, setTime] = useState(format(selectedDate, "HH:mm"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDate(format(selectedDate, "yyyy-MM-dd"));
      setTime(format(selectedDate, "HH:mm"));
    }
  }, [isOpen, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    try {
      const [year, month, day] = date.split("-").map(Number);
      const [hours, minutes] = time.split(":").map(Number);
      
      const startTime = new Date(year, month - 1, day, hours, minutes);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration

      const result = await createCalendarEvent({
        title,
        startTime,
        endTime,
      });

      if (result.success) {
        toast.success("Event added successfully");
        setTitle("");
        onEventAdded();
        onClose();
      } else {
        toast.error(result.error || "Failed to add event");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
