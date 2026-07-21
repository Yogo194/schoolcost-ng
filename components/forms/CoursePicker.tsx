"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SubmitCourseOption } from "@/lib/mock/courses";

const CUSTOM_VALUE = "__custom__";

interface CoursePickerProps {
  institutionId: string;
  courses: SubmitCourseOption[];
  courseId: string;
  courseName: string;
  error?: string;
  onChange: (next: { courseId: string; courseName: string }) => void;
}

export function CoursePicker({
  institutionId,
  courses,
  courseId,
  courseName,
  error,
  onChange,
}: CoursePickerProps) {
  const schoolCourses = courses.filter(
    (course) => course.institution_id === institutionId
  );
  const hasListedCourses = schoolCourses.length > 0;
  const schoolSelected = Boolean(institutionId);

  const matchedListed = schoolCourses.find((course) => course.id === courseId);
  const [customMode, setCustomMode] = useState(
    schoolSelected && (!hasListedCourses || (!matchedListed && Boolean(courseName)))
  );

  // Reset mode when the school changes.
  useEffect(() => {
    if (!schoolSelected) {
      setCustomMode(false);
      return;
    }
    if (!hasListedCourses) {
      setCustomMode(true);
      return;
    }
    const stillListed = schoolCourses.some((course) => course.id === courseId);
    setCustomMode(!stillListed && Boolean(courseName));
    // Only react to school / catalog changes, not every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionId, hasListedCourses]);

  if (!schoolSelected) {
    return (
      <div className="space-y-1.5">
        <Label>Course</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select a school first" />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  if (!hasListedCourses || customMode) {
    return (
      <div className="space-y-1.5">
        <Label>Course</Label>
        <Input
          value={courseName}
          onChange={(event) =>
            onChange({ courseId: "", courseName: event.target.value })
          }
          placeholder="e.g. Computer Science"
          autoFocus={hasListedCourses}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <p className="text-xs text-brand-ink/50">
          {hasListedCourses ? (
            <>
              Typing a new course name.{" "}
              <button
                type="button"
                className="font-medium text-[#c8792a] underline underline-offset-2 hover:text-[#a86520]"
                onClick={() => {
                  setCustomMode(false);
                  onChange({ courseId: "", courseName: "" });
                }}
              >
                Pick from the list instead.
              </button>
            </>
          ) : (
            "We do not have courses for this school yet. Type the course name and we will review it."
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label>Course</Label>
      <Select
        value={courseId || undefined}
        onValueChange={(value) => {
          if (!value) return;
          if (value === CUSTOM_VALUE) {
            setCustomMode(true);
            onChange({ courseId: "", courseName: "" });
            return;
          }
          const selected = schoolCourses.find((course) => course.id === value);
          if (!selected) return;
          onChange({ courseId: selected.id, courseName: selected.name });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a course">
            {(value) =>
              schoolCourses.find((course) => course.id === value)?.name ??
              "Select a course"
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {schoolCourses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.name}
            </SelectItem>
          ))}
          <SelectItem value={CUSTOM_VALUE}>Course not listed…</SelectItem>
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-brand-ink/50">
        Course not listed?{" "}
        <button
          type="button"
          className="font-medium text-[#c8792a] underline underline-offset-2 hover:text-[#a86520]"
          onClick={() => {
            setCustomMode(true);
            onChange({ courseId: "", courseName: "" });
          }}
        >
          Add it here.
        </button>
      </p>
    </div>
  );
}
