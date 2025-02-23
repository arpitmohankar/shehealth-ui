"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Updated Schema; all fields are strings and optional if not required at an earlier step
const formSchema = z.object({
  // Demographics (required)
  age: z.string().min(1, "Age is required"),
  location: z.string().min(1, "Location is required"),
  ethnicity: z.string().min(1, "Ethnicity is required"),

  // Health Metrics
  bmi: z.string().optional(),
  bloodPressure: z.string().optional(),
  cholesterol: z.string().optional(),
  ldl: z.string().optional(),
  hdl: z.string().optional(),

  // Menstrual Data
  cycleLength: z.string().optional(),
  lastPeriod: z.string().optional(),
  flowIntensity: z.string().optional(),

  // Lifestyle
  diet: z.string().optional(),
  exerciseHabits: z.string().optional(),
  sleepProblem: z.string().optional(),
  stressLevel: z.string().optional(),

  // Health Goals
  healthGoals: z.string().optional(),

  // Medical History
  chronicConditions: z.string().optional(),
  medication: z.string().optional(),
  allergies: z.string().optional(),
});

// Steps with id, title, and description
const steps = [
  { id: "smartwatch", title: "Connect Smart Watch", description: "Connect your device" },
  { id: "demographics", title: "Demographics", description: "Tell us about yourself" },
  { id: "healthMetrics", title: "Health Metrics", description: "Your basic health measurements" },
  { id: "menstrualData", title: "Menstrual Data", description: "Information about your cycle" },
  { id: "lifestyle", title: "Lifestyle", description: "Your daily habits" },
  { id: "healthGoals", title: "Health Goals", description: "What you want to achieve" },
  { id: "medicalHistory", title: "Medical History", description: "Your health background" },
];

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState<string | null>(null);
const [watchStatus, setWatchStatus] = useState<"idle" | "loading" | "connected">("idle");

const watches = [
  { id: "apple-watch", label: "Apple Watch" },
  { id: "samsung-galaxy-watch", label: "Samsung Galaxy Watch" },
  { id: "fitbit-sense", label: "Fitbit Sense" },
  { id: "garmin-venu", label: "Garmin Venu" },
  { id: "amazfit-gts", label: "Amazfit GTS" },
  { id: "huawei-watch", label: "Huawei Watch" },
  { id: "withings-scanwatch", label: "Withings ScanWatch" },
  { id: "other", label: "Other Smart Watch" },
];
const handleWatchConnect = async () => {
  if (!selectedWatch) return;
  setWatchStatus("loading");
  
  try {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setWatchStatus("connected");
    // Move to next step after successful connection
    setStep(step + 1);
  } catch (error) {
    setWatchStatus("idle");
    console.error("Watch connection failed:", error);
  }
};

  // Updated default values – everything starts as an empty string.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      location: "",
      ethnicity: "",
      bmi: "",
      bloodPressure: "",
      cholesterol: "",
      ldl: "",
      hdl: "",
      cycleLength: "",
      lastPeriod: "",
      flowIntensity: "",
      diet: "",
      exerciseHabits: "",
      sleepProblem: "",
      stressLevel: "",
      healthGoals: "",
      chronicConditions: "",
      medication: "",
      allergies: "",
    },
  });

  const progress = ((step + 1) / steps.length) * 100;

  // Render fields based on the current step
  const renderFormFields = () => {
    switch (steps[step].id) {
      case "smartwatch":
      return (
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-sm mb-2">
              Select Your Smart Watch
            </label>
            <Select onValueChange={(value) => setSelectedWatch(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a watch" />
              </SelectTrigger>
              <SelectContent>
                {watches.map((watch) => (
                  <SelectItem key={watch.id} value={watch.id}>
                    {watch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleWatchConnect}
            className="w-full mt-4"
            disabled={!selectedWatch || watchStatus === "loading"}
          >
            {watchStatus === "loading" ? "Connecting..." : "Connect Watch"}
          </Button>
        </div>
      );

      case "demographics":
        return (
          <>
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ethnicity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ethnicity</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="hispanic">Hispanic</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case "healthMetrics":
        return (
          <>
            <FormField
              control={form.control}
              name="bmi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BMI</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bloodPressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Pressure (systolic/diastolic)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 120/80" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cholesterol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Cholesterol (mg/dL)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case "menstrualData":
        return (
          <>
            <FormField
              control={form.control}
              name="cycleLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Cycle Length (days)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Period Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="flowIntensity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flow Intensity</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select flow intensity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case "lifestyle":
        return (
          <>
            <FormField
              control={form.control}
              name="diet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diet Preference</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="nonVegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exerciseHabits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Frequency</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">1-2 times/week</SelectItem>
                        <SelectItem value="moderate">3-4 times/week</SelectItem>
                        <SelectItem value="active">5+ times/week</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sleepProblem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sleep Quality</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sleep quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stressLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stress Level</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stress level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case "healthGoals":
        return (
          <>
            <FormField
              control={form.control}
              name="healthGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Health Goals</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weightManagement">Weight Management</SelectItem>
                        <SelectItem value="periodRegularity">Period Regularity</SelectItem>
                        <SelectItem value="stressReduction">Stress Reduction</SelectItem>
                        <SelectItem value="sleepImprovement">Better Sleep</SelectItem>
                        <SelectItem value="fertility">Fertility Planning</SelectItem>
                        <SelectItem value="overallHealth">Overall Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case "medicalHistory":
        return (
          <>
            <FormField
              control={form.control}
              name="chronicConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chronic Conditions (if any)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="List any chronic conditions" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Medications</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="List current medications" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergies</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="List any allergies" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      default:
        return null;
    }
  };

  // Handle form submission per step
  const handleNext = async () => {
    const isLastStep = step === steps.length - 1;
  
    if (step === 0 && watchStatus !== "connected") {
      // Don't proceed if watch isn't connected
      return;
    }
  
    if (isLastStep) {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/dashboard/dashboard");
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{steps[step].title}</CardTitle>
          <CardDescription>{steps[step].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-4" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderFormFields()}
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 0 || loading}
                >
                  Previous
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Processing..."
                    : step === steps.length - 1
                    ? "Submit"
                    : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
