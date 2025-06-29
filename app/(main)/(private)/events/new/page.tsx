import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import EventForm from "@/components/forms/EventForm";
const NewEventPage = () => {
  return(
    <Card className="max-w-md mx-auto border-8 border-blue-200 shadow-2xl shadow-accent-foreground">
  <CardHeader>
    <CardTitle>New Event</CardTitle>
    {/* <CardDescription></CardDescription>
    <CardAction>Card Action</CardAction> */}
  </CardHeader>
  <CardContent>
    <EventForm />
  </CardContent>
 
</Card>
  )
};

export default NewEventPage;
