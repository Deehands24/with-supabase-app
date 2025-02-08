"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProjectFormData {
  title: string;
  description: string;
  thumbnail_url: string;
  project_url: string;
  github_url: string;
  tech_used: string[];
  published: boolean;
}

export default function ProjectForm({
  params,
}: {
  params: { action: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const isEditing = params.action === "edit";

  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    thumbnail_url: "",
    project_url: "",
    github_url: "",
    tech_used: [],
    published: false,
  });

  useEffect(() => {
    if (isEditing) {
      // Fetch project data if editing
      const fetchProject = async () => {
        const { data: project } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .single();

        if (project) {
          setFormData(project);
        }
      };

      fetchProject();
    }
  }, [isEditing, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      if (isEditing) {
        await supabase
          .from("projects")
          .update(formData)
          .eq("id", params.id);
      } else {
        await supabase.from("projects").insert([
          {
            ...formData,
            user_id: user.id,
          },
        ]);
      }

      toast({
        title: `Project ${isEditing ? "updated" : "created"} successfully!`,
        description: "Your changes have been saved.",
      });

      router.push("/protected");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTechStack = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tech_used: [...(prev.tech_used || []), techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const removeTech = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_used: prev.tech_used.filter((tech) => tech !== techToRemove),
    }));
  };

  return (
    <div className="flex-1 flex flex-col gap-8 max-w-4xl px-4 py-8 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Project" : "Add New Project"}
        </h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  thumbnail_url: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="project_url">Project URL</Label>
            <Input
              id="project_url"
              type="url"
              value={formData.project_url}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  project_url: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              type="url"
              value={formData.github_url}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  github_url: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tech_stack">Technologies Used</Label>
            <Input
              id="tech_stack"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={addTechStack}
              placeholder="Type and press Enter to add"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tech_used?.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-secondary rounded-full text-sm flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, published: checked }))
              }
            />
            <Label htmlFor="published">Publish Project</Label>
          </div>

          <div className="flex gap-4 mt-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Project"
                : "Create Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 