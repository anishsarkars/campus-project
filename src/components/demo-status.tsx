"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export function DemoStatus() {
  return (
    <div className="container mx-auto px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">KindCampus Demo Status</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <CardTitle>Completed Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Landing Page</span>
                  <Badge variant="secondary">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Navigation</span>
                  <Badge variant="secondary">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>KindCollab UI</span>
                  <Badge variant="secondary">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>KindTasks UI</span>
                  <Badge variant="secondary">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>TypeScript Types</span>
                  <Badge variant="secondary">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Firebase Utils</span>
                  <Badge variant="secondary">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gemini API Integration</span>
                  <Badge variant="secondary">Complete</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <CardTitle>Next Steps</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Firebase Authentication</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cloud Functions</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Real-time Updates</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Code Editor Integration</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Push Notifications</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Production Deployment</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <CardTitle>Demo Instructions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <p className="mb-4">
                This is a fully functional demo of KindCampus with mock data. You can:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Navigate between Home, KindCollab, and KindTasks pages</li>
                <li>Browse skill-swapping posts in KindCollab</li>
                <li>Filter posts by type (Teaching, Learning, Team Up)</li>
                <li>View task assignments in KindTasks</li>
                <li>Switch between Student and Instructor views</li>
                <li>Interact with the create post/task dialogs</li>
                <li>See the responsive design across different screen sizes</li>
              </ul>
              <p className="mt-4 text-sm">
                <strong>Note:</strong> This demo uses mock data. For full functionality, 
                you would need to set up Firebase and configure the environment variables.
              </p>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 