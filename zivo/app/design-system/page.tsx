"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DesignSystemPage() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="container mx-auto py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">ZIVO Design System</h1>
        <p className="text-muted-foreground">A comprehensive guide to the updated UI components and styles</p>
      </div>

      <Tabs defaultValue="colors">
        <TabsList className="mb-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="forms">Form Elements</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="badges">Badges & Status</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>The primary colors used throughout the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-primary flex items-end p-2">
                    <span className="text-white font-medium">Primary</span>
                  </div>
                  <p className="text-sm text-muted-foreground">#2596BE</p>
                </div>
                
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-status-confirmed flex items-end p-2">
                    <span className="text-status-confirmedText font-medium">Confirmed</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Soft Green</p>
                </div>

                <div className="space-y-2">


\
