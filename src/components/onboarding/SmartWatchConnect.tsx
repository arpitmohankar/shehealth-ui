"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface SmartWatchConnectProps {
  onNext: (data: Record<string, unknown>) => void;
}

export function SmartWatchConnect({ onNext }: SmartWatchConnectProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "connected">("idle");
  const [selectedWatch, setSelectedWatch] = useState<string | null>(null);

  const watches = [
    { id: "rolex-submariner", label: "Rolex Submariner" },
    { id: "omega-speedmaster", label: "Omega Speedmaster" },
    { id: "patek-nautilus", label: "Patek Philippe Nautilus" },
    { id: "audemars-royal-oak", label: "Audemars Piguet Royal Oak" },
    { id: "tag-carrera", label: "Tag Heuer Carrera" },
    { id: "seiko-prospex", label: "Seiko Prospex" },
    { id: "casio-gshock", label: "Casio G-Shock" },
    { id: "iwc-portugieser", label: "IWC Portugieser" },
  ];

  const handleConnect = async () => {
    if (!selectedWatch) return alert("Please select a smart watch to connect.");
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("connected");
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Connect Your Smart Watch</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "idle" && (
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
              onClick={handleConnect}
              className="w-full mt-4"
              disabled={!selectedWatch}
            >
              Connect
            </Button>
          </div>
        )}
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Retrieving data from your {selectedWatch}...</p>
          </div>
        )}
        {status === "connected" && (
          <div className="text-center">
            <p className="text-green-600 font-medium">
              Your {selectedWatch?.replace(/-/g, " ")} is connected successfully!
            </p>
            <Button onClick={() => onNext({})} className="mt-4 w-full">
              Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
