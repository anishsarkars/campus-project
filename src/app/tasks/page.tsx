"use client"

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Code, Palette, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

// Mock data for standalone feature (no backend module for tasks)
const initialMockTasks = [
  {
    id: "1",
    instructorId: "instructor1",
    instructorName: "Dr. Smith",
    title: "Reverse String Function",
    type: "code" as const,
    description: "Write a function that reverses a string without using built-in reverse methods.",
    spec: "Create a function called 'reverseString' that takes a string parameter and returns the reversed string.",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    points: 10,
    testCases: [
      { input: "hello", expectedOutput: "olleh", description: "Basic string reversal" },
      { input: "", expectedOutput: "", description: "Empty string" },
      { input: "a", expectedOutput: "a", description: "Single character" }
    ]
  },
  {
    id: "2",
    instructorId: "instructor2",
    instructorName: "Prof. Johnson",
    title: "Circuit Laws Quiz",
    type: "quiz" as const,
    description: "Test your knowledge of basic circuit laws including Ohm's Law and Kirchhoff's Laws.",
    spec: "Answer 5 multiple-choice questions about circuit analysis.",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    points: 15,
    quizQuestions: [
      { question: "What is Ohm's Law?", options: ["V = IR", "P = VI", "I = V/R", "R = V/I"], correctAnswer: 0 },
      { question: "Which law states that the sum of currents entering a node equals the sum of currents leaving it?",
        options: ["Ohm's Law", "Kirchhoff's Current Law", "Kirchhoff's Voltage Law", "Power Law"], correctAnswer: 1 }
    ]
  },
  {
    id: "3",
    instructorId: "instructor3",
    instructorName: "Ms. Davis",
    title: "Responsive Website Layout",
    type: "design" as const,
    description: "Create a responsive one-page website layout using HTML and CSS.",
    spec: "Design a modern landing page that adapts to different screen sizes. Include a header, hero section, features, and footer.",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    points: 20
  }
];

const TASK_DURATIONS: Record<string, number> = {
  code: 600, quiz: 300, design: 420, default: 300,
};

