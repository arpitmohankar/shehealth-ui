"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, Heart, Moon, Sun } from "lucide-react";
import { addDays, format, isWithinInterval } from "date-fns";
import SplineClient from "@/components/SplineClient";

// Inject some custom calendar CSS for selected/focused days
const calendarStyles = `
  .rdp-day_selected, 
  .rdp-day_selected:focus-visible, 
  .rdp-day_selected:hover {
    background-color: #d11573 !important;
    color: white !important;
  }
  .rdp-day_today {
    border: 2px solid #d11573 !important;
  }
`;

function calculateCycleDates(lastPeriod: Date, cycleLength: number) {
  const nextPeriod = addDays(new Date(lastPeriod), cycleLength);
  const periodDays = 5; // average period duration
  const fertileStart = addDays(nextPeriod, -14);
  const fertileEnd = addDays(nextPeriod, -10);

  return {
    nextPeriod,
    periodDays,
    fertileStart,
    fertileEnd,
  };
}

function PeriodCalendar({
  lastPeriod,
  cycleLength,
}: {
  lastPeriod: string;
  cycleLength: number;
}) {
  const [date, setDate] = useState<Date>(new Date());
  const { nextPeriod, periodDays, fertileStart, fertileEnd } = calculateCycleDates(
    new Date(lastPeriod),
    cycleLength
  );

  return (
    <Card className="w-full md:w-[400px] shadow-lg">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100">
        <CardTitle className="flex justify-between items-center text-lg">
          <span className="text-pink-700">Menstrual Calendar</span>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-200" />
              Period
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-pink-200" />
              Fertile
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <style>{calendarStyles}</style>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(day) => day && setDate(day)}
          className="rounded-md border shadow-sm"
          modifiers={{
            period: (date) =>
              isWithinInterval(date, {
                start: nextPeriod,
                end: addDays(nextPeriod, periodDays),
              }),
            fertile: (date) =>
              isWithinInterval(date, {
                start: fertileStart,
                end: fertileEnd,
              }),
          }}
          modifiersStyles={{
            period: {
              backgroundColor: "rgba(254, 178, 178, 0.4)",
              color: "#be185d",
              fontWeight: "bold",
            },
            fertile: {
              backgroundColor: "rgba(251, 207, 232, 0.4)",
              color: "#831843",
              fontWeight: "bold",
            },
          }}
        />
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center text-sm bg-pink-50 p-3 rounded-lg">
            <span className="font-medium text-pink-700">Next Period</span>
            <span className="font-bold text-pink-600">
              {format(nextPeriod, "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm bg-pink-50 p-3 rounded-lg">
            <span className="font-medium text-pink-700">Fertile Window</span>
            <span className="font-bold text-pink-600">
              {format(fertileStart, "MMM dd")} - {format(fertileEnd, "MMM dd")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({
  title,
  value,
  icon,
  description,
  trend = null,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: number | null;
}) {
  return (
    <Card className="transition-all hover:shadow-lg bg-gradient-to-br from-white to-pink-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-pink-100 rounded-lg">{icon}</div>
            <h3 className="text-sm font-medium text-pink-700">{title}</h3>
          </div>
          <span className="text-2xl font-bold text-pink-600">{value}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend !== null && (
            <span
              className={`text-xs ${
                trend > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WellnessMetrics({  }: { userProfile: any }) {
  const wellnessData = [
    { name: "Mon", value: 65, mood: "Good" },
    { name: "Tue", value: 75, mood: "Great" },
    { name: "Wed", value: 85, mood: "Excellent" },
    { name: "Thu", value: 70, mood: "Good" },
    { name: "Fri", value: 90, mood: "Excellent" },
    { name: "Sat", value: 80, mood: "Great" },
    { name: "Sun", value: 85, mood: "Great" },
  ];

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100">
        <CardTitle className="text-pink-700">Wellness Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={wellnessData}>
              <XAxis dataKey="name" stroke="#d11573" />
              <YAxis stroke="#d11573" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #d11573",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#d11573"
                strokeWidth={2}
                dot={{ fill: "#d11573", strokeWidth: 2 }}
                activeDot={{ r: 8, fill: "#d11573" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {wellnessData.slice(-3).map((day, index) => (
            <div
              key={index}
              className="text-center p-2 bg-pink-50 rounded-lg shadow-sm"
            >
              <p className="text-sm font-medium text-pink-700">{day.name}</p>
              <p className="text-xs text-pink-600">{day.mood}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
function EnergyLevels() {
    const energyLevels = [
      { time: "Morning", level: 75 },
      { time: "Afternoon", level: 85 },
      { time: "Evening", level: 60 },
    ];
  
    return (
      <Card className="hover:shadow-lg transition-all">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100">
          <CardTitle className="text-pink-700">Daily Energy Levels</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {energyLevels.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{item.time}</span>
                <span className="text-muted-foreground">
                  {item.level}%
                </span>
              </div>
              <Progress
                value={item.level}
                className="h-2"
                style={{ backgroundColor: "#fed7e2" }}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  function getDaysSinceLastPeriod(lastPeriod: string) {
    const today = new Date();
    const last = new Date(lastPeriod);
    return Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  function PeriodPredictor({
    cycleLength,
    lastPeriod,
  }: {
    cycleLength: number;
    lastPeriod: string;
  }) {
    const nextPeriod = addDays(new Date(lastPeriod), cycleLength);
    const daysSince = getDaysSinceLastPeriod(lastPeriod);
    const progress = ((cycleLength - daysSince) / cycleLength) * 100;
  
    return (
      <Card className="hover:shadow-lg transition-all">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100">
          <CardTitle className="text-pink-700">Period Prediction</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Next Period</span>
                <span className="text-pink-600 font-bold">
                  {format(nextPeriod, "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Cycle Length</span>
                <span className="text-pink-600 font-bold">{cycleLength} days</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Cycle Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress
                value={progress}
                className="h-2"
                style={{ backgroundColor: "#fed7e2" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function RecommendationCard({ userProfile }: { userProfile: any }) {
    return (
      <Card className="hover:shadow-lg transition-all">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100">
          <CardTitle className="text-pink-700">
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {userProfile.exerciseHabits === "moderate" && (
            <p>🏃‍♀️ Consider increasing your exercise frequency to 4-5 times per week</p>
          )}
          {userProfile.diet === "vegetarian" && (
            <p>🥗 Ensure adequate protein intake using varied plant-based sources</p>
          )}
          {userProfile.sleepQuality === "good" && (
            <p>😴 Maintain your excellent sleep routine</p>
          )}
          {userProfile.stressLevel === "moderate" && (
            <p>🧘‍♀️ Try daily meditation to help manage stress levels</p>
          )}
        </CardContent>
      </Card>
    );
  }
  
  export default function DashboardPage() {
    // Simulated user profile (this data might come from an API in a real app)
    const userProfile = {
      name: "Sarah",
      age: 28,
      bmi: 22.5,
      bloodPressure: "120/80",
      cholesterol: 180,
      cycleLength: 28,
      lastPeriod: "2025-02-01",
      exerciseHabits: "moderate",
      sleepQuality: "good",
      stressLevel: "moderate",
      diet: "vegetarian",
    };
  
    return (
      <div className="container p-6 space-y-6">
        {/* Header & Calendar */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">
              Welcome Back, {userProfile.name}
            </h1>
            <p className="text-muted-foreground">
              Here is your health overview
            </p>
           
                    <SplineClient />
                
          </div>
          <PeriodCalendar
            lastPeriod={userProfile.lastPeriod}
            cycleLength={userProfile.cycleLength}
          />
        </div>
  
        {/* Metrics Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="BMI"
            value={userProfile.bmi}
            icon={<Activity className="w-4 h-4" />}
            description="Healthy Range"
          />
          <MetricCard
            title="Blood Pressure"
            value={userProfile.bloodPressure}
            icon={<Heart className="w-4 h-4" />}
            description="Normal"
          />
          <MetricCard
            title="Sleep Quality"
            value={userProfile.sleepQuality}
            icon={<Moon className="w-4 h-4" />}
            description="8 hrs avg"
          />
          <MetricCard
            title="Stress Level"
            value={userProfile.stressLevel}
            icon={<Sun className="w-4 h-4" />}
            description="Managing well"
          />
        </div>
  
        {/* Charts & Energy */}
        <div className="grid gap-6 md:grid-cols-2">
          <WellnessMetrics userProfile={userProfile} />
          <EnergyLevels />
        </div>
  
        {/* Period Predictor & Recommendations */}
        <div className="grid gap-6 md:grid-cols-2">
          <PeriodPredictor
            cycleLength={userProfile.cycleLength}
            lastPeriod={userProfile.lastPeriod}
          />
          <RecommendationCard userProfile={userProfile} />
        </div>
      </div>
    );
  }
  