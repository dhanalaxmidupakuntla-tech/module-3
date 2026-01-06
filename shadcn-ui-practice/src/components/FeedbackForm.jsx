import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const FeedbackForm = () => {
  const [form, setForm] = useState({ name: "", email: "", feedback: "" });
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = () => {
    setSubmitted(form);
    setForm({ name: "", email: "", feedback: "" });
  };

  return (
    <Card>
      <CardHeader className="font-bold text-lg">Feedback Form</CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Textarea
          placeholder="Feedback"
          value={form.feedback}
          onChange={(e) => setForm({ ...form, feedback: e.target.value })}
        />
        <Button onClick={handleSubmit}>Submit</Button>

        {submitted && (
          <div className="mt-4 text-sm">
            <p><b>Name:</b> {submitted.name}</p>
            <p><b>Email:</b> {submitted.email}</p>
            <p><b>Feedback:</b> {submitted.feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
