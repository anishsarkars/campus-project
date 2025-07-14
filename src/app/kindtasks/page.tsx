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
import { BookOpen, Code, Palette, FileText, Clock, Award, CheckCircle, XCircle, Send, MessageSquare } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
// REMOVE: import { createTask, getTasks } from "@/lib/firebase-utils";
// REMOVE: import { useAuth } from "@/contexts/auth-context";
import { geminiChat } from "@/lib/gemini";

// Mock data for demonstration
const initialMockTasks = [
  {
    id: "1",
    instructorId: "instructor1",
    instructorName: "Dr. Smith",
    title: "Reverse String Function",
    type: "code" as const,
    description: "Write a function that reverses a string without using built-in reverse methods.",
    spec: "Create a function called 'reverseString' that takes a string parameter and returns the reversed string.",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
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
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    points: 15,
    quizQuestions: [
      {
        question: "What is Ohm's Law?",
        options: [
          "V = IR",
          "P = VI",
          "I = V/R",
          "R = V/I"
        ],
        correctAnswer: 0
      },
      {
        question: "Which law states that the sum of currents entering a node equals the sum of currents leaving it?",
        options: [
          "Ohm's Law",
          "Kirchhoff's Current Law",
          "Kirchhoff's Voltage Law",
          "Power Law"
        ],
        correctAnswer: 1
      }
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
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    points: 20
  }
];

const TASK_DURATIONS: Record<string, number> = {
  code: 600, // 10 min
  quiz: 300, // 5 min
  design: 420, // 7 min
  default: 300,
};

const START_SOUND = "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3";
const COUNTDOWN_SOUND = "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b7bfa.mp3";
const PASS_SOUND = "https://cdn.pixabay.com/audio/2022/10/16/audio_12b6c1e7b7.mp3";
const FAIL_SOUND = "https://cdn.pixabay.com/audio/2022/10/16/audio_12b6c1e7b7.mp3";

export default function KindTasksPage() {
  const [activeTab, setActiveTab] = useState("student");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [tasks, setTasks] = useState<any[]>(initialMockTasks);

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: "user"|"ai", text: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 50);
    try {
      const aiResp = await geminiChat(userMsg);
      setChatMessages((prev) => [...prev, { role: "ai", text: aiResp }]);
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 50);
    } catch {
      setChatMessages((prev) => [...prev, { role: "ai", text: "Sorry, I couldn't process your request right now." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Reset selectedTask and inputs when switching tabs
  useEffect(() => {
    setSelectedTask(null);
    setCodeInput("");
    setQuizAnswers([]);
  }, [activeTab]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Code className="h-4 w-4 text-blue-500" />;
      case "design":
        return <Palette className="h-4 w-4 text-purple-500" />;
      case "quiz":
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "code":
        return "Code Challenge";
      case "design":
        return "Design Task";
      case "quiz":
        return "Quiz";
      default:
        return type;
    }
  };

  const handleSubmit = (taskId: string) => {
    // Mock submission logic
    console.log("Submitting task:", taskId);
    if (selectedTask?.type === "code") {
      console.log("Code submitted:", codeInput);
    } else if (selectedTask?.type === "quiz") {
      console.log("Quiz answers:", quizAnswers);
    }
  };

  const StudentView = () => (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
            setSelectedTask(task);
            setCodeInput("");
            setQuizAnswers([]);
          }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(task.type)}
                  <Badge variant="secondary">{getTypeLabel(task.type)}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {task.points} pts
                </span>
              </div>
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {task.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{task.instructorName}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Due: {isClient ? new Date(task.dueDate).toLocaleDateString() : ''}</span>
                </div>
                <Button className="w-full" size="sm" onClick={() => {
                  setSelectedTask(task);
                  setCodeInput("");
                  setQuizAnswers([]);
                }}>
                  Start Task
                </Button>
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
    const [aiTopic, setAiTopic] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const handleAiGenerate = () => {
      setAiLoading(true);
      setAiResult(null);
      setTimeout(() => {
        if (taskType === "quiz") {
          setAiResult({
            questions: [
              {
                question: `What is the main concept of ${aiTopic}?`,
                options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                correctAnswer: 0,
              },
              {
                question: `How does ${aiTopic} apply in real life?`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctAnswer: 1,
              },
            ],
          });
        } else if (taskType === "code") {
          setAiResult({
            challenge: `Write a function to solve a problem related to ${aiTopic}.`,
            sampleLink: "https://www.geeksforgeeks.org/problems/second-largest3735/1?page=1&sortBy=submissions",
          });
        }
        setAiLoading(false);
      }, 1800);
    };

    const handleCreateTask = () => {
      setCreateLoading(true);
      setCreateError(null);
      try {
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
          testCases: taskType === "code" && aiResult?.challenge ? [{ input: "sample", expectedOutput: "output", description: aiResult.challenge }] : undefined,
          quizQuestions: taskType === "quiz" && aiResult?.questions ? aiResult.questions : undefined,
        };
        setTasks((prev) => [newTask, ...prev]);
        setIsCreateDialogOpen(false);
        setTaskTitle("");
        setTaskDescription("");
        setTaskSpec("");
        setTaskPoints(10);
        setTaskDueDate("");
        setAiTopic("");
        setAiResult(null);
      } catch (err) {
        setCreateError("Failed to create task");
      } finally {
        setCreateLoading(false);
      }
    };

    // Ensure clicking a task opens detail view
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Task Dashboard</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <BookOpen className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Create a new assignment for your students
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="taskType">Task Type</Label>
                    <select
                      id="taskType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={taskType}
                      onChange={e => setTaskType(e.target.value)}
                    >
                    <option value="code">Code Challenge</option>
                    <option value="design">Design Task</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taskTitle">Title</Label>
                    <Input id="taskTitle" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="e.g., Reverse String Function" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taskDescription">Description</Label>
                    <Textarea id="taskDescription" value={taskDescription} onChange={e => setTaskDescription(e.target.value)} placeholder="Describe the task..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taskSpec">Specification</Label>
                    <Textarea id="taskSpec" value={taskSpec} onChange={e => setTaskSpec(e.target.value)} placeholder="Detailed requirements..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="taskPoints">Points</Label>
                      <Input id="taskPoints" type="number" value={taskPoints} onChange={e => setTaskPoints(Number(e.target.value))} placeholder="10" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taskDueDate">Due Date</Label>
                      <Input id="taskDueDate" type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
                    </div>
                  </div>
                  {/* AI Gemini Section */}
                  {(taskType === "quiz" || taskType === "code") && (
                    <div className="grid gap-2 mt-2 p-2 border rounded">
                      <Label htmlFor="aiTopic">Generate with AI (Gemini)</Label>
                      <Input id="aiTopic" value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder={`Enter topic for ${taskType}`} />
                      <Button onClick={handleAiGenerate} disabled={aiLoading || !aiTopic} className="mt-2">
                        {aiLoading ? (
                          <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full"></span>
                        ) : null}
                        Generate with AI
                      </Button>
                      {aiLoading && (
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="inline-block w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></span>
                          <span className="text-sm text-muted-foreground">Generating with Gemini...</span>
                        </div>
                      )}
                      {aiResult && taskType === "quiz" && (
                        <div className="mt-2 bg-muted p-2 rounded">
                          <div className="font-semibold mb-1">Generated Quiz Questions:</div>
                          {aiResult.questions.map((q: any, i: number) => (
                            <div key={i} className="mb-2">
                              <div className="font-medium">{i+1}. {q.question}</div>
                              <ul className="list-disc ml-6">
                                {q.options.map((opt: string, j: number) => (
                                  <li key={j}>{opt}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                      {aiResult && taskType === "code" && (
                        <div className="mt-2 bg-muted p-2 rounded">
                          <div className="font-semibold mb-1">Generated Coding Challenge:</div>
                          <div>{aiResult.challenge}</div>
                          <a href={aiResult.sampleLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm block mt-1">Sample Link</a>
                        </div>
                      )}
                    </div>
                  )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} disabled={createLoading}>
                  {createLoading ? (
                    <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full"></span>
                  ) : null}
                  Create Task
                </Button>
              </div>
              {createError && <div className="text-red-500 text-sm mt-2">{createError}</div>}
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
              setSelectedTask(task);
              setCodeInput("");
              setQuizAnswers([]);
            }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(task.type)}
                    <Badge variant="secondary">{getTypeLabel(task.type)}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {task.points} pts
                  </span>
                </div>
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {task.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Submissions:</span>
                    <span className="font-medium">12/25</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Passed:</span>
                    <span className="font-medium text-green-600">8</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Average:</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Button className="w-full" size="sm" variant="outline" onClick={() => {
                    setSelectedTask(task);
                    setCodeInput("");
                    setQuizAnswers([]);
                  }}>
                    View Details
                  </Button>
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

    // Timer state
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TASK_DURATIONS[selectedTask.type] || TASK_DURATIONS.default);
    const [showResult, setShowResult] = useState<null | "pass" | "fail">(null);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioStartRef = useRef<HTMLAudioElement | null>(null);
    const audioCountdownRef = useRef<HTMLAudioElement | null>(null);
    const audioPassRef = useRef<HTMLAudioElement | null>(null);
    const audioFailRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
      if (!started) return;
      if (timeLeft <= 0) {
        setShowResult("fail");
        setStarted(false);
        audioFailRef.current?.play();
        return;
      }
      timerRef.current = setTimeout(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
      if ([3,2,1].includes(timeLeft)) {
        audioCountdownRef.current?.play();
      }
      return () => clearTimeout(timerRef.current!);
    }, [started, timeLeft]);

    const handleStart = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStarted(true);
        setTimeLeft(TASK_DURATIONS[selectedTask.type] || TASK_DURATIONS.default);
        setShowResult(null);
        audioStartRef.current?.play();
      }, 1200);
    };

    const handleSubmitWithTimer = () => {
      if (timeLeft > 0) {
        setShowResult("pass");
        setStarted(false);
        audioPassRef.current?.play();
      } else {
        setShowResult("fail");
        setStarted(false);
        audioFailRef.current?.play();
      }
    };

    return (
      <div className="space-y-6">
        <audio ref={audioStartRef} src={START_SOUND} preload="auto" />
        <audio ref={audioCountdownRef} src={COUNTDOWN_SOUND} preload="auto" />
        <audio ref={audioPassRef} src={PASS_SOUND} preload="auto" />
        <audio ref={audioFailRef} src={FAIL_SOUND} preload="auto" />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedTask.title}</h2>
            <p className="text-muted-foreground">{selectedTask.description}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedTask(null)}>
            Back to Tasks
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Specification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Requirements:</h4>
                <p className="text-sm text-muted-foreground">{selectedTask.spec}</p>
              </div>
              {selectedTask.type === "code" && (
                <div className="mb-2">
                  <a
                    href="https://www.geeksforgeeks.org/problems/second-largest3735/1?page=1&sortBy=submissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View Sample Coding Challenge
                  </a>
                </div>
              )}
              {selectedTask.type === "code" && selectedTask.testCases && (
                <div>
                  <h4 className="font-semibold mb-2">Test Cases:</h4>
                  <div className="space-y-2">
                    {selectedTask.testCases.map((testCase: any, index: number) => (
                      <div key={index} className="text-sm bg-muted p-2 rounded">
                        <div><strong>Input:</strong> {testCase.input}</div>
                        <div><strong>Expected:</strong> {testCase.expectedOutput}</div>
                        <div><strong>Description:</strong> {testCase.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedTask.type === "quiz" && selectedTask.quizQuestions && (
                <div>
                  <h4 className="font-semibold mb-2">Questions:</h4>
                  <div className="space-y-4">
                    {selectedTask.quizQuestions.map((question: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <p className="font-medium">{index + 1}. {question.question}</p>
                        <div className="space-y-1">
                          {question.options.map((option: string, optionIndex: number) => (
                            <label key={optionIndex} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`question-${index}`}
                                value={optionIndex}
                                onChange={(e) => {
                                  const newAnswers = [...quizAnswers];
                                  newAnswers[index] = parseInt(e.target.value);
                                  setQuizAnswers(newAnswers);
                                }}
                                className="rounded"
                                disabled={!started || showResult !== null}
                              />
                              <span className="text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedTask.type === "code" && (
                <div>
                  <h4 className="font-semibold mb-2">Your Code:</h4>
                  <Textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Write your code here..."
                    className="font-mono"
                    rows={10}
                    disabled={!started || showResult !== null}
                  />
                </div>
              )}
              {/* Demo content for other types */}
              {selectedTask.type !== "code" && selectedTask.type !== "quiz" && (
                <div className="p-4 bg-muted rounded text-center text-sm text-muted-foreground">
                  Demo content for this task type.
                </div>
              )}
              {/* Timer and controls */}
              <div className="flex items-center space-x-4 mt-4">
                {started && (
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg">{Math.floor(timeLeft/60).toString().padStart(2,"0")}:{(timeLeft%60).toString().padStart(2,"0")}</span>
                    <span className="text-xs text-muted-foreground">Time Left</span>
                  </div>
                )}
                {!started && !showResult && (
                  <Button onClick={handleStart} disabled={loading}>
                    {loading ? (
                      <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full"></span>
                    ) : null}
                    Start Task
                  </Button>
                )}
                {started && (
                  <Button onClick={handleSubmitWithTimer}>
                  Submit Task
                </Button>
                )}
              </div>
              {/* Pass/Fail Animation */}
              {showResult === "pass" && (
                <div className="flex items-center space-x-2 mt-4">
                  <CheckCircle className="text-green-500 animate-bounce" size={32} />
                  <span className="text-green-600 font-bold text-lg animate-pulse">Pass!</span>
                </div>
              )}
              {showResult === "fail" && (
                <div className="flex items-center space-x-2 mt-4">
                  <XCircle className="text-red-500 animate-bounce" size={32} />
                  <span className="text-red-600 font-bold text-lg animate-pulse">Fail, try again</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const kindTasksIntro = `Assignments, quizzes, and coding challenges.\nStart, solve, and get instant feedback.\nKindTasks makes learning practical.`;

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">KindTasks</h1>
      </div>

      {selectedTask ? (
        <TaskDetail />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student View</TabsTrigger>
            <TabsTrigger value="instructor">Instructor View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="student" className="mt-6">
            <StudentView />
          </TabsContent>
          
          <TabsContent value="instructor" className="mt-6">
            <InstructorView />
          </TabsContent>
        </Tabs>
      )}
      {/* Place the animated intro at the bottom in smaller, lighter text */}
      <div className="mt-12 text-center">
        <span className="text-sm text-muted-foreground">
          <TextGenerateEffect words={kindTasksIntro} />
        </span>
      </div>
      {/* Minimal floating chatbot (slide-up, not modal) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat box */}
        <div
          className={`transition-all duration-300 ${chatOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'} w-80 max-w-[90vw] mb-2`}
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
        >
          <div className="bg-background rounded-xl border flex flex-col h-80">
            <div className="flex items-center justify-between px-4 py-2 border-b text-xs font-semibold text-primary bg-muted rounded-t-xl">
              AI Chatbot
              <button
                className="text-muted-foreground hover:text-primary transition p-1"
                onClick={() => setChatOpen(false)}
                aria-label="Minimize chat"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div ref={chatBoxRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm">
              {chatMessages.length === 0 && (
                <div className="text-muted-foreground text-xs text-center mt-8">Ask me anything about assignments, quizzes, coding, or campus life!</div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                  <span className={msg.role === "user" ? "inline-block bg-primary text-primary-foreground rounded-lg px-2 py-1" : "inline-block bg-muted text-foreground rounded-lg px-2 py-1"}>
                    {msg.text}
                  </span>
                </div>
              ))}
              {chatLoading && (
                <div className="text-left text-muted-foreground animate-pulse">AI is typing...</div>
              )}
            </div>
            <form
              className="flex items-center border-t px-2 py-1 gap-2"
              onSubmit={e => { e.preventDefault(); handleSendChat(); }}
            >
              <input
                className="flex-1 bg-transparent outline-none text-sm px-2 py-1"
                type="text"
                placeholder="Ask anything"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                disabled={chatLoading}
              />
              <button
                type="submit"
                className="p-1 rounded-full hover:bg-primary/10 transition"
                disabled={chatLoading || !chatInput.trim()}
                aria-label="Send"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="text-[10px] text-muted-foreground text-center pb-1 pt-0.5">AI can make mistakes. Please double-check responses.</div>
          </div>
        </div>
        {/* Floating chat button */}
        {!chatOpen && (
          <button
            className="bg-primary text-primary-foreground rounded-full shadow-lg w-12 h-12 flex items-center justify-center hover:scale-105 transition"
            aria-label="Open AI Chatbot"
            onClick={() => setChatOpen(true)}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
} 