export default function TasksPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("student");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [tasks, setTasks] = useState<any[]>(initialMockTasks);

  useEffect(() => { setSelectedTask(null); setCodeInput(""); setQuizAnswers([]); }, [activeTab]);
  useEffect(() => { setIsClient(true); }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "code": return <Code className="h-4 w-4 text-blue-500" />;
      case "design": return <Palette className="h-4 w-4 text-purple-500" />;
      case "quiz": return <FileText className="h-4 w-4 text-green-500" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "code": return "Code Challenge";
      case "design": return "Design Task";
      case "quiz": return "Quiz";
      default: return type;
    }
  };

  const StudentView = () => (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Card key={task.id} className="rounded-2xl border border-border shadow-sm bg-card hover:shadow-md transition-all flex flex-col h-full overflow-hidden cursor-pointer" onClick={() => { setSelectedTask(task); setCodeInput(""); setQuizAnswers([]); }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">{getTypeIcon(task.type)}<Badge variant="secondary">{getTypeLabel(task.type)}</Badge></div>
                <span className="text-sm text-muted-foreground">{task.points} pts</span>
              </div>
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <CardDescription className="line-clamp-2">{task.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground"><BookOpen className="h-4 w-4" /><span>{task.instructorName}</span></div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /><span>Due: {isClient ? new Date(task.dueDate).toLocaleDateString() : ''}</span></div>
                <Button className="w-full" size="sm" onClick={() => { setSelectedTask(task); setCodeInput(""); setQuizAnswers([]); }}>Start Task</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const InstructorView = () => {
    const [taskType, setTaskType] = useState("code");
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskSpec, setTaskSpec] = useState("");
    const [taskPoints, setTaskPoints] = useState(10);
    const [taskDueDate, setTaskDueDate] = useState("");

    const handleCreateTask = () => {
      const newTask = {
        id: (Math.random() * 1000000).toFixed(0),
        instructorId: "demo-instructor",
        instructorName: "Demo Instructor",
        title: taskTitle,
        type: taskType,
        description: taskDescription,
        spec: taskSpec,
        dueDate: taskDueDate,
        points: taskPoints,
      };
      setTasks((prev) => [newTask, ...prev]);
      setIsCreateDialogOpen(false);
      setTaskTitle(""); setTaskDescription(""); setTaskSpec(""); setTaskPoints(10); setTaskDueDate("");
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Task Dashboard</h2></div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <div className="fixed left-1/2 bottom-8 z-50 -translate-x-1/2 flex justify-center w-full pointer-events-none">
              <Button className="pointer-events-auto rounded-full shadow-lg bg-primary text-primary-foreground w-16 h-16 flex items-center justify-center text-3xl" size="icon">
                <BookOpen className="h-8 w-8" />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create New Task</DialogTitle><DialogDescription>Create a new assignment for your students</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="taskType">Task Type</Label>
                <select id="taskType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={taskType} onChange={e => setTaskType(e.target.value)}>
                  <option value="code">Code Challenge</option><option value="design">Design Task</option><option value="quiz">Quiz</option>
                </select>
              </div>
              <div className="grid gap-2"><Label htmlFor="taskTitle">Title</Label><Input id="taskTitle" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="e.g., Reverse String Function" /></div>
              <div className="grid gap-2"><Label htmlFor="taskDescription">Description</Label><Textarea id="taskDescription" value={taskDescription} onChange={e => setTaskDescription(e.target.value)} placeholder="Describe the task..." /></div>
              <div className="grid gap-2"><Label htmlFor="taskSpec">Specification</Label><Textarea id="taskSpec" value={taskSpec} onChange={e => setTaskSpec(e.target.value)} placeholder="Detailed requirements..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label htmlFor="taskPoints">Points</Label><Input id="taskPoints" type="number" value={taskPoints} onChange={e => setTaskPoints(Number(e.target.value))} /></div>
                <div className="grid gap-2"><Label htmlFor="taskDueDate">Due Date</Label><Input id="taskDueDate" type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} /></div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="rounded-2xl border border-border shadow-sm bg-card hover:shadow-md transition-all flex flex-col h-full overflow-hidden cursor-pointer" onClick={() => { setSelectedTask(task); setCodeInput(""); setQuizAnswers([]); }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">{getTypeIcon(task.type)}<Badge variant="secondary">{getTypeLabel(task.type)}</Badge></div>
                  <span className="text-sm text-muted-foreground">{task.points} pts</span>
                </div>
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <CardDescription className="line-clamp-2">{task.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Submissions:</span><span className="font-medium">12/25</span></div>
                  <Button className="w-full" size="sm" variant="outline" onClick={() => { setSelectedTask(task); setCodeInput(""); setQuizAnswers([]); }}>View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const TaskDetail = () => {
    if (!selectedTask) return null;
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TASK_DURATIONS[selectedTask.type] || TASK_DURATIONS.default);
    const [showResult, setShowResult] = useState<null | "pass" | "fail">(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (!started) return;
      if (timeLeft <= 0) { setShowResult("fail"); setStarted(false); return; }
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timerRef.current!);
    }, [started, timeLeft]);

    const handleStart = () => {
      setDetailLoading(true);
      setTimeout(() => { setDetailLoading(false); setStarted(true); setTimeLeft(TASK_DURATIONS[selectedTask.type] || TASK_DURATIONS.default); setShowResult(null); }, 1200);
    };

    const handleSubmitWithTimer = () => {
      if (timeLeft > 0) { setShowResult("pass"); setStarted(false); }
      else { setShowResult("fail"); setStarted(false); }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h2 className="text-2xl font-bold">{selectedTask.title}</h2><p className="text-muted-foreground">{selectedTask.description}</p></div>
          <Button variant="outline" onClick={() => setSelectedTask(null)}>Back to Tasks</Button>
        </div>
        <Card>
          <CardHeader><CardTitle>Task Specification</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div><h4 className="font-semibold mb-2">Requirements:</h4><p className="text-sm text-muted-foreground">{selectedTask.spec}</p></div>
              {selectedTask.type === "code" && selectedTask.testCases && (
                <div>
                  <h4 className="font-semibold mb-2">Test Cases:</h4>
                  <div className="space-y-2">{selectedTask.testCases.map((tc: any, i: number) => (
                    <div key={i} className="text-sm bg-muted p-2 rounded"><div><strong>Input:</strong> {tc.input}</div><div><strong>Expected:</strong> {tc.expectedOutput}</div><div><strong>Description:</strong> {tc.description}</div></div>
                  ))}</div>
                </div>
              )}
              {selectedTask.type === "quiz" && selectedTask.quizQuestions && (
                <div>
                  <h4 className="font-semibold mb-2">Questions:</h4>
                  <div className="space-y-4">{selectedTask.quizQuestions.map((q: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <p className="font-medium">{i + 1}. {q.question}</p>
                      <div className="space-y-1">{q.options.map((opt: string, j: number) => (
                        <label key={j} className="flex items-center space-x-2">
                          <input type="radio" name={`question-${i}`} value={j} onChange={(e) => { const a = [...quizAnswers]; a[i] = parseInt(e.target.value); setQuizAnswers(a); }} className="rounded" disabled={!started || showResult !== null} />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}</div>
                    </div>
                  ))}</div>
                </div>
              )}
              {selectedTask.type === "code" && (
                <div><h4 className="font-semibold mb-2">Your Code:</h4>
                  <Textarea value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder="Write your code here..." className="font-mono" rows={10} disabled={!started || showResult !== null} />
                </div>
              )}
              {selectedTask.type !== "code" && selectedTask.type !== "quiz" && (
                <div className="p-4 bg-muted rounded text-center text-sm text-muted-foreground">Demo content for this task type.</div>
              )}
              <div className="flex items-center space-x-4 mt-4">
                {!isAuthenticated && !authLoading ? (
                  <div className="w-full flex flex-col items-center">
                    <p className="text-sm text-muted-foreground mb-2">Sign in to submit this task.</p>
                    <Link href="/auth"><Button className="w-full max-w-xs" size="sm">Sign in to Submit</Button></Link>
                  </div>
                ) : (
                  <>
                    {started && (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-lg">{Math.floor(timeLeft/60).toString().padStart(2,"0")}:{(timeLeft%60).toString().padStart(2,"0")}</span>
                        <span className="text-xs text-muted-foreground">Time Left</span>
                      </div>
                    )}
                    {!started && !showResult && <Button onClick={handleStart} disabled={detailLoading}>{detailLoading ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full" /> : null}Start Task</Button>}
                    {started && <Button onClick={handleSubmitWithTimer}>Submit Task</Button>}
                  </>
                )}
              </div>
              {showResult === "pass" && <div className="flex items-center space-x-2 mt-4"><CheckCircle className="text-green-500 animate-bounce" size={32} /><span className="text-green-600 font-bold text-lg animate-pulse">Pass!</span></div>}
              {showResult === "fail" && <div className="flex items-center space-x-2 mt-4"><XCircle className="text-red-500 animate-bounce" size={32} /><span className="text-red-600 font-bold text-lg animate-pulse">Fail, try again</span></div>}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const tasksIntro = `Assignments, quizzes, and coding challenges.\nStart, solve, and get instant feedback.\nTasks makes learning practical.`;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 pt-16">
        <div className="mb-12 relative">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">
              <CheckCircle className="h-4 w-4 text-purple-500" /> TASKS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Solve challenges and get feedback.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              Assignments, quizzes, and coding challenges. Start, solve, and get instant feedback.
            </p>
          </div>
        </div>
      {selectedTask ? <TaskDetail /> : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student View</TabsTrigger>
            <TabsTrigger value="instructor">Instructor View</TabsTrigger>
          </TabsList>
          <TabsContent value="student" className="mt-6"><StudentView /></TabsContent>
          <TabsContent value="instructor" className="mt-6"><InstructorView /></TabsContent>
        </Tabs>
      )}
      <div className="mt-12 text-center"><span className="text-sm text-muted-foreground"><TextGenerateEffect words={tasksIntro} /></span></div>
      </div>
    </div>
  );
}